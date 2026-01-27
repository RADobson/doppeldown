import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-landing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-landing-foreground text-center mb-12">
          Pricing
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              name: 'Free',
              price: '$0',
              features: ['1 brand', '25 domains', '1 social account', '1 manual scan/week'],
              cta: 'Get Started',
              popular: false
            },
            {
              name: 'Starter',
              price: '$49',
              features: ['3 brands', '100 domains', '3 social accounts', 'Daily scans'],
              cta: 'Start Trial',
              popular: false
            },
            {
              name: 'Pro',
              price: '$99',
              features: ['10 brands', '500 domains', '6 social accounts', 'Scans every 6 hours'],
              cta: 'Start Trial',
              popular: true
            },
            {
              name: 'Enterprise',
              price: '$249',
              features: ['Unlimited brands', '2500 domains', '8 social accounts', 'Hourly scans', 'NRD monitoring'],
              cta: 'Start Trial',
              popular: false
            }
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 ${
                plan.popular
                  ? 'bg-primary-600 text-white ring-2 ring-primary-500'
                  : 'bg-landing-elevated border border-landing-border'
              }`}
            >
              <h3 className={`font-semibold ${plan.popular ? 'text-white' : 'text-landing-foreground'}`}>
                {plan.name}
              </h3>
              <div className="mt-2 mb-4">
                <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-landing-foreground'}`}>
                  {plan.price}
                </span>
                <span className={plan.popular ? 'text-primary-100' : 'text-landing-muted'}>/mo</span>
              </div>
              <ul className={`space-y-2 text-sm mb-6 ${plan.popular ? 'text-primary-100' : 'text-landing-muted'}`}>
                {plan.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-2 rounded-lg font-medium transition ${
                  plan.popular
                    ? 'bg-card text-primary-600 hover:bg-primary-50'
                    : 'bg-landing-border text-landing-foreground hover:bg-landing'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
