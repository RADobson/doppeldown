import Link from 'next/link'
import { Shield, Heart, AlertTriangle, Search, ShieldCheck, BarChart3, ArrowRight, FileWarning } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for Healthcare Organizations — Stop Phishing & Impersonation | DoppelDown',
  description:
    'Protect your healthcare brand from fake pharmacy sites, telehealth impersonation, and patient-targeting phishing attacks. DoppelDown monitors for lookalike domains threatening your organization and patients. Free tier available.',
  keywords: [
    'healthcare brand protection',
    'hospital phishing protection',
    'telehealth domain monitoring',
    'fake pharmacy site detection',
    'healthcare cybersecurity',
    'medical brand impersonation',
    'patient phishing protection',
    'HIPAA phishing compliance',
    'healthcare domain squatting',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/healthcare',
  },
  openGraph: {
    title: 'Brand Protection for Healthcare Organizations | DoppelDown',
    description:
      'Stop fake pharmacy sites, telehealth impersonation, and patient-targeting phishing with AI-powered brand monitoring. Starting at $0/month.',
    url: 'https://doppeldown.com/industries/healthcare',
  },
}

export default function HealthcareIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for Healthcare Organizations',
    description:
      'Protect your healthcare brand from fake pharmacy sites, telehealth impersonation, and patient-targeting phishing attacks with AI-powered monitoring from DoppelDown.',
    url: 'https://doppeldown.com/industries/healthcare',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'DoppelDown Healthcare Brand Protection',
      provider: {
        '@type': 'Organization',
        name: 'DoppelDown',
      },
      serviceType: 'Brand Protection',
      areaServed: 'Worldwide',
      description:
        'AI-powered brand protection for healthcare organizations. Detects fake pharmacy sites, telehealth impersonation, and patient-targeting phishing.',
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
          <span className="text-landing-foreground">Healthcare</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 text-primary-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Healthcare &amp; Medical
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Healthcare Organizations
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Fake pharmacy sites, telehealth impersonators, and patient-targeting phishing attacks
            don&apos;t just damage your brand — they endanger lives. DoppelDown detects these threats
            automatically so you can protect your patients and your reputation.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why Healthcare Brands Face Unique Threats
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Fake Pharmacy Sites',
                description:
                  'Attackers register domains mimicking your hospital or clinic to sell counterfeit medications. Patients searching for your pharmacy online land on convincing lookalikes that sell unregulated, potentially dangerous drugs under your brand name. These sites erode patient trust and create serious liability exposure for your organization.',
              },
              {
                icon: Search,
                title: 'Telehealth Impersonation',
                description:
                  'The explosion of telehealth has created a new attack surface. Fake telehealth portals clone your patient login pages to harvest credentials, insurance details, and medical information. Patients believe they\'re accessing your legitimate portal — instead, their most sensitive health data is being stolen and sold on dark web marketplaces.',
              },
              {
                icon: FileWarning,
                title: 'HIPAA & Compliance Implications',
                description:
                  'When patients submit health information to a phishing site impersonating your organization, the regulatory fallout lands on your desk. Even though you didn\'t create the fake site, patients and regulators expect you to be monitoring for brand impersonation. Failure to detect and report these threats can compound breach notification obligations and regulatory scrutiny.',
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
            How DoppelDown Protects Healthcare Organizations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: 'Continuous Domain Surveillance',
                description:
                  'DoppelDown monitors for domains impersonating your hospital, clinic, or telehealth platform name. Our AI generates thousands of typosquat and homoglyph variations, scanning new domain registrations daily to catch threats before patients are exposed.',
              },
              {
                icon: ShieldCheck,
                title: 'Patient Portal Phishing Detection',
                description:
                  'We detect cloned patient portals and fake telehealth login pages by analyzing visual similarity, form structures, and SSL certificate patterns. Get alerted the moment an impersonation site goes live — not weeks later when patients start reporting fraud.',
              },
              {
                icon: BarChart3,
                title: 'Risk-Prioritized Threat Intelligence',
                description:
                  'Not every similar domain is an active threat. DoppelDown\'s AI scoring engine assesses hosting infrastructure, content similarity, and targeting signals to surface the domains that pose genuine risk to your patients — reducing alert fatigue for your security team.',
              },
              {
                icon: AlertTriangle,
                title: 'Compliance-Ready Evidence Packages',
                description:
                  'Each detected threat includes timestamped screenshots, WHOIS records, DNS data, and content analysis. Use these evidence packages for registrar takedown requests, law enforcement referrals, or regulatory documentation — all exportable in one click.',
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
              <div className="text-3xl font-bold text-primary-500">89%</div>
              <div className="text-sm text-landing-muted mt-1">of healthcare organizations experienced a cyberattack in the past year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">$10.9M</div>
              <div className="text-sm text-landing-muted mt-1">average cost of a healthcare data breach — highest of any industry</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">56%</div>
              <div className="text-sm text-landing-muted mt-1">of healthcare breaches involve phishing as the initial attack vector</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            Built for Healthcare Organizations of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            Whether you&apos;re a single-location clinic or a multi-hospital health system,
            DoppelDown scales to fit. Our free tier lets you start monitoring immediately —
            upgrade as your organization&apos;s needs grow.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Clinics & Practices', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Hospitals & Groups', plan: 'Starter — $49/month', desc: '3 brands, daily scans' },
              { label: 'Health Systems', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              <p className="text-xs text-landing-muted mt-1">Key data on phishing trends affecting healthcare organizations.</p>
            </Link>
            <Link
              href="/blog/what-is-domain-squatting-how-to-protect-your-brand"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">What Is Domain Squatting?</p>
              <p className="text-xs text-landing-muted mt-1">How attackers target healthcare domains and what you can do about it.</p>
            </Link>
            <Link
              href="/blog/how-to-check-if-someone-registered-domain-similar-to-yours"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">Check for Lookalike Domains</p>
              <p className="text-xs text-landing-muted mt-1">5 methods to find domains impersonating your healthcare brand.</p>
            </Link>
            <Link
              href="/compare/zerofox"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">DoppelDown vs ZeroFox</p>
              <p className="text-xs text-landing-muted mt-1">Compare brand protection solutions for healthcare.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your Patients. Protect Your Brand.
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring your healthcare brand today — free, no credit card required.
            Detect impersonation threats before they reach your patients.
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
