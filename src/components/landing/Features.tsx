import { Search, FileText, Bell, Shield, Globe, Brain } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="py-16 bg-landing-elevated">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-landing-foreground text-center mb-3">
          Everything You Need to Protect Your Brand
        </h2>
        <p className="text-landing-muted text-center mb-12 max-w-2xl mx-auto">
          Enterprise-grade brand protection without the enterprise price tag
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: 'Domain Monitoring',
              description: 'Detect 500+ typosquatting variations including homoglyphs, typos, and TLD swaps before attackers use them'
            },
            {
              icon: Brain,
              title: 'AI Threat Scoring',
              description: 'Machine learning separates real threats from noise — no more drowning in false positives'
            },
            {
              icon: Globe,
              title: 'Social Media Scanning',
              description: 'Find fake accounts impersonating your brand across Facebook, Instagram, X, LinkedIn, and more'
            },
            {
              icon: FileText,
              title: 'Evidence Collection',
              description: 'Automated screenshots, WHOIS records, and HTML archives — ready for takedown requests'
            },
            {
              icon: Bell,
              title: 'Real-Time Alerts',
              description: 'Email notifications the moment new threats are detected, with severity-based filtering'
            },
            {
              icon: Shield,
              title: 'Takedown Reports',
              description: 'Generate professional reports for domain registrars and platform abuse teams'
            }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-landing/50 rounded-xl">
              <div className="w-10 h-10 bg-landing-border rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-landing-foreground mb-1">{feature.title}</h3>
                <p className="text-landing-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
