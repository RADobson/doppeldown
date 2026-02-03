import { Search, FileText, Bell, Shield, Globe, Brain, Target, Lock, Eye } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Search,
      title: 'Domain Monitoring',
      description: 'Detect 500+ typosquatting variations including homoglyphs, typos, and TLD swaps before attackers use them against your customers.',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: Brain,
      title: 'AI Threat Scoring',
      description: 'Machine learning separates real threats from noise — no more drowning in false positives. Focus on what actually matters.',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: Globe,
      title: 'Social Media Scanning',
      description: 'Find fake accounts impersonating your brand across Facebook, Instagram, X, LinkedIn, and more. Real-time monitoring 24/7.',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      icon: FileText,
      title: 'Evidence Collection',
      description: 'Automated screenshots, WHOIS records, and HTML archives — everything you need for takedown requests, ready in seconds.',
      color: 'from-orange-500/20 to-amber-500/20'
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Instant notifications the moment new threats are detected. Severity-based filtering ensures you only get alerts that matter.',
      color: 'from-red-500/20 to-rose-500/20'
    },
    {
      icon: Shield,
      title: 'Takedown Reports',
      description: 'Generate professional reports for domain registrars and platform abuse teams. Proven templates that get results faster.',
      color: 'from-primary-500/20 to-blue-500/20'
    }
  ]

  const platformTabs = [
    {
      icon: Target,
      title: 'Brand Protection',
      description: 'Comprehensive monitoring of domains, websites, and digital assets impersonating your brand.',
      features: ['Typosquat detection', 'Phishing site identification', 'Logo misuse tracking']
    },
    {
      icon: Lock,
      title: 'Executive Protection',
      description: 'Monitor for impersonation of key personnel across social media and professional networks.',
      features: ['Social media monitoring', 'Deep web scanning', 'Impersonation alerts']
    },
    {
      icon: Eye,
      title: 'Threat Intelligence',
      description: 'AI-powered analysis of threat patterns and emerging attack vectors targeting your industry.',
      features: ['Threat scoring', 'Trend analysis', 'Risk forecasting']
    }
  ]

  return (
    <section id="features" className="py-20 lg:py-28 bg-landing-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            Platform
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-landing-foreground mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              protect your brand
            </span>
          </h2>
          <p className="text-xl text-landing-muted max-w-3xl mx-auto">
            Enterprise-grade brand protection without the enterprise price tag or complexity.
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {platformTabs.map((tab, i) => (
            <div 
              key={i}
              className="group relative p-6 rounded-2xl bg-landing border border-landing-border hover:border-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-600/5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">
                <tab.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-landing-foreground mb-2">
                {tab.title}
              </h3>
              <p className="text-landing-muted text-sm mb-4">
                {tab.description}
              </p>
              <ul className="space-y-2">
                {tab.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-landing-muted">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group relative p-6 rounded-2xl bg-landing border border-landing-border hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-landing-elevated border border-landing-border flex items-center justify-center mb-4 group-hover:border-primary-500/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="font-semibold text-landing-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-landing-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
