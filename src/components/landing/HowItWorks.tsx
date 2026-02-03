import { ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Detect & Monitor',
    description: 'Our AI continuously scans 500+ domain variations, social platforms, and web pages for potential impersonation attempts targeting your brand.',
    details: ['Domain variation analysis', 'Social media monitoring', 'Visual similarity detection', 'Real-time alerts']
  },
  {
    step: '02',
    title: 'Score & Prioritize',
    description: 'Machine learning algorithms analyze each potential threat, scoring them by severity so you can focus on what actually matters.',
    details: ['AI-powered threat scoring', 'False positive filtering', 'Severity classification', 'Risk assessment']
  },
  {
    step: '03',
    title: 'Act & Eliminate',
    description: 'Generate comprehensive evidence packages and initiate takedowns with pre-filled templates for registrars and platforms.',
    details: ['Evidence collection', 'Takedown templates', 'Progress tracking', 'Success monitoring']
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-landing relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-landing-border/50 text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-landing-border">
            How DoppelDown Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-landing-foreground mb-6 tracking-tight">
            From Detection to
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"> Elimination</span>
          </h2>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            No sales calls. No complex onboarding. Get protected in minutes with our streamlined three-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-primary-600/50 via-primary-500/50 to-primary-400/50" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((item, i) => (
              <div key={i} className="relative">
                {/* Step Number with Glow */}
                <div className="relative inline-block mb-8">
                  <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-600/30">
                    {item.step}
                  </div>
                  {/* Glow */}
                  <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-50 -z-10" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-landing-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-landing-muted mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Detail List */}
                <ul className="space-y-3">
                  {item.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-landing-muted group">
                      <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-landing-muted mb-4">
            Ready to see it in action?
          </p>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Try the live demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
