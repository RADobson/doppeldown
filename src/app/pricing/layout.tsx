import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Brand Protection from $0/month',
  description:
    'DoppelDown pricing: Free ($0/mo), Starter ($49/mo), Pro ($99/mo), Enterprise ($249/mo). Brand protection that doesn\'t cost $15K/year. 14-day free trial, no credit card required.',
  keywords: [
    'brand protection pricing',
    'affordable brand protection',
    'brand monitoring cost',
    'phishing protection pricing',
    'domain monitoring pricing',
    'brand protection free trial',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/pricing',
  },
  openGraph: {
    title: 'DoppelDown Pricing — Brand Protection from $0/month',
    description:
      'Enterprise-grade brand protection at SMB prices. Free tier included forever. Paid plans from $49/mo with 14-day free trial.',
    url: 'https://doppeldown.com/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
