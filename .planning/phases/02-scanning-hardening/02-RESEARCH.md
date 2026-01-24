# Phase 02: Scanning Hardening - Research

**Researched:** 2026-01-25
**Domain:** Error handling, retry logic, rate limiting, progress tracking
**Confidence:** HIGH

## Summary

This phase hardens the existing scan infrastructure to handle failures gracefully without crashing entire scans. The codebase already has a solid foundation with a background worker (`scan-worker.ts`), job queue system (`scan_jobs` table), and progress tracking via database polling. The key gaps are: (1) individual API calls can crash entire scan loops, (2) no rate limiting for external APIs, (3) retry logic exists at job level but not API call level, and (4) progress UI lacks percentage/step visibility.

The standard approach combines:
- **Wrap-and-continue pattern**: Try/catch around each API call, continue on failure, aggregate errors
- **Rate-limited queue**: Use p-queue with intervalCap for external API calls (DNS, search, screenshots)
- **Exponential backoff with jitter**: For retry logic, respect Retry-After headers on 429s
- **Database-driven progress**: Add step/total fields to scans table, poll from frontend

**Primary recommendation:** Refactor scan-runner.ts to use a rate-limited queue (p-queue) for all external API calls, wrap each call in try/catch that captures partial results, and add progress percentage to the scans table schema.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| p-queue | ^8.0.1 | Rate-limited async queue | 80M+ weekly downloads, supports intervalCap/interval for rate limiting, ESM native |
| AbortController | native | Request cancellation | Built-in, works with fetch, no dependencies |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| exponential-backoff | ^3.1.1 | Retry with backoff/jitter | When p-queue's built-in retry insufficient |
| p-retry | ^6.2.0 | Promise retry wrapper | Alternative to exponential-backoff |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| p-queue | bottleneck | bottleneck more features but heavier, p-queue simpler for this use case |
| Database polling | WebSocket/SSE | WebSocket adds complexity, polling already works, 4s interval acceptable |
| External job queue | Redis/BullMQ | Overkill for single-worker setup, adds infrastructure |

**Installation:**
```bash
npm install p-queue
# exponential-backoff only if needed for complex retry scenarios
```

**Note:** p-queue v8+ is ESM-only. The codebase already uses ESM (tsx for worker, Next.js for app), so this is fine.

## Architecture Patterns

### Recommended Project Structure
```
src/lib/
├── scan-runner.ts       # Main orchestration (existing, refactor)
├── scan-queue.ts        # NEW: Rate-limited queue wrapper
├── api-client.ts        # NEW: Unified API caller with retry/timeout
├── domain-generator.ts  # DNS checks (modify to use queue)
├── web-scanner.ts       # Search API calls (modify to use queue)
├── logo-scanner.ts      # Vision API calls (modify to use queue)
├── social-scanner.ts    # Social search (modify to use queue)
├── evidence-collector.ts # Screenshots/WHOIS (modify to use queue)
└── openai-analysis.ts   # OpenAI calls (modify to use queue)
```

### Pattern 1: Rate-Limited Queue for External APIs

**What:** Single queue instance managing all external API calls with rate limits per provider
**When to use:** All external API calls (DNS, search, screenshots, OpenAI)

```typescript
// src/lib/scan-queue.ts
import PQueue from 'p-queue';

// Separate queues per rate limit profile
export const dnsQueue = new PQueue({
  concurrency: 5,        // parallel requests
  interval: 1000,        // per second
  intervalCap: 10        // max 10/second (Google/Cloudflare DNS)
});

export const searchQueue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 2         // DuckDuckGo/SerpAPI conservative
});

export const screenshotQueue = new PQueue({
  concurrency: 1,        // Puppeteer serial
  interval: 2000,
  intervalCap: 1
});

export const openaiQueue = new PQueue({
  concurrency: 3,
  interval: 60000,       // per minute
  intervalCap: 50        // respect tier limits
});
```

### Pattern 2: Wrap-and-Continue with Error Aggregation

**What:** Each API call wrapped in try/catch, failures captured but don't stop scan
**When to use:** Every external call in scan-runner loop

```typescript
// Pattern for domain checking loop
const errors: ScanError[] = [];

for (const variation of variationsToCheck) {
  try {
    const isRegistered = await dnsQueue.add(() =>
      checkDomainRegistration(variation.domain)
    );
    domainsChecked++;

    if (isRegistered) {
      // Process threat...
    }
  } catch (err) {
    errors.push({
      type: 'dns_check',
      domain: variation.domain,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    // Continue to next domain - don't crash scan
  }

  // Check cancellation periodically
  if (domainsChecked % CANCEL_CHECK_EVERY === 0) {
    await ensureNotCancelled();
  }
}

// Store errors in scan record for debugging
await supabase.from('scans').update({
  partial_errors: errors
}).eq('id', scanId);
```

### Pattern 3: Exponential Backoff with Jitter for Retries

**What:** Retry failed requests with increasing delays plus randomness
**When to use:** Transient failures (timeouts, 5xx, 429)

