import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '1 brand',
        '25 domain monitors',
        '1 social account',
        '1 manual scan/week',
        'Email alerts',
        'Basic threat scoring'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      price: '$49',
      description: 'For small businesses',
      features: [
        '3 brands',
        '100 domain monitors',
        '3 social accounts',
        'Daily scans',
        'Email & webhook alerts',
        'AI threat scoring',
        'Evidence collection'
      ],
      cta: 'Start Trial',
      popular: false
    },
    {
      name: 'Pro',
      price: '$99',
      description: 'For growing teams',
      features: [
        '10 brands',
        '500 domain monitors',
        '6 social accounts',
        'Scans every 6 hours',
        'Priority alerts',
        'Advanced AI scoring',
        'Takedown reports',
        'API access'
      ],
      cta: 'Start Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$249',
      description: 'For large organizations',
      features: [
        'Unlimited brands',
        '2,500 domain monitors',
        '8 social accounts',
        'Hourly scans',
        'NRD monitoring',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee'
      ],
      cta: 'Start Trial',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-foreground mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-landing-muted max-w-2xl mx-auto">
            Start free, upgrade when you need to. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? 'bg-primary-600 text-white lg:scale-105 lg:-my-4 shadow-xl shadow-primary-600/25'
                  : 'bg-landing-elevated border border-landing-border'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-white text-primary-600 text-xs font-semibold rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className={`font-semibold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-landing-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-primary-100' : 'text-landing-muted'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-landing-foreground'}`}>
                  {plan.price}
                </span>
                <span className={plan.popular ? 'text-primary-100' : 'text-landing-muted'}>/mo</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className={`flex items-start gap-3 text-sm ${plan.popular ? 'text-primary-100' : 'text-landing-muted'}`}>
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-white' : 'text-primary-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/auth/signup"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-white text-primary-600 hover:bg-primary-50 shadow-lg'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-landing-muted text-sm">
            All paid plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>

        {/* Comparison Note */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-landing-elevated border border-landing-border p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-landing-foreground mb-2">
                  Compare with enterprise solutions
                </h3>
                <p className="text-landing-muted">
                  See how DoppelDown stacks up against BrandShield, PhishLabs, Red Points, and other enterprise competitors.
                </p>
              </div>
              <Link
                href="/compare/brandshield"
                className="flex-shrink-0 px-6 py-3 bg-landing border border-landing-border rounded-xl text-landing-foreground font-medium hover:bg-landing-elevated transition-colors"
              >
                View Comparisons
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
