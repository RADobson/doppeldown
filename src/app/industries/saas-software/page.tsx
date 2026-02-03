import Link from 'next/link'
import { Shield, Cloud, AlertTriangle, Search, ShieldCheck, BarChart3, Code, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for SaaS & Software — Stop Fake Apps & Phishing | DoppelDown',
  description:
    'Protect your SaaS brand from fake apps, credential harvesting phishing, and API impersonation attacks. DoppelDown monitors for lookalike domains and brand impersonation targeting your software customers. Free tier available.',
  keywords: [
    'SaaS brand protection',
    'software company domain monitoring',
    'fake app detection',
    'SaaS phishing protection',
    'API impersonation defense',
    'developer tool security',
    'cloud software brand protection',
    'SaaS cybersecurity',
    'fake login page detection',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/saas-software',
  },
  openGraph: {
    title: 'Brand Protection for SaaS & Software | DoppelDown',
    description:
      'Stop fake apps, credential phishing, and API impersonation with AI-powered brand monitoring. Starting at $0/month.',
    url: 'https://doppeldown.com/industries/saas-software',
  },
}

export default function SaaSSoftwareIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for SaaS & Software',
    description:
      'Protect your SaaS brand from fake apps, credential harvesting, and API impersonation with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/saas-software',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown SaaS & Software Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for SaaS and software companies. Detects fake apps, credential phishing, and API impersonation attacks.',
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
          <span className="text-landing-foreground">SaaS &amp; Software</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cloud className="h-4 w-4" />
            SaaS &amp; Software
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for SaaS &amp; Software Companies
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Fake apps, credential harvesting pages, and API impersonation attacks are targeting 
            your users and undermining trust in your platform. DoppelDown detects these threats 
            automatically — so you can protect your customers and your reputation.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why SaaS Brands Are Prime Targets for Impersonation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cloud,
                title: 'Fake App Downloads',
                description:
                  'Attackers distribute malicious apps through unofficial channels that impersonate your brand. Users searching for your software download malware instead — and blame you when their data is compromised. These fake apps damage your reputation, increase support burden, and expose you to liability when customers lose sensitive data.',
              },
              {
                icon: Code,
                title: 'API & Developer Tool Impersonation',
                description:
                  'Your API documentation and developer tools are cloned to harvest API keys and credentials. Developers unknowingly integrate with malicious endpoints, exposing their applications and data. For B2B SaaS companies, this creates a cascade of security incidents that trace back to your brand — even though you had nothing to do with the attack.',
              },
              {
                icon: AlertTriangle,
                title: 'Credential Harvesting Pages',
                description:
                  'Pixel-perfect replicas of your login pages trick users into entering their credentials. These phishing pages often use your exact CSS, logos, and authentication flows — making them nearly indistinguishable from your real platform. Once harvested, these credentials fuel account takeover attacks that your security team spends weeks investigating.',
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
            How DoppelDown Protects SaaS &amp; Software Brands
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Domain & Subdomain Monitoring',
                description:
                  'DoppelDown continuously scans for domains impersonating your SaaS brand, product names, and feature URLs. Our AI generates thousands of typosquat and homoglyph variations, monitoring new domain registrations daily to catch threats before your users are exposed.',
              },
              {
                icon: ShieldCheck,
                title: 'Login Page Clone Detection',
                description:
                  'Our visual similarity engine detects cloned login pages and authentication flows that target your users. We analyze page structure, form fields, and visual fingerprints to catch credential harvesting pages within hours of deployment.',
              },
              {
                icon: BarChart3,
                title: 'AI-Powered Threat Scoring',
                description:
                  'Not every similar domain poses a real threat. DoppelDown\'s AI threat scoring separates active phishing pages from parked domains — so your team focuses on genuine risks, not false positives.',
              },
              {
                icon: AlertTriangle,
                title: 'Takedown-Ready Evidence',
                description:
                  'Each detected threat comes with screenshots, WHOIS data, DNS records, and content analysis — everything needed for registrar takedowns, hosting provider abuse reports, or legal action. Export complete evidence packages in one click.',
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
              <div className="text-3xl font-bold text-primary-500">49%</div>
              <div className="text-sm text-landing-muted mt-1">of SaaS companies experienced brand impersonation last year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">$4.2M</div>
              <div className="text-sm text-landing-muted mt-1">average cost of a SaaS data breach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">71%</div>
              <div className="text-sm text-landing-muted mt-1">of users blame the brand after a phishing incident</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            Built for SaaS Companies of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Whether you&apos;re a seed-stage startup or an enterprise platform, brand impersonation 
            threatens your user trust and growth. DoppelDown scales with your business — 
            start free and upgrade as you grow.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Startups & Indie Hackers', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Growth-Stage SaaS', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Enterprise Platforms', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              <p className="text-xs text-landing-muted mt-1">Practical steps to defend against domain squatting and phishing.</p>
            </Link>
            <Link
              href="/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">5 Signs Your Brand Is Being Targeted by Phishing</p>
              <p className="text-xs text-landing-muted mt-1">Know the warning signs before your customers are affected.</p>
            </Link>
            <Link
              href="/compare/bolster"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">DoppelDown vs Bolster</p>
              <p className="text-xs text-landing-muted mt-1">See how DoppelDown compares for SaaS brand protection.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your SaaS Brand from Impersonation
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring your SaaS brand today — free, no credit card required.
            See threats in minutes, not weeks.
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
