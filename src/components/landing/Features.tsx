import { Search, FileText, Bell, Shield } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          What You Get
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Search,
              title: 'Find Threats',
              description: 'Scans for typosquatting, phishing sites, and fake social accounts'
            },
            {
              icon: Shield,
              title: 'AI Analysis',
              description: 'Scores threats by severity so you know what matters'
            },
            {
              icon: FileText,
              title: 'Collect Evidence',
              description: 'Screenshots, WHOIS data, and HTML archives'
            },
            {
              icon: Bell,
              title: 'Get Alerts',
              description: 'Email notifications when threats are found'
            }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
