import Link from 'next/link'
import { Shield, Home, AlertTriangle, Search, ShieldCheck, BarChart3, Key, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for Real Estate — Stop Wire Fraud & Impersonation | DoppelDown',
  description:
    'Protect your real estate agency from wire fraud scams, domain spoofing, and agent impersonation attacks. DoppelDown monitors for lookalike domains and brand threats targeting your clients and transactions. Free tier available.',
  keywords: [
    'real estate brand protection',
    'real estate domain monitoring',
    'wire fraud protection real estate',
    'agent impersonation defense',
    'real estate phishing protection',
    'title company brand security',
    'real estate cybersecurity',
    'domain spoofing real estate',
    'real estate email compromise',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/real-estate',
  },
  openGraph: {
    title: 'Brand Protection for Real Estate | DoppelDown',
    description:
      'Stop wire fraud scams, domain spoofing, and agent impersonation with AI-powered brand monitoring. Starting at $0/month.',
    url: 'https://doppeldown.com/industries/real-estate',
  },
}

export default function RealEstateIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for Real Estate',
    description:
      'Protect your real estate agency from wire fraud scams, domain spoofing, and agent impersonation attacks with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/real-estate',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown Real Estate Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for real estate agencies, brokerages, and title companies. Detects wire fraud scams, domain spoofing, and agent impersonation attacks.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available — no credit card required',
      },
    },
  }

  return (
    <div className="min-h-screen bg-landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="bg-landing border-b border-landing-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-landing-foreground">DoppelDown</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="text-landing-muted hover:text-landing-foreground text-sm">
                Pricing
              </Link>
              <Link href="/blog" className="text-landing-muted hover:text-landing-foreground text-sm">
                Blog
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-landing-muted">
          <Link href="/" className="hover:text-landing-foreground">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/industries" className="hover:text-landing-foreground">Industries</Link>
          <span className="mx-2">›</span>
          <span className="text-landing-foreground">Real Estate</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Home className="h-4 w-4" />
            Real Estate &amp; Brokerages
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Real Estate Agencies
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Wire fraud scams, domain spoofing, and agent impersonation attacks cost real estate 
            businesses and their clients billions annually. DoppelDown detects these threats 
            automatically — so you can protect your transactions, your clients, and your reputation.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why Real Estate Is a Prime Target for Impersonation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Key,
                title: 'Wire Fraud & Transaction Scams',
                description:
                  'Attackers impersonate your agents and title companies to redirect closing funds. They register lookalike domains, spoof your email addresses, and intercept communications to send fraudulent wire instructions. A single successful wire fraud can cost a homebuyer their entire down payment — and expose your agency to lawsuits and regulatory action.',
              },
              {
                icon: Home,
                title: 'Domain Spoofing on Listings',
                description:
                  'Fraudulent websites clone your property listings to scam potential buyers and renters. These sites collect deposits and personal information from victims who believe they&apos;re dealing with your agency. The fake listings often use your actual photos and descriptions, making them nearly indistinguishable from your legitimate properties.',
              },
              {
                icon: AlertTriangle,
                title: 'Agent Impersonation Attacks',
                description:
                  'Your agents&apos; identities are cloned on social media, fake websites, and email campaigns. Scammers pose as your team members to solicit listings, collect fees, and gain access to sensitive property information. When victims realize they&apos;ve been scammed, your agency&apos;s reputation suffers — and potential sellers think twice before trusting you with their property.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-landing-elevated border border-landing-border rounded-xl p-6"
                >
                  <div className="p-2 bg-red-500/10 rounded-lg w-fit mb-4">
                    <Icon className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-landing-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-landing-muted leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How DoppelDown Helps */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            How DoppelDown Protects Real Estate Agencies
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Domain & Email Monitoring',
                description:
                  'DoppelDown continuously scans for domains impersonating your agency name, agent names, and property-related terms. Our AI generates thousands of typosquat variations and monitors new domain registrations daily — catching lookalike sites before they can target your clients.',
              },
              {
                icon: ShieldCheck,
                title: 'Fake Listing Site Detection',
                description:
                  'Our engine detects cloned property listings and fraudulent rental sites that use your agency&apos;s photos, descriptions, and branding. We analyze visual similarity and content patterns to identify impersonation before victims send deposits.',
              },
              {
                icon: BarChart3,
                title: 'Transaction-Focused Threat Intelligence',
                description:
                  'Real estate transactions have tight timelines — you can&apos;t wait weeks to detect threats. DoppelDown&apos;s AI scoring prioritizes active phishing pages and sites targeting your current listings — so you act fast when it matters most.',
              },
              {
                icon: AlertTriangle,
                title: 'Evidence for Law Enforcement & E&amp;O Claims',
                description:
                  'Each detected threat includes timestamped screenshots, WHOIS records, DNS data, and content analysis — documentation you need for FBI reports, E&amp;O insurance claims, or state real estate commission complaints. Export complete evidence packages in one click.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-landing-elevated border border-landing-border rounded-xl p-6"
                >
                  <div className="p-2 bg-primary-600/10 rounded-lg w-fit mb-4">
                    <Icon className="h-5 w-5 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-landing-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-landing-muted leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-landing-elevated border border-landing-border rounded-xl p-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500">$2.7B</div>
              <div className="text-sm text-landing-muted mt-1">lost to real estate wire fraud in 2023</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">13,000+</div>
              <div className="text-sm text-landing-muted mt-1">real estate victims of wire fraud annually</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">$185K</div>
              <div className="text-sm text-landing-muted mt-1">average loss per real estate wire fraud incident</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            Built for Real Estate Businesses of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Whether you&apos;re an independent agent or a multi-office brokerage, wire fraud and 
            impersonation threaten your transactions and your reputation. DoppelDown scales to 
            fit your needs — start free and upgrade as your business grows.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Independent Agents', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Small & Mid-Size Brokerages', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Large Brokerages & Title Companies', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
            ].map((tier) => (
              <div key={tier.label} className="bg-landing-elevated border border-landing-border rounded-xl p-5">
                <p className="text-sm font-semibold text-landing-foreground">{tier.label}</p>
                <p className="text-primary-500 font-bold mt-1">{tier.plan}</p>
                <p className="text-xs text-landing-muted mt-1">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-landing-foreground mb-6">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/blog/what-is-typosquatting-complete-guide-2026"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">What Is Typosquatting? Complete Guide</p>
              <p className="text-xs text-landing-muted mt-1">Learn how attackers target your domain with lookalike URLs.</p>
            </Link>
            <Link
              href="/blog/how-to-protect-your-brand-from-domain-squatting-and-phishing-2026"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">How to Protect Your Brand from Domain Squatting</p>
              <p className="text-xs text-landing-muted mt-1">Practical steps to defend your real estate business online.</p>
            </Link>
            <Link
              href="/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">5 Signs Your Brand Is Being Targeted by Phishing</p>
              <p className="text-xs text-landing-muted mt-1">Know the warning signs before your clients lose money.</p>
            </Link>
            <Link
              href="/blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">The True Cost of Brand Impersonation</p>
              <p className="text-xs text-landing-muted mt-1">Why reputation damage affects your listing pipeline.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your Clients &amp; Your Transactions
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring your real estate brand today — free, no credit card required.
            Detect impersonation threats before they target your clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Start Free Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-landing-elevated border border-landing-border text-landing-foreground rounded-lg hover:bg-landing transition font-medium"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
