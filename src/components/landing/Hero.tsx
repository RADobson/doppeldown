import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Hero() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-landing/90 backdrop-blur-md z-50 border-b border-landing-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo mode="light" size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-landing-muted hover:text-landing-foreground">Features</a>
              <a href="#pricing" className="text-landing-muted hover:text-landing-foreground">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-landing-muted hover:text-landing-foreground">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-primary-600/10 text-primary-400 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Brand protection that doesn&apos;t cost $15K/year
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-landing-foreground mb-4">
            Find Who&apos;s Impersonating Your Brand
          </h1>
          <p className="text-lg text-landing-muted mb-8 max-w-2xl mx-auto">
            Automated detection of fake domains, phishing sites, and social media impostors. 
            AI-powered threat scoring tells you what&apos;s actually dangerous. Results in minutes, not weeks.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Free — No Credit Card
          </Link>
          <p className="text-sm text-landing-muted mt-3">Free tier included forever · Paid plans from $49/mo</p>
        </div>
      </section>
    </>
  )
}
