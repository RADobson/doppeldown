import Link from 'next/link'
import { Shield, Landmark, AlertTriangle, Search, ShieldCheck, BarChart3, Lock, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for Financial Services — Bank & Fintech Phishing Defense | DoppelDown',
  description:
    'Protect your financial services brand from banking phishing, fake investment sites, and regulatory compliance risks. DoppelDown monitors for impersonation attacks targeting banks, credit unions, and fintech companies. Free tier available.',
  keywords: [
    'financial services brand protection',
    'bank phishing protection',
    'fintech domain monitoring',
    'banking phishing detection',
    'financial institution brand security',
    'fake banking site detection',
    'credit union phishing protection',
    'fintech cybersecurity',
    'financial services compliance',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/financial-services',
  },
  openGraph: {
    title: 'Brand Protection for Financial Services | DoppelDown',
    description:
      'Defend banks, credit unions, and fintech companies from phishing attacks and brand impersonation. AI-powered monitoring from $0/month.',
    url: 'https://doppeldown.com/industries/financial-services',
  },
}

export default function FinancialServicesIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for Financial Services',
    description:
      'Protect financial services brands from banking phishing, fake investment sites, and domain impersonation with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/financial-services',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown Financial Services Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for banks, credit unions, and fintech companies. Detects phishing attacks, fake banking sites, and domain impersonation.',
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
          <span className="text-landing-foreground">Financial Services</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Landmark className="h-4 w-4" />
            Financial Services
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Financial Services
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Financial institutions are the #1 target for phishing attacks globally. Fake banking login pages,
            fraudulent investment sites, and impersonation scams cost the industry billions every year.
            DoppelDown detects these threats before they reach your customers.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why Financial Brands Are the #1 Phishing Target
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Landmark,
                title: 'Banking Phishing Attacks',
                description:
                  'Attackers create pixel-perfect replicas of your online banking login pages to harvest customer credentials. These fake sites use your brand colors, logo, and security messaging to build false trust. A single successful phishing page can compromise thousands of accounts before detection — leading to direct financial losses, regulatory scrutiny, and erosion of customer confidence that took decades to build.',
              },
              {
                icon: AlertTriangle,
                title: 'Fake Investment & Advisory Sites',
                description:
                  'Fraudulent investment platforms impersonate your brand to lure victims into scams. They promise guaranteed returns and use your firm\'s reputation as social proof. These sites are particularly dangerous because they exploit the trust your brand has earned, and victims often don\'t realize the scam until significant financial damage has occurred. Recovery rates for investment fraud are notoriously low.',
              },
              {
                icon: Lock,
                title: 'Regulatory Compliance Risks',
                description:
                  'Financial services operate under strict regulatory frameworks — FFIEC, SOX, PCI DSS, GDPR, and state-level requirements. When attackers impersonate your brand, regulators may question your institution\'s security posture and customer protection measures. Demonstrating proactive brand monitoring isn\'t just good security practice — it\'s increasingly expected in regulatory examinations and audits.',
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
            How DoppelDown Protects Financial Institutions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Domain & Subdomain Monitoring',
                description:
                  'DoppelDown monitors thousands of domain variations targeting your institution — including typosquats, homoglyphs, and TLD variations. Our daily new domain registration (NRD) monitoring catches threats within hours of registration, not weeks.',
              },
              {
                icon: ShieldCheck,
                title: 'Login Page Clone Detection',
                description:
                  'Our visual similarity engine detects pages that mimic your banking login portal. We analyze page structure, form fields, and visual fingerprints to catch clones even when attackers modify layouts to evade simple signature matching.',
              },
              {
                icon: BarChart3,
                title: 'Risk-Prioritized Alerting',
                description:
                  'Financial institutions can\'t respond to every parked domain. DoppelDown\'s AI threat scoring separates high-risk active phishing pages from benign registrations — so your security team focuses on real threats, not noise.',
              },
              {
                icon: Lock,
                title: 'Audit-Ready Evidence & Reporting',
                description:
                  'Every detection generates a comprehensive evidence package: screenshots, WHOIS records, DNS history, SSL certificate data, and content analysis. Export reports for regulatory audits, legal proceedings, or internal compliance reviews.',
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
              <div className="text-3xl font-bold text-primary-500">$4.9B</div>
              <div className="text-sm text-landing-muted mt-1">lost to financial phishing annually</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">23%</div>
              <div className="text-sm text-landing-muted mt-1">of all phishing attacks target financial services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">$5.9M</div>
              <div className="text-sm text-landing-muted mt-1">average cost of a financial services data breach</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            For Financial Institutions of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Brand protection shouldn&apos;t require a Fortune 500 security budget. Community banks,
            credit unions, fintech startups, and independent advisors all face phishing threats.
            DoppelDown makes institutional-grade monitoring accessible.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Community Banks & Credit Unions', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Fintech Companies', plan: 'Pro — $99/month', desc: '10 brands, 6-hour scans, API' },
              { label: 'Banks & Asset Managers', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              href="/blog/phishing-attack-statistics-2026-what-smbs-need-to-know"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">Phishing Attack Statistics 2026</p>
              <p className="text-xs text-landing-muted mt-1">The latest data on phishing attacks targeting businesses.</p>
            </Link>
            <Link
              href="/blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">The True Cost of Brand Impersonation</p>
              <p className="text-xs text-landing-muted mt-1">Why financial institutions can&apos;t ignore brand impersonation risks.</p>
            </Link>
            <Link
              href="/blog/how-to-check-if-someone-registered-domain-similar-to-yours"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">How to Check for Similar Domain Registrations</p>
              <p className="text-xs text-landing-muted mt-1">Detect when attackers register domains impersonating your institution.</p>
            </Link>
            <Link
              href="/compare/phishlabs"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">DoppelDown vs PhishLabs</p>
              <p className="text-xs text-landing-muted mt-1">Compare enterprise phishing protection at a fraction of the cost.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your Financial Brand from Phishing Attacks
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring for threats to your institution today — free, no credit card required.
            Institutional-grade protection at startup-friendly pricing.
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