```typescript
// src/lib/api-client.ts
async function fetchWithRetry(
  url: string,
  options: RequestInit & { maxRetries?: number } = {}
) {
  const maxRetries = options.maxRetries ?? 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal ?? AbortSignal.timeout(
          parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10)
        )
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown');

      if (attempt < maxRetries) {
        // Exponential backoff with full jitter
        const baseDelay = Math.min(30000, 1000 * Math.pow(2, attempt));
        const jitter = Math.random() * baseDelay;
        await sleep(jitter);
      }
    }
  }

  throw lastError;
}
```

### Pattern 4: Progress Tracking with Step/Total

**What:** Track current step and total steps for percentage calculation
**When to use:** Update scans table during each phase of scan

```typescript
// Enhanced progress tracking
type ScanProgress = {
  current_step: string;           // 'domains' | 'web' | 'logo' | 'social'
  step_progress: number;          // Items completed in current step
  step_total: number;             // Total items in current step
  overall_progress: number;       // 0-100 percentage
};

// Calculate percentage
function calculateProgress(
  step: string,
  stepProgress: number,
  stepTotal: number,
  mode: ScanMode
): number {
  const weights = {
    domains: mode.domains ? 40 : 0,
    web: mode.web ? 25 : 0,
    logo: mode.logo ? 15 : 0,
    social: mode.social ? 20 : 0
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const stepWeight = weights[step as keyof typeof weights] || 0;

  // ... calculate cumulative progress
}
```

### Anti-Patterns to Avoid

- **Throwing from loops:** Never let a single API error throw and exit the entire scan loop
- **Shared mutable state:** Don't share AbortController across requests - create new per request
- **Unbounded retries:** Always cap retries (3-5 max) and total backoff time (30s cap)
- **Polling without backoff:** If scan API fails to respond, client should slow polling rate
- **Swallowing errors silently:** Always capture and surface errors, even if scan continues

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rate limiting queue | Custom setInterval throttle | p-queue | Handles edge cases: pause, clear, priority, events |
| Exponential backoff | Manual delay calculation | Built formula or library | Full jitter, cap, abort signal handling |
| Request timeout | setTimeout + abort | AbortSignal.timeout() | Native, cleaner, proper cleanup |
| Retry logic | Recursive function | p-retry or manual loop | Cleaner separation, testable |
| Progress percentage | Manual math | Weighted step calculation | Avoid floating point errors, handle edge cases |

**Key insight:** The codebase already has partial implementations (sleep, timeout env vars). Extend these rather than replacing wholesale. p-queue integrates cleanly with existing fetch calls.

## Common Pitfalls

### Pitfall 1: AbortController Reuse After Abort
**What goes wrong:** Once AbortController is aborted, all requests using its signal fail immediately
**Why it happens:** Trying to reuse a single controller across retry attempts
**How to avoid:** Create new AbortController per request, or per retry attempt
**Warning signs:** All retries fail instantly after first abort

### Pitfall 2: Rate Limit Thundering Herd
**What goes wrong:** After rate limit pause, all queued requests fire at once
**Why it happens:** Simple queue empties immediately when unpaused
**How to avoid:** p-queue's interval/intervalCap maintains spacing even after pause
**Warning signs:** 429s appearing in bursts after successful period

### Pitfall 3: Lost Partial Results on Cancel
**What goes wrong:** User cancels scan, all in-progress work is lost
**Why it happens:** Cancel throws error that bubbles up without saving
**How to avoid:** Catch cancel specifically, save partial results, then re-throw
**Warning signs:** Scan marked failed with 0 threats even though progress showed findings

### Pitfall 4: Database Polling Overload
**What goes wrong:** Frontend polls too fast, creates DB load
**Why it happens:** setInterval(poll, 1000) on many clients
**How to avoid:** Use 4s intervals (already configured), add exponential backoff on errors
**Warning signs:** Database CPU spikes during active scans

### Pitfall 5: Puppeteer Resource Exhaustion
**What goes wrong:** Multiple screenshot captures crash worker
**Why it happens:** Concurrent browser launches exhaust memory
**How to avoid:** Serial queue (concurrency: 1) for Puppeteer operations
**Warning signs:** Worker crashes with OOM, zombie Chrome processes

### Pitfall 6: Progress Never Reaches 100%
**What goes wrong:** UI shows 95% forever even though scan completed
**Why it happens:** Rounding errors, or final update happens after status change
**How to avoid:** Force 100% progress when setting status to 'completed'
**Warning signs:** Completed scans showing <100% in UI

## Code Examples

Verified patterns from official sources and codebase analysis:

### p-queue Basic Usage
```typescript
// Source: https://github.com/sindresorhus/p-queue
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 5
});

// Add tasks
const result = await queue.add(() => fetch(url));

// Wait for queue to empty
await queue.onIdle();

// Check queue state
console.log(queue.pending);  // Running tasks
console.log(queue.size);     // Waiting tasks

// Pause/resume
queue.pause();
queue.start();

// Clear waiting tasks (does not cancel running)
queue.clear();
```

