'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Shield, Zap, ChevronRight } from 'lucide-react'

export default function Hero() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-landing/80 backdrop-blur-xl z-50 border-b border-landing-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo mode="light" size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#why-now" className="text-landing-muted hover:text-landing-foreground transition-colors text-sm font-medium">Why Now</a>
              <a href="#features" className="text-landing-muted hover:text-landing-foreground transition-colors text-sm font-medium">Platform</a>
              <a href="#pricing" className="text-landing-muted hover:text-landing-foreground transition-colors text-sm font-medium">Pricing</a>
              <Link href="/blog" className="text-landing-muted hover:text-landing-foreground transition-colors text-sm font-medium">Blog</Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/auth/login" className="text-landing-muted hover:text-landing-foreground transition-colors text-sm font-medium hidden sm:block">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all text-sm font-medium shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-600/5 via-transparent to-transparent" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="max-w-5xl mx-auto text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-landing-elevated border border-landing-border rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-landing-muted text-sm font-medium">Brand protection without the $15K/year price tag</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-landing-foreground mb-6 leading-[1.1] tracking-tight">
            Defend your brand from{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-primary-500 bg-clip-text text-transparent">
              impersonation attacks
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-landing-muted mb-10 max-w-3xl mx-auto leading-relaxed">
            AI-powered detection of fake domains, phishing sites, and social media impostors. 
            Automated threat scoring and evidence collection — results in minutes, not months.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-[1.02]"
            >
              <Shield className="w-5 h-5" />
              Start Free — No Credit Card
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-landing-muted hover:text-landing-foreground transition-colors text-lg font-medium"
            >
              <Zap className="w-5 h-5" />
              See it in action
            </a>
          </div>

          {/* Trust Microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-landing-muted">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free forever tier
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              5-minute setup
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
