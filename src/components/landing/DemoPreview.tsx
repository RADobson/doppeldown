'use client'

import { useState } from 'react'
import { Search, AlertTriangle, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react'

export default function DemoPreview() {
  const [domain, setDomain] = useState('')
  const [threats, setThreats] = useState<Array<{
    domain: string
    risk: 'critical' | 'high' | 'medium'
    type: string
    detected: string
  }>>([])
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const simulateScan = () => {
    if (!domain.trim()) return
    setScanning(true)
    setThreats([])
    setScanned(false)

    setTimeout(() => {
      const baseDomain = domain.replace(/\.[^.]+$/, '')
      setThreats([
        { domain: `${baseDomain}-login.com`, risk: 'critical', type: 'Phishing', detected: 'Active site' },
        { domain: `${baseDomain}secure.net`, risk: 'high', type: 'Typosquat', detected: 'Domain registered' },
        { domain: `${baseDomain.replace(/o/g, '0')}.com`, risk: 'high', type: 'Homoglyph', detected: 'Active site' },
        { domain: `${baseDomain}.xyz`, risk: 'medium', type: 'TLD variant', detected: 'Domain registered' },
        { domain: `secure-${baseDomain}.org`, risk: 'medium', type: 'Typosquat', detected: 'Domain registered' },
      ])
      setScanning(false)
      setScanned(true)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      simulateScan()
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-landing-border text-landing-muted'
    }
  }

  return (
    <section id="demo" className="py-20 lg:py-28 bg-landing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            See threats before they see you
          </h2>
          <p className="text-xl text-landing-muted max-w-2xl mx-auto">
            Enter your domain to preview the threats we would detect. This is a simulation — 
            real scans check 500+ variations instantly.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-landing-elevated border border-landing-border p-6 md:p-8 shadow-2xl shadow-black/50">
            {/* Input Area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-landing-muted" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="yourbrand.com"
                  className="w-full pl-12 pr-4 py-4 bg-landing border border-landing-border rounded-xl text-landing-foreground placeholder:text-landing-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={scanning}
                />
              </div>
              <button
                onClick={simulateScan}
                disabled={scanning || !domain.trim()}
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Scan Now
                  </>
                )}
              </button>
            </div>

            {/* Results Area */}
            {scanned && threats.length > 0 && (
              <div className="border-t border-landing-border pt-6" aria-live="polite">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-landing-foreground">
                      Found {threats.length} potential threats
                    </h3>
                  </div>
                  <span className="text-sm text-landing-muted">
                    Scan completed in 2.3s
                  </span>
                </div>

                <div className="space-y-3">
                  {threats.map((threat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-landing rounded-xl border border-landing-border hover:border-landing-border/80 transition-colors"
                    >
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(threat.risk)} uppercase`}>
                        {threat.risk}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-landing-foreground truncate">
                          {threat.domain}
                        </div>
                        <div className="text-xs text-landing-muted">
                          {threat.type} • {threat.detected}
                        </div>
                      </div>
                      <button className="p-2 text-landing-muted hover:text-landing-foreground transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary-600/10 border border-primary-600/20">
                  <p className="text-sm text-primary-300">
                    <strong>This is a simulated preview.</strong> Sign up for free to run real scans 
                    against live threat intelligence databases and receive instant alerts.
                  </p>
                </div>
              </div>
            )}

            {scanned && threats.length === 0 && (
              <div className="border-t border-landing-border pt-6 text-center py-12">
                <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-landing-foreground mb-2">
                  No immediate threats detected
                </h3>
                <p className="text-landing-muted">
                  This is a demo. Real scans check 500+ domain variations and social platforms.
                </p>
              </div>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Domain Variations', 'Social Media', 'Phishing Detection', 'WHOIS Data', 'Screenshots'].map((feature, i) => (
              <span 
                key={i}
                className="px-4 py-2 rounded-full bg-landing-elevated border border-landing-border text-sm text-landing-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
