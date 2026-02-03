import Link from 'next/link'
import { Shield, Heart, AlertTriangle, Search, ShieldCheck, BarChart3, Lock, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection for Healthcare Organizations — Hospital & Telehealth Phishing Defense | DoppelDown',
  description:
    'Protect your healthcare brand from fake pharmacy sites, telehealth impersonation, and patient data phishing. DoppelDown monitors for domain squatting and brand impersonation targeting hospitals, clinics, and healthcare providers. Free tier available.',
  keywords: [
    'healthcare brand protection',
    'hospital phishing protection',
    'telehealth domain monitoring',
    'fake pharmacy site detection',
    'healthcare cybersecurity',
    'medical brand impersonation',
    'HIPAA phishing compliance',
    'healthcare domain squatting',
    'patient data phishing protection',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries/healthcare',
  },
  openGraph: {
    title: 'Brand Protection for Healthcare Organizations | DoppelDown',
    description:
      'Defend hospitals, clinics, and healthcare providers from fake pharmacy sites, telehealth impersonation, and patient data phishing. AI-powered monitoring from $0/month.',
    url: 'https://doppeldown.com/industries/healthcare',
  },
}

export default function HealthcareIndustryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Protection for Healthcare Organizations',
    description:
      'Protect healthcare brands from fake pharmacy sites, telehealth impersonation, and patient data phishing with AI-powered monitoring from DoppelDown.',
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
        'AI-powered brand protection for healthcare organizations. Detects fake pharmacy sites, telehealth impersonation, and patient data phishing.',
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
            Healthcare Organizations
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Healthcare Organizations
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Healthcare brands face uniquely dangerous impersonation threats. Fake pharmacy sites sell
            counterfeit medications. Phishing pages harvest protected health information. Telehealth
            impersonation puts patients at risk. DoppelDown monitors for these threats so you can
            protect patients and compliance.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-8 text-center">
            Why Healthcare Brands Face Critical Impersonation Risks
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: 'Fake Pharmacy & Medication Sites',
                description:
                  'Attackers register domains mimicking your healthcare brand to sell counterfeit or unregulated medications. These fake pharmacy sites exploit the trust patients place in your organization\'s name. Unlike other industries, the consequences aren\'t just financial — patients may receive ineffective or dangerous products. The FDA reports thousands of illegal pharmacy sites operating at any given time, many impersonating legitimate healthcare brands.',
              },
              {
                icon: Heart,
                title: 'Telehealth Impersonation',
                description:
                  'The rapid growth of telehealth has created a new attack surface. Fake appointment booking pages impersonate your clinic to collect patient information, insurance details, and payment data. Patients who believe they\'re scheduling legitimate consultations instead hand over their most sensitive personal and medical information to criminals. These attacks have surged alongside the mainstreaming of virtual care.',
              },
              {
                icon: Lock,
                title: 'HIPAA & Compliance Implications',
                description:
                  'When a phishing attack impersonates your healthcare brand and harvests protected health information (PHI), the regulatory fallout can be severe. Even though the breach occurred on an attacker\'s infrastructure, your organization faces reputational damage, potential investigation, and the burden of patient notification. Proactive brand monitoring demonstrates the due diligence that regulators and patients expect from healthcare providers.',
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
                title: 'Domain & Brand Monitoring',
                description:
                  'DoppelDown continuously monitors for domains impersonating your hospital, clinic, or healthcare network name. Our AI generates thousands of variations — typosquats, homoglyphs, and keyword combinations — and alerts you when new threats emerge.',
              },
              {
                icon: ShieldCheck,
                title: 'Fake Site Detection',
                description:
                  'Our engine detects pages that mimic your patient portals, appointment booking systems, and pharmacy storefronts. Visual fingerprinting catches clones even when attackers modify layouts, helping you catch threats that keyword-based scanners miss.',
              },
              {
                icon: BarChart3,
                title: 'Prioritized Threat Intelligence',
                description:
                  'Healthcare security teams are stretched thin. DoppelDown\'s AI threat scoring separates active, patient-facing threats from benign domain registrations — so your team responds to real risks first, not sifts through noise.',
              },
              {
                icon: Lock,
                title: 'Compliance-Ready Evidence',
                description:
                  'Every detection includes screenshots, WHOIS records, DNS history, and content analysis — ready for regulatory documentation, legal proceedings, or reporting to the HHS Office for Civil Rights. Demonstrate proactive monitoring in your next compliance review.',
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
              <div className="text-3xl font-bold text-primary-500">$10.9M</div>
              <div className="text-sm text-landing-muted mt-1">average cost of a healthcare data breach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">89%</div>
              <div className="text-sm text-landing-muted mt-1">of healthcare organizations experienced a cyberattack</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">1,200+</div>
              <div className="text-sm text-landing-muted mt-1">healthcare phishing campaigns detected monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6 text-center">
            For Healthcare Organizations of Every Size
          </h2>
          <p className="text-landing-muted text-center max-w-2xl mx-auto mb-8">
            From independent clinics to hospital networks, DoppelDown makes brand protection accessible.
            You don&apos;t need an enterprise security budget to protect your patients and your reputation.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Clinics & Practices', plan: 'Free — $0/month', desc: '1 brand, basic monitoring' },
              { label: 'Regional Health Systems', plan: 'Pro — $99/month', desc: '10 brands, 6-hour scans, API' },
              { label: 'Hospital Networks', plan: 'Enterprise — $249/month', desc: 'Unlimited brands, NRD feed' },
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
              <p className="text-xs text-landing-muted mt-1">The latest data on phishing attacks across all industries including healthcare.</p>
            </Link>
            <Link
              href="/blog/brand-protection-for-small-business-practical-guide"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">Brand Protection for Small Business</p>
              <p className="text-xs text-landing-muted mt-1">A practical guide for smaller healthcare practices starting brand monitoring.</p>
            </Link>
            <Link
              href="/blog/what-is-domain-squatting-how-to-protect-your-brand"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">What Is Domain Squatting?</p>
              <p className="text-xs text-landing-muted mt-1">Understand how attackers register domains targeting healthcare organizations.</p>
            </Link>
            <Link
              href="/compare/zerofox"
              className="bg-landing-elevated border border-landing-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <p className="text-sm font-medium text-landing-foreground">DoppelDown vs ZeroFox</p>
              <p className="text-xs text-landing-muted mt-1">Compare healthcare-grade brand protection at accessible pricing.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Protect Your Patients and Your Healthcare Brand
          </h2>
          <p className="text-landing-muted mb-8">
            Start monitoring for threats to your healthcare organization today — free, no credit card required.
            Protect patient trust and demonstrate compliance with proactive brand monitoring.
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
