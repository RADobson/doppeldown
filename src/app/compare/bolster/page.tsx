import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'DoppelDown vs Bolster (CheckPhish) — Brand Protection Comparison | DoppelDown',
  description:
    'Compare DoppelDown and Bolster (CheckPhish) for brand protection. DoppelDown starts free with transparent pricing — Bolster requires custom enterprise quotes. Full feature comparison.',
  openGraph: {
    title: 'DoppelDown vs Bolster (CheckPhish) — Brand Protection Comparison',
    description:
      'See why growing businesses choose DoppelDown over Bolster. Free tier, transparent pricing, and plans from $49/mo vs $20K+/year enterprise quotes.',
    url: 'https://doppeldown.com/compare/bolster',
  },
  alternates: {
    canonical: 'https://doppeldown.com/compare/bolster',
  },
}

const comparisonRows = [
  { feature: 'Starting Price', doppeldown: 'Free ($0)', competitor: '~$20,000/year', winner: 'doppeldown' },
  { feature: 'Paid Plans From', doppeldown: '$49/month', competitor: '$20K–$100K/year', winner: 'doppeldown' },
  { feature: 'Free Tier Available', doppeldown: true, competitor: 'CheckPhish scanner only', winner: 'doppeldown' },
  { feature: 'Self-Serve Signup', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Transparent Pricing', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Setup Time', doppeldown: 'Under 5 minutes', competitor: 'Weeks (sales + onboarding)', winner: 'doppeldown' },
  { feature: 'Domain Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Social Media Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Phishing Detection', doppeldown: true, competitor: 'Deep (core focus)', winner: 'competitor' },
  { feature: 'Real-Time Phishing Analysis', doppeldown: 'Scheduled scans', competitor: 'Real-time AI detection', winner: 'competitor' },
  { feature: 'Automated Takedowns', doppeldown: 'Takedown reports', competitor: 'Automated takedown service', winner: 'competitor' },
  { feature: 'Takedown Reports', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'NRD (New Domain) Feed', doppeldown: 'Enterprise plan', competitor: true, winner: 'both' },
  { feature: 'API Access', doppeldown: 'Pro & Enterprise', competitor: 'Enterprise only', winner: 'doppeldown' },
  { feature: 'Evidence Packages', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Ideal For', doppeldown: 'SMBs to Enterprise', competitor: 'Mid-market to Enterprise', winner: 'doppeldown' },
  { feature: 'Contract Required', doppeldown: 'No — cancel anytime', competitor: 'Annual contract typical', winner: 'doppeldown' },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <XCircle className="h-5 w-5 text-red-400 mx-auto" />
    )
  }
  return <span>{value}</span>
}

