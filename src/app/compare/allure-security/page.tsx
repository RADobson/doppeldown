import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'DoppelDown vs Allure Security — Brand Protection Comparison | DoppelDown',
  description:
    'Compare DoppelDown and Allure Security for brand protection. DoppelDown starts free with instant setup — Allure Security targets Fortune 500 with $30K–$150K/year enterprise pricing.',
  openGraph: {
    title: 'DoppelDown vs Allure Security — Brand Protection Comparison',
    description:
      'See why growing businesses choose DoppelDown over Allure Security. Free tier, transparent pricing, and plans from $49/mo vs $30K+/year.',
    url: 'https://doppeldown.com/compare/allure-security',
  },
  alternates: {
    canonical: 'https://doppeldown.com/compare/allure-security',
  },
}

const comparisonRows = [
  { feature: 'Starting Price', doppeldown: 'Free ($0)', competitor: '~$30,000/year', winner: 'doppeldown' },
  { feature: 'Paid Plans From', doppeldown: '$49/month', competitor: '$30K–$150K/year', winner: 'doppeldown' },
  { feature: 'Free Tier Available', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Self-Serve Signup', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Transparent Pricing', doppeldown: true, competitor: false, winner: 'doppeldown' },
  { feature: 'Setup Time', doppeldown: 'Under 5 minutes', competitor: 'Weeks (enterprise onboarding)', winner: 'doppeldown' },
  { feature: 'Domain Monitoring', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Social Media Monitoring', doppeldown: true, competitor: 'Limited', winner: 'doppeldown' },
  { feature: 'Phishing Detection', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Decoy / Honeypot Technology', doppeldown: false, competitor: 'Unique (core differentiator)', winner: 'competitor' },
  { feature: 'Phishing Page Manipulation', doppeldown: false, competitor: 'Yes (credential capture disruption)', winner: 'competitor' },
  { feature: 'Takedown Reports', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'NRD (New Domain) Feed', doppeldown: 'Enterprise plan', competitor: true, winner: 'both' },
  { feature: 'API Access', doppeldown: 'Pro & Enterprise', competitor: 'Enterprise only', winner: 'doppeldown' },
  { feature: 'Evidence Packages', doppeldown: true, competitor: true, winner: 'both' },
  { feature: 'Ideal For', doppeldown: 'SMBs to Enterprise', competitor: 'Fortune 500 only', winner: 'doppeldown' },
  { feature: 'Contract Required', doppeldown: 'No — cancel anytime', competitor: 'Annual enterprise contract', winner: 'doppeldown' },
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

export default function AllureSecurityComparisonPage() {
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
            DoppelDown vs Allure Security — Brand Protection Comparison
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Allure Security targets Fortune 500 companies with pricing from{' '}
            <strong className="text-foreground">$30,000–$150,000+ per year</strong> and
            enterprise-only sales. DoppelDown makes brand protection{' '}
            <strong className="text-foreground">accessible to every business — starting free</strong>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { label: 'DoppelDown Free Tier', value: '$0/month', sub: 'No credit card required' },
            { label: 'Allure Security Starting Price', value: '$30K+/year', sub: 'Enterprise sales only' },
            { label: 'You Save Up To', value: '99%+', sub: 'Compared to Allure Security' },
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
                <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Allure Security</th>
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
            Why Businesses Choose DoppelDown Over Allure Security
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Actually Accessible to Your Business',
                desc: 'Allure Security is built for Fortune 500 companies with six-figure security budgets. DoppelDown is built for every business — start free, upgrade when you need to, cancel anytime.',
              },
              {
                title: 'Transparent Pricing — No Guessing',
                desc: 'Allure Security doesn\'t publish pricing, and quotes can range from $30K to $150K+/year. DoppelDown\'s plans are listed publicly: $0, $49, $99, or $249/month. No surprises.',
              },
              {
                title: 'Instant Setup, Not Enterprise Onboarding',
                desc: 'Allure Security requires enterprise sales cycles, procurement, and onboarding. DoppelDown: sign up, add your brand, start scanning in under 5 minutes.',
              },
              {
                title: 'No Contract Lock-In',
                desc: 'Allure Security typically requires annual enterprise contracts. DoppelDown is month-to-month — cancel anytime, no penalties, no lengthy exit process.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When Allure Security Might Be Better */}
        <section className="mb-14 bg-card rounded-xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            When Allure Security Might Be a Better Fit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Allure Security has a genuinely unique approach: their &quot;decoy&quot; technology can
            manipulate phishing pages in real-time, inserting fake credentials to poison attacker
            databases and track stolen data. This honeypot-style approach is innovative and
            provides intelligence that goes beyond simple detection and takedown.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you&apos;re a Fortune 500 company facing sophisticated, targeted phishing campaigns
            and you want to actively disrupt attackers (not just detect them), Allure Security&apos;s
            decoy technology is genuinely differentiated. For the vast majority of businesses
            that need reliable brand monitoring, phishing detection, and takedown support,
            DoppelDown delivers the essentials at a price that makes sense.
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
            Brand Protection for Every Business — Not Just the Fortune 500
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            You don&apos;t need a Fortune 500 budget to protect your brand. Start free with DoppelDown
            — no sales calls, no enterprise contracts, no weeks of onboarding.
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
                q: 'Is DoppelDown a good alternative to Allure Security?',
                a: 'Yes. DoppelDown offers domain monitoring, phishing detection, social media scanning, and takedown reports — starting at $0/month instead of $30,000+/year. Unless you specifically need Allure Security\'s decoy/honeypot technology, DoppelDown provides the brand protection features most businesses need at a fraction of the cost.',
              },
              {
                q: 'What is Allure Security\'s decoy technology?',
                a: 'Allure Security uses a unique approach where they inject fake credentials and tracking data into phishing pages to poison attacker databases and trace stolen information. This "active defense" approach goes beyond detection and takedown, but it\'s primarily designed for Fortune 500 companies facing sophisticated targeted attacks.',
              },
              {
                q: 'How much does Allure Security cost?',
                a: 'Allure Security does not publish pricing and focuses exclusively on enterprise clients. Based on industry information, contracts typically range from $30,000 to $150,000+ per year depending on scope, with annual commitments required.',
              },
              {
                q: 'Can DoppelDown protect my brand without decoy technology?',
                a: 'Absolutely. The vast majority of brand threats — domain squatting, lookalike sites, phishing pages, social media impersonation — are effectively handled by monitoring, detection, and takedown workflows. DoppelDown covers all of these. Decoy technology is a niche capability most businesses don\'t need.',
              },
              {
                q: 'Does Allure Security work for small businesses?',
                a: 'No. Allure Security targets Fortune 500 and large enterprise clients exclusively, with pricing starting at $30K+/year. DoppelDown was specifically built to make brand protection accessible to businesses of all sizes, with a free tier and plans from $49/month.',
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
              href="/compare/bolster"
              className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-4"
            >
              DoppelDown vs Bolster
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
