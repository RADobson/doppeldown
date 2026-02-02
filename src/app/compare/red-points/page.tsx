import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'DoppelDown vs Red Points — Brand Protection Comparison | DoppelDown',
  description:
    'Compare DoppelDown and Red Points for brand protection. DoppelDown starts free — Red Points costs $25K–$100K/year with long onboarding. See the full feature comparison.',
  openGraph: {
    title: 'DoppelDown vs Red Points — Brand Protection Comparison',
    description:
      'See why growing businesses choose DoppelDown over Red Points. Free tier, instant setup, and plans from $49/mo vs $25K+/year.',
    url: 'https://doppeldown.com/compare/red-points',
  },
  alternates: {
    canonical: 'https://doppeldown.com/compare/red-points',
  },
}

const comparisonRows = [
  { feature: 'Starting Price', doppeldown: 'Free ($0)', competitor: '$25,000/year', winner: 'doppeldown' },
  { feature: 'Paid Plans From', doppeldown: '$49/month', competitor: '$25K–$100K/year', winner: 'doppeldown' },
  { feature: 'Free Tier Available', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Self-Serve Signup', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Setup Time', doppeldown: 'Under 5 minutes', competitor: '4–8 weeks (onboarding)', winner: 'doppeldown' },
  { feature: 'Domain Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Social Media Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Phishing Detection', doppeldown: true, competitor: 'Limited', winner: 'doppeldown' },
  { feature: 'Counterfeit Goods Detection', doppeldown: 'Basic', competitor: 'Deep (marketplace focus)', winner: 'competitor' },
  { feature: 'Marketplace Monitoring', doppeldown: 'Social platforms', competitor: 'Extensive (Amazon, eBay, etc.)', winner: 'competitor' },
  { feature: 'Takedown Reports', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'NRD (New Domain) Feed', doppeldown: 'Enterprise plan', competitor: true, winner: 'both' },
  { feature: 'API Access', doppeldown: 'Pro & Enterprise', competitor: 'Enterprise only', winner: 'doppeldown' },
  { feature: 'Evidence Packages', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Ideal For', doppeldown: 'SMBs to Enterprise', competitor: 'Large enterprise / retail brands', winner: 'doppeldown' },
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

export default function RedPointsComparisonPage() {
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
            DoppelDown vs Red Points — Brand Protection Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Red Points charges <strong className="text-foreground">$25,000–$100,000 per year</strong> and
            requires weeks of onboarding. DoppelDown lets you{' '}
            <strong className="text-foreground">start protecting your brand in minutes — for free</strong>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { label: 'DoppelDown Free Tier', value: '$0/month', sub: 'No credit card required' },
            { label: 'Red Points Starting Price', value: '$25K+/year', sub: 'Requires sales call' },
            { label: 'You Save Up To', value: '99%', sub: 'Compared to Red Points' },
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
        <div className="overflow-x-auto mb-14">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-primary-600 font-semibold">DoppelDown</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Red Points</th>
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
            Why Businesses Choose DoppelDown Over Red Points
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Start Free, Scale When Ready',
                desc: 'Red Points has no free tier and requires a lengthy sales process. DoppelDown lets you start monitoring your brand today at no cost — no calls, no demos, no contracts.',
              },
              {
                title: 'Transparent, Predictable Pricing',
                desc: 'Our plans are publicly listed: $49, $99, or $249/month. Red Points pricing is opaque and can reach $100K/year for larger deployments.',
              },
              {
                title: 'Get Started in Minutes, Not Months',
                desc: 'Red Points is known for 4–8 week onboarding cycles. With DoppelDown, sign up, add your brand, and start scanning in under 5 minutes.',
              },
              {
                title: 'Beyond Counterfeits',
                desc: 'Red Points focuses heavily on counterfeit goods and marketplace enforcement. DoppelDown provides broader brand protection including phishing, domain squatting, and social impersonation.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When Red Points Might Be Better */}
        <section className="mb-14 bg-card rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            When Red Points Might Be a Better Fit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Red Points has deep marketplace integrations (Amazon, eBay, Alibaba) and specialises in
            counterfeit goods takedowns. If your <em>primary</em> concern is physical counterfeit
            products sold on e-commerce marketplaces and you have the budget ($25K+/year), Red Points
            may serve that niche better.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For everything else — domain monitoring, phishing, social impersonation, lookalike sites —
            DoppelDown delivers comparable or better coverage at a fraction of the cost.
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
            Brand Protection Shouldn&apos;t Cost $25K+ Per Year
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Get the same core brand protection features at a price that makes sense.
            Start free — no credit card, no sales call, no multi-week onboarding.
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
                q: 'Is DoppelDown a good alternative to Red Points?',
                a: 'Yes. DoppelDown offers domain monitoring, phishing detection, social media scanning, and takedown reports — starting at $0/month instead of $25,000/year. For non-marketplace brand threats, DoppelDown provides comparable coverage.',
              },
              {
                q: 'Does DoppelDown detect counterfeit products?',
                a: 'DoppelDown focuses on digital brand threats: domain squatting, phishing sites, and social media impersonation. For deep marketplace counterfeit detection, Red Points may still be relevant — but most businesses need digital protection first.',
              },
              {
                q: 'How much does Red Points cost?',
                a: 'Red Points pricing is not publicly available and typically ranges from $25,000 to $100,000 per year. An annual contract and lengthy sales process are required.',
              },
              {
                q: 'Can I use DoppelDown and Red Points together?',
                a: 'Yes. Some businesses use DoppelDown for domain and phishing protection while using Red Points for marketplace enforcement. DoppelDown\'s affordable pricing makes this combination practical.',
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
              href="/compare/phishlabs"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs PhishLabs
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
