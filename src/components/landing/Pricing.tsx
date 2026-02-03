import Link from 'next/link'
import { Check, Sparkles, Zap, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Sparkles,
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
    period: '/month',
    description: 'For growing businesses',
    icon: Zap,
    features: [
      '3 brands',
      '100 domain monitors',
      '3 social accounts',
      'Daily scans',
      'Email + Slack alerts',
      'Advanced AI scoring',
      'Evidence collection'
    ],
    cta: 'Start Trial',
    popular: false
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For serious protection',
    icon: Zap,
    features: [
      '10 brands',
      '500 domain monitors',
      '6 social accounts',
      'Scans every 6 hours',
      'Priority alerts',
      'Takedown templates',
      'API access',
      'Team collaboration'
    ],
    cta: 'Start Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$249',
    period: '/month',
    description: 'Maximum security',
    icon: Building2,
    features: [
      'Unlimited brands',
      '2,500 domain monitors',
      '8 social accounts',
      'Hourly scans',
      'NRD monitoring',
      'Dedicated support',
      'Custom integrations',
      'SSO & advanced security'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-landing-elevated relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[200px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[200px] -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-landing-border/50 text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-landing-border">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-landing-foreground mb-6 tracking-tight">
            Simple, Transparent
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Start free and scale as you grow. All paid plans include a 14-day free trial. 
            No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${
                plan.popular
                  ? 'bg-landing border-2 border-primary-500 shadow-xl shadow-primary-600/10 scale-105 z-10'
                  : 'bg-landing/50 border border-landing-border/50 hover:border-landing-border hover:bg-landing hover:shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.popular ? 'bg-primary-600/20' : 'bg-landing-elevated'
              }`}>
                <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary-400' : 'text-landing-muted'}`} />
              </div>

              {/* Plan Name */}
              <h3 className="font-bold text-xl text-landing-foreground">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-2 mb-2">
                <span className="text-4xl font-bold text-landing-foreground">
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-landing-muted' : 'text-landing-muted/70'}`}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-landing-muted mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-primary-600/20' : 'bg-landing-elevated'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-primary-400' : 'text-landing-muted'}`} />
                    </div>
                    <span className={plan.popular ? 'text-landing-foreground' : 'text-landing-muted'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/auth/signup"
                className={`block text-center py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/25'
                    : 'bg-landing-elevated text-landing-foreground hover:bg-landing-border border border-landing-border/50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-landing-muted text-sm">
            Need a custom solution?{' '}
            <a href="mailto:sales@doppeldown.com" className="text-primary-400 hover:text-primary-300 transition-colors">
              Contact our sales team
            </a>
            {' '}for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  )
}
