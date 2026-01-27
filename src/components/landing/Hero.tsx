import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Hero() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo mode="light" size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-400 hover:text-white">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Brand Impostors
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Detect fake domains and phishing sites targeting your brand.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Free
          </Link>
          <p className="text-sm text-gray-500 mt-3">No credit card required</p>
        </div>
      </section>
    </>
  )
}
