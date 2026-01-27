import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Hero() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo mode="dark" size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full text-red-700 text-sm font-medium mb-8">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Over 3 million phishing sites created daily
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Protect Your Brand From
              <span className="text-primary-600"> Online Threats</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Automatically detect typosquatting domains, phishing pages, and brand impersonation.
              Collect evidence and generate takedown reports in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-600/30"
              >
                Start 14-Day Free Trial
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition"
              >
                See How It Works
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Brands Monitored', value: '3', color: 'blue' },
                    { label: 'Threats Detected', value: '47', color: 'red' },
                    { label: 'Domains Scanned', value: '1,284', color: 'green' },
                    { label: 'Takedowns Sent', value: '23', color: 'purple' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-900">Recent Threats</span>
                    <span className="text-sm text-gray-500">Last 24 hours</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { domain: 'yourband-login.com', type: 'Phishing', severity: 'Critical' },
                      { domain: 'yourbrand.xyz', type: 'Typosquat', severity: 'High' },
                      { domain: 'y0urbrand.com', type: 'Homoglyph', severity: 'High' },
                    ].map((threat, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            threat.severity === 'Critical' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          <span className="font-mono text-sm">{threat.domain}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{threat.type}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            threat.severity === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>{threat.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
