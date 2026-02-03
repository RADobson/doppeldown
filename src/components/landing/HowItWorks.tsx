import { Search, Zap, Shield, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Detect & Monitor',
      description: 'Enter your brand name and domain. Our AI instantly begins scanning 500+ domain variations, social platforms, and the deep web for impersonation attempts.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      icon: Zap,
      title: 'Analyze & Score',
      description: 'Threats are automatically scored using machine learning. Critical alerts reach you in minutes, with full context and evidence collected automatically.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      icon: Shield,
      title: 'Act & Protect',
      description: 'Generate professional takedown reports with a single click. Track resolution progress and watch your threat exposure decrease over time.',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-landing-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-foreground mb-6">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              5 minutes
            </span>
          </h2>
          <p className="text-xl text-landing-muted max-w-3xl mx-auto">
            No sales calls. No onboarding meetings. No waiting. Start protecting your brand immediately.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Step Card */}
                <div className="relative p-8 rounded-2xl bg-landing border border-landing-border hover:border-primary-500/30 transition-all group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-lg shadow-lg`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-6 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-landing-elevated border border-landing-border flex items-center justify-center group-hover:border-primary-500/30 transition-colors">
                      <step.icon className="w-8 h-8 text-primary-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-landing-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-landing-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow - Desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-landing-elevated border border-landing-border flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-primary-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-landing border border-landing-border">
            <div className="flex items-center gap-2 text-landing-muted text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </div>
            <div className="w-px h-4 bg-landing-border" />
            <div className="flex items-center gap-2 text-landing-muted text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free forever tier
            </div>
            <div className="w-px h-4 bg-landing-border" />
            <div className="flex items-center gap-2 text-landing-muted text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
