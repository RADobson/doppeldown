/**
 * Rate-limited queues for external API calls during scanning.
 * Each queue respects provider-specific rate limits.
 */
import PQueue from 'p-queue';

// DNS lookups (Google/Cloudflare DNS over HTTPS)
// Conservative: 10 requests/second
export const dnsQueue = new PQueue({
  concurrency: 5,
  interval: 1000,
  intervalCap: 10
});

// Web search API (DuckDuckGo, SerpAPI)
// Conservative: 2 requests/second
export const searchQueue = new PQueue({
  concurrency: 2,
  interval: 1000,
  intervalCap: 2
});

// Screenshot capture (Puppeteer - memory intensive)
// Serial: 1 request/2 seconds
export const screenshotQueue = new PQueue({
  concurrency: 1,
  interval: 2000,
  intervalCap: 1
});

// OpenAI API calls (Vision analysis)
// Tier-dependent: 50 requests/minute conservative
export const openaiQueue = new PQueue({
  concurrency: 3,
  interval: 60000,
  intervalCap: 50
});

// General external API calls (WHOIS, etc.)
// Moderate: 5 requests/second
export const externalQueue = new PQueue({
  concurrency: 3,
  interval: 1000,
  intervalCap: 5
});

// Helper to wait for all queues to clear (useful for graceful shutdown)
export async function waitForAllQueues(): Promise<void> {
  await Promise.all([
    dnsQueue.onIdle(),
    searchQueue.onIdle(),
    screenshotQueue.onIdle(),
    openaiQueue.onIdle(),
    externalQueue.onIdle()
  ]);
}

// Helper to clear all pending tasks (for cancellation)
export function clearAllQueues(): void {
  dnsQueue.clear();
  searchQueue.clear();
  screenshotQueue.clear();
  openaiQueue.clear();
  externalQueue.clear();
}
