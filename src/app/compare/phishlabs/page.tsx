import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'DoppelDown vs PhishLabs (Fortra) — Brand Protection Comparison | DoppelDown',
  description:
    'Compare DoppelDown and PhishLabs (Fortra) for brand protection. DoppelDown starts free — PhishLabs costs $50K–$250K/year with complex integration. Full feature comparison.',
  openGraph: {
    title: 'DoppelDown vs PhishLabs (Fortra) — Brand Protection Comparison',
    description:
      'See why growing businesses choose DoppelDown over PhishLabs. Free tier, instant setup, and plans from $49/mo vs $50K+/year.',
    url: 'https://doppeldown.com/compare/phishlabs',
  },
  alternates: {
    canonical: 'https://doppeldown.com/compare/phishlabs',
  },
}

const comparisonRows = [
  { feature: 'Starting Price', doppeldown: 'Free ($0)', competitor: '$50,000/year', winner: 'doppeldown' },
  { feature: 'Paid Plans From', doppeldown: '$49/month', competitor: '$50K–$250K/year', winner: 'doppeldown' },
  { feature: 'Free Tier Available', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Self-Serve Signup', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Setup Time', doppeldown: 'Under 5 minutes', competitor: 'Weeks to months', winner: 'doppeldown' },
  { feature: 'Domain Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Social Media Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Phishing Detection', doppeldown: true, competitor: 'Deep (core focus)', winner: 'competitor' },
  { feature: 'Phishing Takedowns', doppeldown: 'Takedown reports', competitor: 'Managed takedowns', winner: 'competitor' },
  { feature: 'Threat Intelligence', doppeldown: 'Domain & social intel', competitor: 'Extensive (dark web, email)', winner: 'competitor' },
  { feature: 'Takedown Reports', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'NRD (New Domain) Feed', doppeldown: 'Enterprise plan', competitor: true, winner: 'both' },
  { feature: 'API Access', doppeldown: 'Pro & Enterprise', competitor: true, winner: 'both' },
  { feature: 'Evidence Packages', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Integration Complexity', doppeldown: 'Plug-and-play', competitor: 'Complex (SOC integration)', winner: 'doppeldown' },
  { feature: 'Ideal For', doppeldown: 'SMBs to Enterprise', competitor: 'Large enterprise / financial', winner: 'doppeldown' },
  { feature: 'Contract Required', doppeldown: 'No — cancel anytime', competitor: 'Multi-year contracts common', winner: 'doppeldown' },
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

export default function PhishLabsComparisonPage() {
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
            DoppelDown vs PhishLabs (Fortra) — Brand Protection Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PhishLabs by Fortra charges{' '}
            <strong className="text-foreground">$50,000–$250,000 per year</strong> and requires complex
            SOC integration. DoppelDown lets you{' '}
            <strong className="text-foreground">start protecting your brand in minutes — for free</strong>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { label: 'DoppelDown Free Tier', value: '$0/month', sub: 'No credit card required' },
            { label: 'PhishLabs Starting Price', value: '$50K+/year', sub: 'Requires sales + SOC team' },
            { label: 'You Save Up To', value: '99.8%', sub: 'Compared to PhishLabs' },
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
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">PhishLabs (Fortra)</th>
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
            Why Businesses Choose DoppelDown Over PhishLabs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: '200x–1000x More Affordable',
                desc: 'PhishLabs contracts typically start at $50K/year and can exceed $250K. DoppelDown\'s Enterprise plan is $249/month ($2,988/year) — and you can start for free.',
              },
              {
                title: 'No SOC Team Required',
                desc: 'PhishLabs is designed to integrate into enterprise Security Operations Centers. DoppelDown is self-serve and works out of the box — no security team needed.',
              },
              {
                title: 'Minutes, Not Months',
                desc: 'PhishLabs deployments often take weeks to months with professional services. DoppelDown: sign up, add your brand, start scanning in under 5 minutes.',
              },
              {
                title: 'Built for the Rest of Us',
                desc: 'PhishLabs serves Fortune 500 banks and financial institutions. DoppelDown serves everyone — from solo founders to growing enterprises who need brand protection without the six-figure price tag.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When PhishLabs Might Be Better */}
        <section className="mb-14 bg-card rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            When PhishLabs Might Be a Better Fit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PhishLabs (now part of Fortra) is a category leader in managed phishing takedowns and
            threat intelligence for large financial institutions. If you&apos;re a major bank or
            financial services company with a dedicated SOC team, an existing Fortra relationship,
            and a six-figure security budget, PhishLabs offers deep capabilities like dark web
            intelligence, managed email threat response, and fully managed takedown operations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For the other 99% of businesses that need brand protection without the enterprise
            complexity and cost, DoppelDown is the practical choice.
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
            Enterprise-Grade Brand Protection — Without the Enterprise Price
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            You don&apos;t need a $250K budget or a SOC team to protect your brand.
            Start free — no credit card, no sales call, no months-long deployment.
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
                q: 'Is DoppelDown a good alternative to PhishLabs?',
                a: 'Yes. DoppelDown offers domain monitoring, phishing detection, social media scanning, and takedown reports — starting at $0/month. For businesses that don\'t need a fully managed SOC-integrated solution, DoppelDown delivers the core brand protection features at 99%+ savings.',
              },
              {
                q: 'What is PhishLabs / Fortra?',
                a: 'PhishLabs is a digital risk protection company acquired by Fortra (formerly HelpSystems) in 2022. They specialise in phishing takedowns, threat intelligence, and brand abuse detection, primarily serving large financial institutions.',
              },
              {
                q: 'How much does PhishLabs cost?',
                a: 'PhishLabs pricing is not publicly available. Industry sources report typical contracts range from $50,000 to $250,000+ per year depending on scope, with multi-year commitments common.',
              },
              {
                q: 'Does DoppelDown do phishing takedowns?',
                a: 'DoppelDown provides phishing detection with evidence packages and takedown reports that you can submit to hosting providers and registrars. PhishLabs offers fully managed takedowns as a service — but at 100–1000x the price.',
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
