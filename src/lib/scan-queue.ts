/**
 * Rate-limited queues for external API calls during scanning.
 * Each queue respects provider-specific rate limits.
 */
import PQueue from 'p-queue'
import { QUEUE_CONFIG } from './constants'

/**
 * DNS lookups (Google/Cloudflare DNS over HTTPS)
 * Conservative: 10 requests/second
 */
export const dnsQueue = new PQueue({
  concurrency: QUEUE_CONFIG.DNS_QUEUE.concurrency,
  interval: QUEUE_CONFIG.DNS_QUEUE.interval,
  intervalCap: QUEUE_CONFIG.DNS_QUEUE.intervalCap
})

/**
 * Web search API (DuckDuckGo, SerpAPI)
 * Conservative: 2 requests/second
 */
export const searchQueue = new PQueue({
  concurrency: QUEUE_CONFIG.SEARCH_QUEUE.concurrency,
  interval: QUEUE_CONFIG.SEARCH_QUEUE.interval,
  intervalCap: QUEUE_CONFIG.SEARCH_QUEUE.intervalCap
})

/**
 * Screenshot capture (Puppeteer - memory intensive)
 * Serial: 1 request/2 seconds
 */
export const screenshotQueue = new PQueue({
  concurrency: QUEUE_CONFIG.SCREENSHOT_QUEUE.concurrency,
  interval: QUEUE_CONFIG.SCREENSHOT_QUEUE.interval,
  intervalCap: QUEUE_CONFIG.SCREENSHOT_QUEUE.intervalCap
})

/**
 * OpenAI API calls (Vision analysis)
 * Tier-dependent: 50 requests/minute conservative
 */
export const openaiQueue = new PQueue({
  concurrency: QUEUE_CONFIG.OPENAI_QUEUE.concurrency,
  interval: QUEUE_CONFIG.OPENAI_QUEUE.interval,
  intervalCap: QUEUE_CONFIG.OPENAI_QUEUE.intervalCap
})

/**
 * General external API calls (WHOIS, etc.)
 * Moderate: 5 requests/second
 */
export const externalQueue = new PQueue({
  concurrency: QUEUE_CONFIG.EXTERNAL_QUEUE.concurrency,
  interval: QUEUE_CONFIG.EXTERNAL_QUEUE.interval,
  intervalCap: QUEUE_CONFIG.EXTERNAL_QUEUE.intervalCap
})

/**
 * Wait for all queues to clear (useful for graceful shutdown)
 * @returns Promise that resolves when all queues are idle
 */
export async function waitForAllQueues(): Promise<void> {
  await Promise.all([
    dnsQueue.onIdle(),
    searchQueue.onIdle(),
    screenshotQueue.onIdle(),
    openaiQueue.onIdle(),
    externalQueue.onIdle()
  ])
}

/**
 * Clear all pending tasks from queues (for cancellation)
 */
export function clearAllQueues(): void {
  dnsQueue.clear()
  searchQueue.clear()
  screenshotQueue.clear()
  openaiQueue.clear()
  externalQueue.clear()
}

/**
 * Get current queue statistics
 * @returns Object with pending counts for each queue
 */
export function getQueueStats(): {
  dns: number
  search: number
  screenshot: number
  openai: number
  external: number
  total: number
} {
  const stats = {
    dns: dnsQueue.pending + dnsQueue.size,
    search: searchQueue.pending + searchQueue.size,
    screenshot: screenshotQueue.pending + screenshotQueue.size,
    openai: openaiQueue.pending + openaiQueue.size,
    external: externalQueue.pending + externalQueue.size,
    total: 0
  }
  stats.total = stats.dns + stats.search + stats.screenshot + stats.openai + stats.external
  return stats
}
