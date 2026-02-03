import { TrendingUp, AlertTriangle, Globe, Clock } from 'lucide-react'

export default function WhyNow() {
  const threats = [
    {
      icon: TrendingUp,
      stat: '3,000%',
      label: 'Increase',
      description: 'in phishing attacks targeting SMBs since 2020'
    },
    {
      icon: AlertTriangle,
      stat: '$4.9M',
      label: 'Average Cost',
      description: 'of a data breach for small businesses'
    },
    {
      icon: Globe,
      stat: '1.7M',
      label: 'New Domains',
      description: 'registered daily — many for malicious purposes'
    },
    {
      icon: Clock,
      stat: '287',
      label: 'Days',
      description: 'average time to identify and contain a breach'
    }
  ]

  return (
    <section id="why-now" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-landing">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            Why now
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-foreground mb-6">
            The threat landscape has{' '}
            <span className="text-primary-400">fundamentally changed</span>
          </h2>
          <p className="text-xl text-landing-muted max-w-3xl mx-auto">
            Brand impersonation attacks are skyrocketing. Legacy protection tools 
            cost $15K-250K/year, leaving SMBs exposed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {threats.map((threat, i) => (
            <div 
              key={i} 
              className="group relative p-6 rounded-2xl bg-landing-elevated border border-landing-border hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-600/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center group-hover:bg-primary-600/20 transition-colors">
                  <threat.icon className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-landing-foreground mb-1">
                {threat.stat}
              </div>
              <div className="text-sm font-medium text-primary-400 mb-2">
                {threat.label}
              </div>
              <p className="text-landing-muted text-sm">
                {threat.description}
              </p>
            </div>
          ))}
        </div>

        {/* The Problem Statement */}
        <div className="relative rounded-3xl bg-gradient-to-br from-landing-elevated to-landing border border-landing-border p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-landing-foreground mb-4">
                Legacy solutions exclude the businesses that need them most
              </h3>
              <p className="text-landing-muted mb-6">
                Enterprise brand protection tools require six-figure contracts and months of onboarding. 
                By the time you're protected, the damage is done.
              </p>
              <ul className="space-y-3">
                {[
                  'Months-long sales cycles before you can start',
                  'Complex integrations requiring engineering teams',
                  'Opaque pricing with hidden fees',
                  'Generic alerts with no actionable intelligence'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-landing-muted">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-2xl blur-xl" />
              <div className="relative bg-landing-elevated border border-landing-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-landing-muted">Traditional Solutions</span>
                  <span className="text-sm text-red-400">$15K - $250K+/year</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-landing-border rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-red-500/50 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-landing-muted">
                    <span>Cost</span>
                    <span>Prohibitive</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-landing-muted">DoppelDown</span>
                  <span className="text-sm text-green-400">$0 - $249/month</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-landing-border rounded-full overflow-hidden">
                    <div className="h-full w-[15%] bg-green-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-landing-muted">
                    <span>Cost</span>
                    <span>Accessible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
