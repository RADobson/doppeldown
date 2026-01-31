import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@/components/analytics'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://doppeldown.com'),
  title: {
    default: 'DoppelDown - Take Down Brand Impostors',
    template: '%s | DoppelDown',
  },
  description: 'Protect your brand from phishing attacks, typosquatting, fake social accounts, and brand impersonation. Automated monitoring and takedown support.',
  keywords: ['brand protection', 'phishing detection', 'typosquatting', 'domain monitoring', 'takedown', 'fake accounts'],
  openGraph: {
    title: 'DoppelDown - Take Down Brand Impostors',
    description: 'Detect threats. Collect evidence. Take action.',
    url: 'https://doppeldown.com',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoppelDown - Take Down Brand Impostors',
    description: 'Detect threats. Collect evidence. Take action.',
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
