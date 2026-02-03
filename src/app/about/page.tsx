import Link from 'next/link'
import { Shield, Target, Users, Zap } from 'lucide-react'
import Footer from '@/components/landing/Footer'

export const metadata = {
  title: 'About DoppelDown — Our Mission',
  description:
    'DoppelDown was built to democratize brand protection. We believe every business deserves protection from phishing, typosquatting, and brand impersonation — not just enterprises with $15K+ budgets.',
  alternates: {
    canonical: 'https://doppeldown.com/about',
  },
  openGraph: {
    title: 'About DoppelDown',
    description: 'Brand protection shouldn\'t be a luxury. Learn why we built DoppelDown.',
    url: 'https://doppeldown.com/about',
  },
}

export default function AboutPage() {
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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-6">
            Brand Protection Shouldn&apos;t Be a Luxury
          </h1>
          <p className="text-lg text-landing-muted leading-relaxed">
            We built DoppelDown because we saw an industry charging small businesses
            $15,000–$250,000 per year for something that should be accessible to everyone.
            Your brand deserves protection regardless of your budget.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6">The Problem We Saw</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-landing-muted">
            <p>
              Every day, attackers register fake domains and create phishing pages that
              impersonate legitimate businesses. They target customers, steal credentials,
              and destroy the trust that companies spend years building.
            </p>
            <p>
              The brand protection industry exists to solve this — but it&apos;s broken.
              Enterprise vendors charge minimum contracts of $15,000 to $250,000+ per year.
              They require lengthy sales cycles, custom onboarding, and annual commitments.
              For the vast majority of businesses, this isn&apos;t an option.
            </p>
            <p>
              Meanwhile, small and medium businesses are the <strong className="text-landing-foreground">most vulnerable</strong> to
              these attacks. They don&apos;t have dedicated security teams. They don&apos;t have
              the budget for enterprise tools. And they don&apos;t have the time to manually
              search for threats.
            </p>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6">Our Solution</h2>
          <p className="text-landing-muted mb-8">
            DoppelDown uses AI to automate what used to require expensive analysts and
            enterprise contracts. We scan for threats, score their severity, collect evidence,
            and give you everything you need to take action — starting at $0 per month.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: 'AI-Powered Detection',
                desc: 'Automated scanning for typosquatting, phishing pages, and brand impersonation across domains and social media.',
              },
              {
                icon: Zap,
                title: 'Instant Results',
                desc: 'No weeks-long onboarding. Sign up, add your brand, and start seeing threats in minutes.',
              },
              {
                icon: Users,
                title: 'Built for SMBs',
                desc: 'Designed for business owners and marketers, not just security professionals. No technical expertise required.',
              },
              {
                icon: Shield,
                title: 'Transparent Pricing',
                desc: 'No hidden fees, no annual contracts, no "contact sales." Free tier included forever.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-landing-elevated border border-landing-border rounded-lg p-6">
                  <Icon className="h-6 w-6 text-primary-500 mb-3" />
                  <h3 className="font-semibold text-landing-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-landing-muted">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-landing-foreground mb-6">The Company</h2>
          <div className="space-y-4 text-landing-muted">
            <p>
              DoppelDown is built by <strong className="text-landing-foreground">Dobson Development Pty Ltd</strong>,
              an Australian software company based on the Sunshine Coast, Queensland.
            </p>
            <p>
              We&apos;re a small, focused team that believes cybersecurity tools should be
              accessible, transparent, and effective. We&apos;re bootstrapped and profitable
              by design — no venture capital, no pressure to upsell, no enterprise-only
              features hidden behind sales calls.
            </p>
            <p>
              Our founder comes from a cybersecurity background in managed detection and
              response (MDR), and saw firsthand how small businesses were left unprotected
              by an industry focused on Fortune 500 clients.
            </p>
          </div>
          <div className="mt-8 p-6 bg-landing-elevated border border-landing-border rounded-lg">
            <div className="text-sm text-landing-muted space-y-1">
              <p><strong className="text-landing-foreground">Dobson Development Pty Ltd</strong></p>
              <p>ABN: 43 688 593 606</p>
              <p>Sunshine Coast, Queensland, Australia</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-landing-foreground mb-4">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-landing-muted mb-8">
            Join hundreds of businesses using DoppelDown to detect and stop brand impersonation.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Start Free — No Credit Card Required
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
