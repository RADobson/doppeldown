import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@/components/analytics'
import { OrganizationSchema, WebSiteSchema } from '@/components/structured-data'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://doppeldown.com'),
  title: {
    default: 'DoppelDown - AI Brand Protection for SMBs | From $0/mo',
    template: '%s | DoppelDown',
  },
  description: 'Protect your brand from phishing attacks, typosquatting, fake social accounts, and brand impersonation. AI-powered detection from $0/month — not $15K/year. Start free today.',
  keywords: [
    'brand protection',
    'brand protection software',
    'phishing detection',
    'typosquatting detection',
    'domain monitoring',
    'takedown service',
    'fake account detection',
    'brand impersonation',
    'brand monitoring',
    'domain security',
    'anti-phishing',
    'brand protection for small business',
    'affordable brand protection',
  ],
  authors: [{ name: 'DoppelDown', url: 'https://doppeldown.com' }],
  creator: 'DoppelDown',
  publisher: 'Dobson Development Pty Ltd',
  alternates: {
    canonical: 'https://doppeldown.com',
  },
  openGraph: {
    title: 'DoppelDown - Brand Protection That Doesn\'t Cost $15K/Year',
    description: 'AI-powered detection of fake domains, phishing sites & brand impostors. Free tier included. Results in minutes, not weeks.',
    url: 'https://doppeldown.com',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoppelDown - Brand Protection That Doesn\'t Cost $15K/Year',
    description: 'AI-powered detection of fake domains, phishing sites & brand impostors. Free tier included forever.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <OrganizationSchema />
        <WebSiteSchema />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