### AbortSignal.timeout() Usage
```typescript
// Source: MDN Web Docs
// Built-in timeout without manual AbortController
const response = await fetch(url, {
  signal: AbortSignal.timeout(5000)  // 5 second timeout
});

// Combine with manual abort capability
const controller = new AbortController();
const response = await fetch(url, {
  signal: AbortSignal.any([
    controller.signal,
    AbortSignal.timeout(5000)
  ])
});

// Cancel manually
controller.abort('User requested cancel');
```

### Retry-After Header Handling
```typescript
// Source: MDN HTTP 429 documentation
async function handleRateLimit(response: Response): Promise<number> {
  if (response.status !== 429) return 0;

  const retryAfter = response.headers.get('Retry-After');
  if (!retryAfter) return 5000; // Default 5s

  // Retry-After can be seconds or HTTP-date
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) return seconds * 1000;

  // Parse as date
  const date = new Date(retryAfter);
  return Math.max(0, date.getTime() - Date.now());
}
```

### Database Progress Update (Existing Pattern Extended)
```typescript
// Based on existing scan-runner.ts updateProgress()
const updateProgress = async (
  step: string,
  stepProgress: number,
  stepTotal: number,
  force: boolean = false
) => {
  const nowMs = Date.now();
  if (!force && nowMs - lastProgressUpdate < PROGRESS_UPDATE_INTERVAL_MS) return;
  lastProgressUpdate = nowMs;

  const overallProgress = calculateOverallProgress(step, stepProgress, stepTotal, mode);

  try {
    await supabase
      .from('scans')
      .update({
        status: 'running',
        current_step: step,
        step_progress: stepProgress,
        step_total: stepTotal,
        overall_progress: overallProgress,
        domains_checked: domainsChecked,
        pages_scanned: pagesScanned,
        threats_found: threatsFound
      })
      .eq('id', scanId);
  } catch (err) {
    console.warn('Failed to update scan progress:', err);
  }
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sequential API calls | Rate-limited async queues | Common since 2020 | Better throughput, respects limits |
| Manual setTimeout retry | AbortSignal.timeout() + structured retry | Node 20+/browsers 2023 | Cleaner code, proper cleanup |
| Polling every 1s | 4s polling with backoff | Industry standard | Reduced DB load |
| All-or-nothing scans | Partial results + error aggregation | Best practice | No lost work |

**Deprecated/outdated:**
- `request` npm package: Use native fetch (Node 18+)
- Manual Promise.race for timeout: Use AbortSignal.timeout()
- BullMQ for simple queues: Overkill without Redis infrastructure

## Open Questions

Things that couldn't be fully resolved:

1. **OpenAI API Path Issue**
   - What we know: Prior context mentions "OpenAI Vision endpoint uses wrong API path"
   - What's unclear: Exact nature of the issue (404? wrong model endpoint?)
   - Recommendation: Investigate `/v1/responses` endpoint in openai-analysis.ts during implementation; may need to change to `/v1/chat/completions` or similar

2. **Scan Cancellation Race Condition**
   - What we know: Prior context mentions "Scan cancellation not fully tested"
   - What's unclear: Specific failure modes (double-cancel, cancel during save, etc.)
   - Recommendation: Add integration tests for cancel scenarios; ensure partial results saved before marking cancelled

3. **External API Rate Limits**
   - What we know: DuckDuckGo, Google Vision, SerpAPI, DNS providers all have limits
   - What's unclear: Exact limits vary by API key tier, some undocumented
   - Recommendation: Start conservative (2 req/sec search, 10 req/sec DNS), monitor 429s, adjust

## Sources

### Primary (HIGH confidence)
- Codebase analysis: scan-runner.ts, scan-worker.ts, domain-generator.ts, web-scanner.ts, logo-scanner.ts, social-scanner.ts, evidence-collector.ts, openai-analysis.ts
- Database schema: supabase/schema.sql (scans, scan_jobs tables)
- [p-queue npm](https://www.npmjs.com/package/p-queue) - Rate limiting queue documentation
- [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) - Native cancellation API
- [MDN HTTP 429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429) - Rate limit handling

### Secondary (MEDIUM confidence)
- [Exponential Backoff Best Practices](https://betterstack.com/community/guides/monitoring/exponential-backoff/) - Industry patterns
- [Node.js Retry Logic Patterns](https://v-checha.medium.com/advanced-node-js-patterns-implementing-robust-retry-logic-656cf70f8ee9) - Implementation examples
- [API Rate Limiting Guide](https://www.ayrshare.com/complete-guide-to-handling-rate-limits-prevent-429-errors/) - 429 handling strategies

### Tertiary (LOW confidence)
- Various npm-compare pages for library selection (validated against npm downloads and GitHub stars)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - p-queue is dominant, well-documented, ESM-ready
- Architecture: HIGH - Patterns directly derived from codebase analysis and established practices
- Pitfalls: HIGH - Based on codebase review and common failure modes

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (stable domain, 30 days)
