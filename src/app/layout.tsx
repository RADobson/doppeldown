import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DoppelDown - Take Down Brand Impostors',
  description: 'Protect your brand from phishing attacks, typosquatting, fake social accounts, and brand impersonation. Automated monitoring and takedown support.',
  keywords: ['brand protection', 'phishing detection', 'typosquatting', 'domain monitoring', 'takedown', 'fake accounts'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
