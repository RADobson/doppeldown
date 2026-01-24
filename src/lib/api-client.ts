/**
 * HTTP client with retry, timeout, and rate limit handling.
 * Used by scanner modules for safe external API calls.
 */

// Read timeout from env or default to 10s
const DEFAULT_TIMEOUT_MS = parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '10000', 10);
const DEFAULT_MAX_RETRIES = 3;
const MAX_BACKOFF_MS = 30000;

export type FetchResult<T> =
  | { success: true; data: T; response: Response }
  | { success: false; error: string; retryable: boolean };

export interface FetchOptions extends Omit<RequestInit, 'signal'> {
  timeoutMs?: number;
  maxRetries?: number;
  // If provided, can cancel the request externally
  abortSignal?: AbortSignal;
}

/**
 * Sleep helper with optional abort
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Sleep aborted'));
      }, { once: true });
    }
  });
}

/**
 * Calculate backoff with full jitter
 * Base: 1s, 2s, 4s, 8s... capped at MAX_BACKOFF_MS
 */
function calculateBackoff(attempt: number): number {
  const baseDelay = Math.min(MAX_BACKOFF_MS, 1000 * Math.pow(2, attempt));
  // Full jitter: random between 0 and baseDelay
  return Math.random() * baseDelay;
}

/**
 * Parse Retry-After header (seconds or HTTP-date)
 */
function parseRetryAfter(header: string | null): number {
  if (!header) return 5000; // Default 5s

  const seconds = parseInt(header, 10);
  if (!isNaN(seconds)) return seconds * 1000;

  // Try HTTP-date
  const date = new Date(header);
  if (!isNaN(date.getTime())) {
    return Math.max(0, date.getTime() - Date.now());
  }

  return 5000;
}

/**
 * Fetch with automatic retry, timeout, and rate limit handling.
 * Returns a result object instead of throwing - enables wrap-and-continue pattern.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<Response>> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    abortSignal,
    ...fetchOptions
  } = options;

  let lastError = 'Unknown error';
  let retryable = false;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create timeout signal
      const timeoutSignal = AbortSignal.timeout(timeoutMs);

      // Combine with external abort signal if provided
      const combinedSignal = abortSignal
        ? AbortSignal.any([timeoutSignal, abortSignal])
        : timeoutSignal;

      const response = await fetch(url, {
        ...fetchOptions,
        signal: combinedSignal
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
        lastError = `Rate limited (429), retry after ${retryAfterMs}ms`;
        retryable = true;

        if (attempt < maxRetries) {
          await sleep(retryAfterMs, abortSignal);
          continue;
        }
        break;
      }

      // Handle server errors (5xx) with retry
      if (response.status >= 500) {
        lastError = `Server error (${response.status})`;
        retryable = true;

        if (attempt < maxRetries) {
          const backoff = calculateBackoff(attempt);
          await sleep(backoff, abortSignal);
          continue;
        }
        break;
      }

      // Success or client error (4xx except 429)
      return {
        success: true,
        data: response,
        response
      };

    } catch (err) {
      // Handle abort
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message.includes('aborted')) {
          return {
            success: false,
            error: 'Request aborted',
            retryable: false
          };
        }

        if (err.name === 'TimeoutError' || err.message.includes('timeout')) {
          lastError = `Request timeout (${timeoutMs}ms)`;
          retryable = true;
        } else {
          lastError = err.message;
          retryable = true; // Network errors are typically retryable
        }
      }

      if (attempt < maxRetries) {
        const backoff = calculateBackoff(attempt);
        try {
          await sleep(backoff, abortSignal);
        } catch {
          // Sleep was aborted
          return {
            success: false,
            error: 'Request aborted during backoff',
            retryable: false
          };
        }
      }
    }
  }

  return {
    success: false,
    error: lastError,
    retryable
  };
}

/**
 * Convenience wrapper that parses JSON response
 */
export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const result = await fetchWithRetry(url, options);

  if (result.success === false) {
    return {
      success: false as const,
      error: result.error,
      retryable: result.retryable
    };
  }

  try {
    const data = await result.data.json() as T;
    return {
      success: true,
      data,
      response: result.response
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to parse JSON: ${err instanceof Error ? err.message : 'Unknown'}`,
      retryable: false
    };
  }
}
