import Link from 'next/link'
import { Shield, Store, Landmark, Heart, Cloud, Scale, Home, ArrowRight } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'Brand Protection by Industry — E-Commerce, Financial Services, Healthcare, SaaS, Legal, Real Estate | DoppelDown',
  description:
    'Industry-specific brand protection solutions from DoppelDown. Protect your e-commerce store, financial services firm, healthcare organization, SaaS company, law firm, or real estate agency from phishing, domain squatting, and brand impersonation. Starting free.',
  keywords: [
    'brand protection by industry',
    'industry brand protection',
    'ecommerce brand protection',
    'financial services brand protection',
    'healthcare brand protection',
    'SaaS brand protection',
    'legal brand protection',
    'real estate brand protection',
    'domain monitoring by industry',
    'phishing protection for business',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/industries',
  },
  openGraph: {
    title: 'Brand Protection by Industry | DoppelDown',
    description:
      'Industry-specific brand protection for e-commerce, financial services, healthcare, SaaS, legal, and real estate. AI-powered threat detection starting at $0/month.',
    url: 'https://doppeldown.com/industries',
  },
}

const industries = [
  {
    icon: Store,
    title: 'E-Commerce & Online Retail',
    slug: '/industries/ecommerce',
    description:
      'Fake online stores, counterfeit product domains, and checkout phishing pages cost e-commerce brands millions in lost revenue and customer trust. DoppelDown monitors for copycat domains and brand impersonation across the web.',
    threats: ['Fake online stores', 'Domain squatting on product names', 'Checkout page phishing'],
    stat: '68%',
    statLabel: 'of consumers won\'t return after a fake site experience',
  },
  {
    icon: Landmark,
    title: 'Financial Services',
    slug: '/industries/financial-services',
    description:
      'Banks, credit unions, and fintech companies are the #1 target for phishing attacks. DoppelDown detects fake login pages, spoofed banking apps, and impersonation scams before they reach your customers.',
    threats: ['Banking phishing pages', 'Fake investment sites', 'Regulatory compliance risks'],
    stat: '$4.9B',
    statLabel: 'lost to phishing in financial services annually',
  },
  {
    icon: Heart,
    title: 'Healthcare Organizations',
    slug: '/industries/healthcare',
    description:
      'Healthcare brands face unique risks: fake pharmacy sites, telehealth impersonation, and phishing for patient data. Protect patient trust, your reputation, and regulatory compliance with automated monitoring.',
    threats: ['Fake pharmacy sites', 'Telehealth impersonation', 'HIPAA compliance implications'],
    stat: '$10.9M',
    statLabel: 'average cost of a healthcare data breach',
  },
  {
    icon: Cloud,
    title: 'SaaS & Software',
    slug: '/industries/saas-software',
    description:
      'SaaS companies face growing threats from fake apps, credential harvesting pages, and API impersonation attacks. DoppelDown monitors for lookalike domains and brand impersonation targeting your users and developers.',
    threats: ['Fake app downloads', 'Credential harvesting pages', 'API impersonation'],
    stat: '49%',
    statLabel: 'of SaaS companies experienced brand impersonation last year',
  },
  {
    icon: Scale,
    title: 'Legal & Law Firms',
    slug: '/industries/legal',
    description:
      'Law firms are prime targets for impersonation scams, fake attorney profiles, and client wire fraud. Protect your reputation and client trust with automated monitoring for brand threats targeting your practice.',
    threats: ['Fake attorney profiles', 'Client wire fraud scams', 'Reputation damage'],
    stat: '$3.1B',
    statLabel: 'lost to business email compromise in legal sector',
  },
  {
    icon: Home,
    title: 'Real Estate',
    slug: '/industries/real-estate',
    description:
      'Real estate agencies face wire fraud scams, domain spoofing, and agent impersonation attacks that cost clients millions. DoppelDown detects these threats before they target your transactions.',
    threats: ['Wire fraud & transaction scams', 'Domain spoofing on listings', 'Agent impersonation'],
    stat: '$2.7B',
    statLabel: 'lost to real estate wire fraud in 2023',
  },
]

export default function IndustriesIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Brand Protection by Industry',
    description:
      'Industry-specific brand protection solutions from DoppelDown for e-commerce, financial services, healthcare, SaaS, legal, and real estate organizations.',
    url: 'https://doppeldown.com/industries',
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
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

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Brand Protection Built for Your Industry
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Every industry faces unique brand impersonation threats. DoppelDown provides tailored
            monitoring and protection so you can focus on your business — not chasing down fakes.
          </p>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <Link
                key={industry.slug}
                href={industry.slug}
                className="block bg-landing-elevated border border-landing-border rounded-xl p-8 hover:border-primary-500/50 transition-colors group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary-600/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-500" />
                      </div>
                      <h2 className="text-xl font-bold text-landing-foreground group-hover:text-primary-500 transition-colors">
                        {industry.title}
                      </h2>
                    </div>
                    <p className="text-landing-muted mb-6">{industry.description}</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {industry.threats.map((threat) => (
                        <span
                          key={threat}
                          className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full"
                        >
                          ⚠ {threat}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center text-primary-500 text-sm font-medium group-hover:underline">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                  <div className="lg:w-48 flex flex-col items-center justify-center bg-landing rounded-lg p-6">
                    <div className="text-3xl font-bold text-primary-500">{industry.stat}</div>
                    <div className="text-xs text-landing-muted text-center mt-2">{industry.statLabel}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Cross-links */}
      <section className="pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-landing-muted mb-3 text-sm">
            Looking for a broader overview? Check out our{' '}
            <Link href="/use-cases" className="text-primary-500 hover:underline">
              Use Cases
            </Link>{' '}
            page or see how we{' '}
            <Link href="/compare/brandshield" className="text-primary-500 hover:underline">
              compare to competitors
            </Link>
            .
          </p>
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
