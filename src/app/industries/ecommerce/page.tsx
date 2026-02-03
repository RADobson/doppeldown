import Link from 'next/link'
import { Shield, Store, AlertTriangle, Search, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for E-Commerce Businesses — Stop Fake Stores & Phishing | DoppelDown',
  description:
    'Protect your e-commerce brand from fake online stores, domain squatting, and checkout phishing. DoppelDown monitors for copycat domains and brand impersonation targeting your customers. Free tier available.',
  keywords: [
    'ecommerce brand protection',
    'online store domain monitoring',
    'ecommerce phishing protection',
    'fake online store detection',
    'e-commerce domain squatting',
    'counterfeit website protection',
    'brand protection for online retailers',
    'ecommerce cybersecurity',
    'checkout phishing detection',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/ecommerce',
  },
  openGraph: {
    title: 'Brand Protection for E-Commerce Businesses | DoppelDown',
    description:
      'Stop fake stores, domain squatting, and checkout phishing with AI-powered brand monitoring. Starting at $0/month.',
    url: 'https://doppeldown.com/industries/ecommerce',
  },
}

export default function EcommerceIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for E-Commerce Businesses',
    description:
      'Protect your e-commerce brand from fake online stores, domain squatting, and checkout phishing with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/ecommerce',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown E-Commerce Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for e-commerce businesses. Detects fake stores, domain squatting, and phishing attacks.',
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
          <span className="text-landing-foreground">E-Commerce</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Store className="h-4 w-4" />
            E-Commerce &amp; Online Retail
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for E-Commerce Businesses
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Fake online stores, domain squatting, and checkout phishing are silently stealing your customers
            and destroying their trust. DoppelDown detects these threats automatically — so you can shut
            them down before the damage is done.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why E-Commerce Brands Are Under Attack
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Store,
                title: 'Fake Online Stores',
                description:
                  'Attackers clone your website — logos, product images, branding — and run counterfeit stores that scam your customers. Victims blame your brand, not the attacker. A single fake store can generate hundreds of chargebacks and customer complaints before it\'s detected. For e-commerce businesses, this isn\'t a hypothetical risk: 68% of consumers say they wouldn\'t return to a brand after being scammed on a lookalike site.',
              },
              {
                icon: Search,
                title: 'Domain Squatting on Product Names',
                description:
                  'Your best-selling product names become targets. Attackers register domains like "yourproduct-sale.com" or "cheapyourbrand.store" to intercept purchase-intent traffic. These domains rank in search results, appear in paid ads, and redirect customers to counterfeit merchandise or competitor products. Every click to a squatted domain is revenue taken directly from your store.',
              },
              {
                icon: AlertTriangle,
                title: 'Checkout Page Phishing',
                description:
                  'The most dangerous e-commerce threat: attackers create pixel-perfect replicas of your checkout flow that harvest credit card numbers and personal information. Customers think they\'re buying from you — instead, their payment details are stolen. The result is a wave of fraud reports, payment processor flags, and brand damage that takes months to recover from.',
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
            How DoppelDown Protects E-Commerce Brands
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Automated Domain Monitoring',
                description:
                  'DoppelDown continuously scans for domains that impersonate your brand or product names. Our AI generates thousands of typosquat variations and monitors new domain registrations daily, alerting you to threats before customers are affected.',
              },
              {
                icon: ShieldCheck,
                title: 'Phishing Page Detection',
                description:
                  'Our engine detects cloned checkout pages and fake store fronts by analyzing visual similarity, content fingerprints, and SSL certificate patterns. When we find a match, you get evidence packages ready for takedown requests.',
              },
              {
                icon: BarChart3,
                title: 'AI-Powered Threat Scoring',
                description:
                  'Not every lookalike domain is a real threat. DoppelDown\'s threat scoring engine prioritizes the domains actively targeting your customers — so you focus on what matters, not chase false positives.',
              },
              {
                icon: AlertTriangle,
                title: 'Takedown-Ready Evidence',
                description:
                  'Each detected threat comes with screenshots, WHOIS data, DNS records, and content analysis — everything your legal team or registrar needs to initiate a takedown. Export reports in one click.',
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
              <div className="text-3xl font-bold text-primary-500">68%</div>
              <div className="text-sm text-landing-muted mt-1">of consumers won&apos;t return after a fake site experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">4,000+</div>
              <div className="text-sm text-landing-muted mt-1">new e-commerce phishing sites created daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">$48B</div>
              <div className="text-sm text-landing-muted mt-1">lost to online payment fraud annually</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            Built for E-Commerce Teams of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Whether you&apos;re a solo Shopify store owner or managing brand protection for a major
            online retailer, DoppelDown scales to fit. Our free tier lets you start monitoring
            immediately — upgrade when your brand needs it.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Solo & Small Stores', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Growing Brands', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Enterprise Retail', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              href="/compare/brandshield"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">DoppelDown vs BrandShield</p>
              <p className="text-xs text-landing-muted mt-1">See how DoppelDown compares for e-commerce brand protection.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Stop Fake Stores Before They Steal Your Customers
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring your e-commerce brand today — free, no credit card required.
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
