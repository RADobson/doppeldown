import Link from 'next/link'
import { Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function Cta() {
  return (
    <section className="py-20 lg:py-28 bg-landing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-purple-600/10 to-landing" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-primary-300 text-sm font-medium">Start protecting your brand today</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-landing-foreground mb-6 leading-tight">
            Stop letting impostors{' '}
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              profit from your brand
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-landing-muted mb-10 max-w-2xl mx-auto">
            Most brand protection tools cost $15,000+/year and require a sales call. 
            DoppelDown gives you real results in 5 minutes — for free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-[1.02]"
            >
              <Shield className="w-5 h-5" />
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-landing-muted">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free forever tier available
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              14-day trial on paid plans
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
