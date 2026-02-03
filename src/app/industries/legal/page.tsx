import Link from 'next/link'
import { Shield, Scale, AlertTriangle, Search, ShieldCheck, BarChart3, Gavel, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for Law Firms — Reputation & Client Trust Defense | DoppelDown',
  description:
    'Protect your law firm from impersonation scams, fake attorney profiles, and client-targeting phishing attacks. DoppelDown monitors for lookalike domains and brand threats targeting legal practices. Free tier available.',
  keywords: [
    'law firm brand protection',
    'legal practice domain monitoring',
    'attorney impersonation protection',
    'law firm phishing defense',
    'legal brand reputation',
    'fake law firm website detection',
    'client trust protection',
    'legal cybersecurity',
    'law firm domain squatting',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/legal',
  },
  openGraph: {
    title: 'Brand Protection for Law Firms | DoppelDown',
    description:
      'Stop impersonation scams, fake attorney profiles, and client-targeting phishing with AI-powered brand monitoring. Starting at $0/month.',
    url: 'https://doppeldown.com/industries/legal',
  },
}

export default function LegalIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for Law Firms',
    description:
      'Protect your law firm from impersonation scams, fake attorney profiles, and client-targeting phishing attacks with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/legal',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown Legal Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for law firms and legal practices. Detects impersonation scams, fake attorney profiles, and client-targeting phishing attacks.',
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
          <span className="text-landing-foreground">Legal &amp; Law Firms</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="h-4 w-4" />
            Legal &amp; Law Firms
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Law Firms
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Your reputation is your most valuable asset. Fake attorney profiles, impersonation scams, 
            and client-targeting phishing attacks damage the trust you&apos;ve spent years building. 
            DoppelDown detects these threats automatically — so you can protect your practice and your clients.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why Law Firms Face Unique Brand Threats
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Scale,
                title: 'Fake Attorney Profiles',
                description:
                  'Attackers create convincing fake profiles impersonating your attorneys on social media, legal directories, and even standalone websites. These profiles reach out to potential clients, offer legal advice, and sometimes demand upfront fees. When victims realize they&apos;ve been scammed, your firm&apos;s reputation takes the hit — even though you had no involvement.',
              },
              {
                icon: Gavel,
                title: 'Client Wire Fraud Scams',
                description:
                  'Sophisticated attackers monitor your firm&apos;s communications and impersonate your attorneys to redirect client wire transfers. They register lookalike domains nearly identical to yours, send emails that appear to come from your partners, and convince clients to wire funds to fraudulent accounts. A single successful scam can cost a client hundreds of thousands and expose your firm to malpractice claims.',
              },
              {
                icon: AlertTriangle,
                title: 'Trust & Reputation Damage',
                description:
                  'Legal services are built entirely on trust and reputation. When potential clients search for your firm and find fake websites, or when existing clients receive phishing emails appearing to come from your attorneys, that trust erodes instantly. In the legal industry, reputation damage spreads quickly through professional networks and can take years to repair.',
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
            How DoppelDown Protects Law Firms
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Continuous Domain Monitoring',
                description:
                  'DoppelDown scans for domains impersonating your firm name, attorney names, and practice areas. Our AI generates thousands of typosquat and homoglyph variations, catching lookalike domains within hours of registration — before they can be used against your clients.',
              },
              {
                icon: ShieldCheck,
                title: 'Fake Website Detection',
                description:
                  'Our engine detects cloned websites that mimic your firm&apos;s site design, attorney bios, and contact information. We analyze visual similarity, content fingerprints, and SSL patterns to identify impersonation sites that could fool your potential clients.',
              },
              {
                icon: BarChart3,
                title: 'Threat Prioritization for Legal Practices',
                description:
                  'Not every similar domain poses an immediate threat. DoppelDown&apos;s AI scoring prioritizes active phishing pages and sites targeting your specific practice areas — so your administrative staff focuses on genuine risks, not parked domains.',
              },
              {
                icon: AlertTriangle,
                title: 'Evidence for Bar Complaints & Takedowns',
                description:
                  'Each detected threat includes screenshots, WHOIS data, DNS records, and content analysis — documentation you need for state bar complaints, registrar takedown requests, or law enforcement referrals. Export complete evidence packages for your malpractice insurer or bar association.',
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
              <div className="text-3xl font-bold text-primary-500">$3.1B</div>
              <div className="text-sm text-landing-muted mt-1">lost to business email compromise in legal sector</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">37%</div>
              <div className="text-sm text-landing-muted mt-1">of law firms experienced a security incident last year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">87%</div>
              <div className="text-sm text-landing-muted mt-1">of clients research firms online before contacting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            Built for Legal Practices of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Whether you&apos;re a solo practitioner or a multi-office firm, brand impersonation 
            threatens the trust that underpins your practice. DoppelDown scales to fit your needs 
            — start free and upgrade as your firm grows.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Solo Practitioners', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Small & Mid-Size Firms', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Large & Multi-Office Firms', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              <p className="text-xs text-landing-muted mt-1">Practical steps to defend your legal practice online.</p>
            </Link>
            <Link
              href="/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">5 Signs Your Brand Is Being Targeted by Phishing</p>
              <p className="text-xs text-landing-muted mt-1">Know the warning signs before your clients are affected.</p>
            </Link>
            <Link
              href="/blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">The True Cost of Brand Impersonation</p>
              <p className="text-xs text-landing-muted mt-1">Why reputation damage can be more costly than direct losses.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your Firm&apos;s Reputation &amp; Client Trust
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring your law firm&apos;s brand today — free, no credit card required.
            Detect impersonation threats before they reach your clients.
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
