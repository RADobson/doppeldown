import Link from 'next/link'
import { Shield, Store, Building2, Briefcase, GraduationCap, Heart, Landmark } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Use Cases — Brand Protection for Every Industry',
  description:
    'See how DoppelDown protects brands across industries: e-commerce, financial services, healthcare, SaaS, education, and professional services. AI-powered brand protection from $0/month.',
  keywords: [
    'brand protection use cases',
    'e-commerce brand protection',
    'financial services phishing protection',
    'healthcare brand security',
    'SaaS brand monitoring',
    'brand protection for small business',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/use-cases',
  },
  openGraph: {
    title: 'DoppelDown Use Cases — Brand Protection for Every Industry',
    description: 'From e-commerce to healthcare, see how DoppelDown protects brands in your industry.',
    url: 'https://doppeldown.com/use-cases',
  },
}

const useCases = [
  {
    icon: Store,
    title: 'E-Commerce & Retail',
    slug: 'ecommerce',
    description:
      'Fake online stores impersonating your brand steal revenue and destroy customer trust. DoppelDown detects copycat domains and phishing checkout pages before customers get scammed.',
    threats: [
      'Fake online stores using your brand name',
      'Phishing checkout pages stealing customer credit cards',
      'Counterfeit product listings on lookalike domains',
      'Social media shops impersonating your brand',
    ],
    stat: '68%',
    statLabel: 'of consumers won\'t return after a fake site experience',
  },
  {
    icon: Landmark,
    title: 'Financial Services',
    slug: 'financial-services',
    description:
      'Banks, credit unions, and fintech companies are the #1 target for phishing attacks. DoppelDown monitors for fake login pages, spoofed mobile apps, and impersonation scams targeting your customers.',
    threats: [
      'Fake banking login pages harvesting credentials',
      'Spoofed mobile banking apps',
      'Investment scam sites using your brand',
      'CEO/executive impersonation for wire fraud',
    ],
    stat: '$4.9B',
    statLabel: 'lost to phishing in financial services (2025)',
  },
  {
    icon: Heart,
    title: 'Healthcare',
    slug: 'healthcare',
    description:
      'Healthcare brands face unique risks: fake pharmacy sites, phishing for patient data, and impersonation of medical professionals. Protect patient trust and regulatory compliance.',
    threats: [
      'Fake pharmacy sites selling counterfeit medications',
      'Phishing for patient health records (PHI)',
      'Impersonation of doctors or clinics',
      'Fake telehealth booking pages',
    ],
    stat: '$10.9M',
    statLabel: 'average cost of a healthcare data breach',
  },
  {
    icon: Briefcase,
    title: 'SaaS & Technology',
    slug: 'saas-technology',
    description:
      'Your SaaS login page is a prime target for credential harvesting. DoppelDown detects fake login portals, impersonated support channels, and typosquat domains designed to intercept your users.',
    threats: [
      'Fake SaaS login pages stealing user credentials',
      'Impersonated support chat / help desk pages',
      'Typosquat domains intercepting traffic',
      'Fake API documentation serving malware',
    ],
    stat: '3x',
    statLabel: 'increase in SaaS phishing attacks since 2023',
  },
  {
    icon: GraduationCap,
    title: 'Education',
    slug: 'education',
    description:
      'Universities and ed-tech platforms are increasingly targeted by phishing campaigns. Protect students, faculty, and your institution\'s reputation from impersonation attacks.',
    threats: [
      'Fake enrollment or financial aid pages',
      'Phishing emails impersonating university admins',
      'Spoofed student portals harvesting credentials',
      'Fake scholarship scam sites using your brand',
    ],
    stat: '44%',
    statLabel: 'of education institutions hit by phishing (2025)',
  },
  {
    icon: Building2,
    title: 'Professional Services',
    slug: 'professional-services',
    description:
      'Law firms, accounting firms, and consultancies rely on reputation. A single impersonation attack can destroy years of trust. DoppelDown monitors for brand abuse so you can focus on your clients.',
    threats: [
      'Fake firm websites soliciting client information',
      'Impersonated partner or executive profiles',
      'Phishing targeting client payment details',
      'Fake job posting scams using your firm\'s name',
    ],
    stat: '67%',
    statLabel: 'of law firms have faced a cybersecurity incident',
  },
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-landing">
      {/* Header */}
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

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection for Every Industry
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            No matter your industry, brand impersonation is a growing threat. See how DoppelDown protects businesses like yours.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {useCases.map((uc, i) => {
            const Icon = uc.icon
            return (
              <div
                key={uc.slug}
                className={`bg-landing-elevated border border-landing-border rounded-xl p-8 ${
                  i % 2 === 0 ? '' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary-600/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-500" />
                      </div>
                      <h2 className="text-xl font-bold text-landing-foreground">{uc.title}</h2>
                    </div>
                    <p className="text-landing-muted mb-6">{uc.description}</p>
                    <h3 className="text-sm font-semibold text-landing-foreground mb-3 uppercase tracking-wide">
                      Common Threats
                    </h3>
                    <ul className="space-y-2">
                      {uc.threats.map((threat, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-landing-muted">
                          <span className="text-red-400 mt-0.5">⚠</span>
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:w-48 flex flex-col items-center justify-center bg-landing rounded-lg p-6">
                    <div className="text-3xl font-bold text-primary-500">{uc.stat}</div>
                    <div className="text-xs text-landing-muted text-center mt-2">{uc.statLabel}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-landing-muted mb-8">
            Start with our free tier — no credit card required. See threats in minutes, not weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Start Free Today
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
