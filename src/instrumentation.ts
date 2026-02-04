/**
 * Next.js Instrumentation Hook
 * 
 * This file is automatically loaded by Next.js on server startup.
 * It initializes the monitoring system before any requests are served.
 * 
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only initialize server-side monitoring in the Node.js runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initMonitoring } = await import('@/lib/monitoring/init')
    initMonitoring()
  }
}
