'use client'

import Script from 'next/script'

/**
 * Minimal GA4 / Google Ads gtag loader.
 *
 * Env:
 * - NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXX
 * - NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXX (optional)
 */
export function Analytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

  // If neither is configured, render nothing.
  if (!ga4 && !ads) return null

  // Use GA4 id if present; otherwise use Ads id to load gtag.
  const primaryId = ga4 ?? ads

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId!)}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());

// Configure GA4 first (preferred).
${ga4 ? `gtag('config', '${ga4}', { anonymize_ip: true });` : ''}

// Configure Google Ads (for conversion tracking) if present.
${ads ? `gtag('config', '${ads}');` : ''}
        `}
      </Script>
    </>
  )
}

/**
 * Fire a gtag event safely (no-op if gtag isn't loaded).
 */
export function gtagEvent(eventName: string, params?: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (globalThis as any)?.gtag
  if (typeof gtag !== 'function') return
  gtag('event', eventName, params ?? {})
}