export default function BolsterComparisonPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Logo mode="dark" size="md" />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            DoppelDown vs Bolster (CheckPhish) — Brand Protection Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bolster offers AI-powered phishing detection but charges{' '}
            <strong className="text-foreground">$20,000–$100,000+ per year</strong> with no published
            pricing. DoppelDown gives you{' '}
            <strong className="text-foreground">transparent pricing, a free tier, and instant setup</strong>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { label: 'DoppelDown Free Tier', value: '$0/month', sub: 'No credit card required' },
            { label: 'Bolster Starting Price', value: '$20K+/year', sub: 'Custom quotes only' },
            { label: 'You Save Up To', value: '98%+', sub: 'Compared to Bolster' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Feature-by-Feature Comparison</h2>
        <div className="overflow-x-auto mb-14 -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-primary-600 font-semibold">DoppelDown</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Bolster (CheckPhish)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 text-foreground font-medium">{row.feature}</td>
                  <td
                    className={`py-3 px-4 text-center ${
                      row.winner === 'doppeldown' || row.winner === 'both'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <CellValue value={row.doppeldown} />
                  </td>
                  <td
                    className={`py-3 px-4 text-center ${
                      row.winner === 'competitor' || row.winner === 'both'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <CellValue value={row.competitor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why DoppelDown */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Why Businesses Choose DoppelDown Over Bolster
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Transparent Pricing — No Surprises',
                desc: 'Bolster has no published pricing — you need to go through a sales process to even learn what it costs. DoppelDown\'s plans are listed publicly: $0, $49, $99, or $249/month. What you see is what you pay.',
              },
              {
                title: 'True Free Tier, Not Just a Scanner',
                desc: 'Bolster offers CheckPhish as a free URL scanner, but their actual brand protection platform requires enterprise pricing. DoppelDown\'s free tier includes real ongoing brand monitoring — not just a one-off scan.',
              },
              {
                title: 'No Sales Calls Needed',
                desc: 'With Bolster, you can\'t even get started without talking to sales. DoppelDown is fully self-serve — sign up, add your brand, and start scanning in under 5 minutes.',
              },
              {
                title: 'Built for Every Business Size',
                desc: 'Bolster primarily serves mid-market and enterprise clients. DoppelDown scales from solo founders to growing businesses without forcing you into a contract you can\'t afford.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When Bolster Might Be Better */}
        <section className="mb-14 bg-card rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            When Bolster Might Be a Better Fit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Bolster (also known for their CheckPhish scanner) has built an impressive AI-powered
            phishing detection engine with real-time analysis and a large data lake of known threats.
            Their automated takedown service handles the entire takedown lifecycle, and their
            detection speed for new phishing pages is among the fastest in the industry.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If your business faces high-volume phishing campaigns and you need real-time detection
            with fully managed automated takedowns — and you have the budget ($20K+/year) — Bolster&apos;s
            specialised phishing focus may be worth the premium. For broader brand protection
            at an accessible price, DoppelDown is the clear choice.
          </p>
        </section>

        {/* DoppelDown Pricing */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">DoppelDown Pricing</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Free', price: '$0', period: 'forever', note: '1 brand, basic monitoring' },
              { name: 'Starter', price: '$49', period: '/month', note: '3 brands, weekly scans' },
              { name: 'Pro', price: '$99', period: '/month', note: '10 brands, daily scans, API' },
              { name: 'Enterprise', price: '$249', period: '/month', note: 'Unlimited brands, NRD feed' },
            ].map((plan) => (
              <div key={plan.name} className="bg-card rounded-xl border border-border p-5 text-center">
                <p className="text-sm font-medium text-muted-foreground">{plan.name}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">{plan.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Brand Protection With Pricing You Can Actually See
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            No &quot;contact sales for pricing&quot; games. No surprise quotes. Just transparent plans
            and a free tier to get started. Protect your brand today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Start Free Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is DoppelDown a good alternative to Bolster?',
                a: 'Yes. DoppelDown offers domain monitoring, phishing detection, social media scanning, and takedown reports — starting at $0/month with transparent pricing. If you don\'t need Bolster\'s real-time phishing-specific AI engine, DoppelDown provides comparable brand protection at a fraction of the cost.',
              },
              {
                q: 'What is CheckPhish and how does it relate to Bolster?',
                a: 'CheckPhish is a free URL phishing scanner built by Bolster. It lets anyone check if a URL is a phishing site. However, CheckPhish is just a single-URL scanner — Bolster\'s full brand protection platform is a separate enterprise product with custom pricing.',
              },
              {
                q: 'How much does Bolster cost?',
                a: 'Bolster does not publish pricing. Based on industry reports, their brand protection platform typically costs $20,000 to $100,000+ per year depending on the scope of coverage and number of brands monitored. A sales call is required to get a quote.',
              },
              {
                q: 'Does DoppelDown detect phishing sites?',
                a: 'Yes. DoppelDown monitors for lookalike domains, phishing pages, and brand impersonation across the web. While Bolster offers more specialised real-time phishing AI, DoppelDown\'s phishing detection covers the most common threats that affect SMBs and growing businesses.',
              },
              {
                q: 'Can I try DoppelDown before paying?',
                a: 'Absolutely. DoppelDown offers a completely free tier that lets you monitor 1 brand with basic scanning — no credit card required. With Bolster, you can\'t even access the platform without going through a sales process.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other comparisons */}
        <section className="mt-14 text-center">
          <p className="text-muted-foreground mb-3">See how DoppelDown compares to other providers:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/compare/brandshield"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs BrandShield
            </Link>
            <Link
              href="/compare/red-points"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs Red Points
            </Link>
            <Link
              href="/compare/phishlabs"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs PhishLabs
            </Link>
            <Link
              href="/compare/zerofox"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs ZeroFox
            </Link>
            <Link
              href="/compare/allure-security"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs Allure Security
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} DoppelDown. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
