import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'DoppelDown vs ZeroFox — Brand Protection Comparison | DoppelDown',
  description:
    'Compare DoppelDown and ZeroFox for digital risk protection. DoppelDown starts free — ZeroFox costs $50K+/year with enterprise-only sales. See the full feature comparison.',
  openGraph: {
    title: 'DoppelDown vs ZeroFox — Brand Protection Comparison',
    description:
      'See why growing businesses choose DoppelDown over ZeroFox. Free tier, instant setup, and plans from $49/mo vs $50K+/year.',
    url: 'https://doppeldown.com/compare/zerofox',
  },
  alternates: {
    canonical: 'https://doppeldown.com/compare/zerofox',
  },
}

const comparisonRows = [
  { feature: 'Starting Price', doppeldown: 'Free ($0)', competitor: '$50,000/year', winner: 'doppeldown' },
  { feature: 'Paid Plans From', doppeldown: '$49/month', competitor: '$50K–$200K/year', winner: 'doppeldown' },
  { feature: 'Free Tier Available', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Self-Serve Signup', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Setup Time', doppeldown: 'Under 5 minutes', competitor: 'Weeks (sales + onboarding)', winner: 'doppeldown' },
  { feature: 'Domain Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Social Media Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Phishing Detection', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Dark Web Monitoring', doppeldown: 'Enterprise plan', competitor: 'Deep (core strength)', winner: 'competitor' },
  { feature: 'Account Takeover Protection', doppeldown: 'Basic alerts', competitor: 'Advanced (core focus)', winner: 'competitor' },
  { feature: 'Threat Intelligence', doppeldown: 'Domain & social intel', competitor: 'Massive threat intel platform', winner: 'competitor' },
  { feature: 'Takedown Reports', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'NRD (New Domain) Feed', doppeldown: 'Enterprise plan', competitor: true, winner: 'both' },
  { feature: 'API Access', doppeldown: 'Pro & Enterprise', competitor: 'Enterprise only', winner: 'doppeldown' },
  { feature: 'Evidence Packages', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Ideal For', doppeldown: 'SMBs to Enterprise', competitor: 'Large enterprise only', winner: 'doppeldown' },
  { feature: 'Contract Required', doppeldown: 'No — cancel anytime', competitor: 'Annual contract', winner: 'doppeldown' },
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

export default function ZeroFoxComparisonPage() {
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
            DoppelDown vs ZeroFox — Digital Risk Protection Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ZeroFox charges <strong className="text-foreground">$50,000–$200,000+ per year</strong> with
            enterprise-only sales and lengthy onboarding. DoppelDown lets you{' '}
            <strong className="text-foreground">start protecting your brand in minutes — for free</strong>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { label: 'DoppelDown Free Tier', value: '$0/month', sub: 'No credit card required' },
            { label: 'ZeroFox Starting Price', value: '$50K+/year', sub: 'Enterprise sales only' },
            { label: 'You Save Up To', value: '99%+', sub: 'Compared to ZeroFox' },
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
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">ZeroFox</th>
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
            Why Businesses Choose DoppelDown Over ZeroFox
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: '99%+ More Affordable',
                desc: 'ZeroFox was acquired by Haveli Investments in 2023 for $350M — and their pricing reflects it. Contracts start at $50K/year minimum. DoppelDown\'s Enterprise plan is $249/month ($2,988/year), and you can start for free.',
              },
              {
                title: 'Self-Serve — No Sales Team Required',
                desc: 'ZeroFox requires enterprise sales calls, demos, and procurement cycles. DoppelDown lets you sign up, add your brand, and start scanning in under 5 minutes with no human interaction.',
              },
              {
                title: 'Built for SMBs, Not Just Enterprises',
                desc: 'ZeroFox targets large enterprises with dedicated security teams. DoppelDown is designed for businesses of all sizes — from solo founders to growing companies that need brand protection without a six-figure budget.',
              },
              {
                title: 'Transparent, Public Pricing',
                desc: 'Our plans are listed publicly: $49, $99, or $249/month. No hidden fees, no annual lock-in, no surprise quotes after weeks of back-and-forth with sales reps.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When ZeroFox Might Be Better */}
        <section className="mb-14 bg-card rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            When ZeroFox Might Be a Better Fit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            ZeroFox is a category leader in enterprise digital risk protection. Their platform
            excels at deep and dark web monitoring, account takeover protection, and massive-scale
            threat intelligence. If you&apos;re a large enterprise with a dedicated security
            operations center, a $50K+ annual budget for digital risk, and need deep/dark web
            intelligence feeds, ZeroFox offers capabilities that go beyond brand protection into
            full digital risk management.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For the vast majority of businesses that need domain monitoring, phishing detection,
            social media impersonation alerts, and takedown support — DoppelDown delivers the core
            brand protection features at a tiny fraction of the cost.
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
            Digital Risk Protection Shouldn&apos;t Require a $50K Budget
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Get the brand protection you need without enterprise pricing, sales calls, or months of onboarding.
            Start free — no credit card required.
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
                q: 'Is DoppelDown a good alternative to ZeroFox?',
                a: 'Yes. DoppelDown offers domain monitoring, phishing detection, social media scanning, and takedown reports — all core brand protection features — starting at $0/month instead of $50,000/year. For businesses that don\'t need full digital risk management with dark web intelligence, DoppelDown is the practical choice.',
              },
              {
                q: 'What happened to ZeroFox?',
                a: 'ZeroFox went public via SPAC in 2022, then was taken private by Haveli Investments in 2023 for approximately $350 million. They continue to operate as an enterprise digital risk protection platform with pricing that reflects their enterprise-only focus.',
              },
              {
                q: 'How much does ZeroFox cost?',
                a: 'ZeroFox pricing is not publicly available and requires an enterprise sales process. Industry sources indicate contracts typically start at $50,000/year and can reach $200,000+ depending on scope and modules selected.',
              },
              {
                q: 'Does DoppelDown offer dark web monitoring?',
                a: 'DoppelDown\'s Enterprise plan includes threat intelligence features. However, ZeroFox\'s deep/dark web monitoring is more extensive. For most businesses, the domain monitoring, phishing detection, and social media scanning in DoppelDown cover the most common brand threats at a fraction of the cost.',
              },
              {
                q: 'Can small businesses use ZeroFox?',
                a: 'ZeroFox is designed for large enterprises and their pricing reflects this ($50K+/year minimum). DoppelDown was built specifically to make brand protection accessible to businesses of all sizes, with a free tier and plans starting at $49/month.',
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
              href="/compare/bolster"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs Bolster
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
