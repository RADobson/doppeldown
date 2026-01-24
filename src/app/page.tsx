import Link from 'next/link'
import { Shield, Search, FileText, Bell, CheckCircle, AlertTriangle, Globe, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DoppelDown</span>
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Brand Protection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to detect, document, and take action against online brand abuse
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: 'Domain Monitoring',
                description: 'Detect 500+ typosquatting variations of your domain including homoglyphs, keyboard typos, and TLD swaps'
              },
              {
                icon: Globe,
                title: 'Web Scanning',
                description: 'Continuous scanning for lookalike websites, phishing pages, and brand impersonation across the web'
              },
              {
                icon: Lock,
                title: 'Evidence Collection',
                description: 'Automated screenshots, WHOIS data capture, and HTML archival for legal proceedings'
              },
              {
                icon: FileText,
                title: 'Takedown Reports',
                description: 'Generate professional takedown request documents ready to send to registrars and hosts'
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                description: 'Get notified immediately when critical threats are detected via email or webhook'
              },
              {
                icon: Shield,
                title: 'Threat Intelligence',
                description: 'Severity scoring and detailed analysis to help you prioritize your response'
              },
              {
                icon: CheckCircle,
                title: 'Status Tracking',
                description: 'Track the status of each threat from detection through resolution'
              },
              {
                icon: AlertTriangle,
                title: 'Risk Dashboard',
                description: 'Visual overview of your brand\'s security posture and threat landscape'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How DoppelDown Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get protected in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Add Your Brand',
                description: 'Enter your brand name, domain, and any keywords you want to monitor'
              },
              {
                step: '2',
                title: 'Automated Scanning',
                description: 'Our system generates domain variations and scans the web for threats'
              },
              {
                step: '3',
                title: 'Review Threats',
                description: 'View detected threats with severity ratings and evidence collected'
              },
              {
                step: '4',
                title: 'Take Action',
                description: 'Generate takedown reports and submit to registrars or agencies'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-primary-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2 text-primary-200">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$49',
                description: 'For small businesses and startups',
                features: [
                  '1 brand to monitor',
                  'Weekly automated scans',
                  'Email alerts',
                  'Basic takedown reports',
                  'Domain monitoring',
                  '30-day evidence storage'
                ],
                popular: false
              },
              {
                name: 'Professional',
                price: '$99',
                description: 'For growing companies',
                features: [
                  '3 brands to monitor',
                  'Daily automated scans',
                  'Priority email alerts',
                  'Detailed takedown reports',
                  'Domain + web monitoring',
                  'WHOIS tracking',
                  '90-day evidence storage',
                  'API access'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$249',
                description: 'For large organizations',
                features: [
                  '10 brands to monitor',
                  'Continuous monitoring',
                  'Instant alerts + webhooks',
                  'Legal-ready reports',
                  'Full evidence packages',
                  'Unlimited storage',
                  'Priority support',
                  'Custom integrations',
                  'Dedicated account manager'
                ],
                popular: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl shadow-sm ${
                  plan.popular ? 'ring-2 ring-primary-600 scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <Link
                    href="/auth/signup"
                    className={`mt-6 block w-full text-center py-3 rounded-lg font-semibold transition ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Protecting Your Brand Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of companies using DoppelDown to take down brand impostors
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition"
          >
            Start Your Free 14-Day Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center text-white mb-4">
                <Shield className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold">DoppelDown</span>
              </div>
              <p className="text-sm">
                Take down brand impostors. Automated phishing & fake account detection.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} DoppelDown. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
