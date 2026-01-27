import { Search, FileText, Bell, CheckCircle, AlertTriangle, Globe, Lock, Shield } from 'lucide-react'

export default function Features() {
  return (
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
  )
}
