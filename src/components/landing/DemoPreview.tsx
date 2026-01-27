'use client'

import { useState } from 'react'

export default function DemoPreview() {
  const [domain, setDomain] = useState('')
  const [threats, setThreats] = useState<string[]>([])
  const [scanning, setScanning] = useState(false)

  const simulateScan = () => {
    if (!domain.trim()) return
    setScanning(true)
    setThreats([])

    // Simulate scanning delay
    setTimeout(() => {
      // Generate fake threats based on input domain
      const baseDomain = domain.replace(/\.[^.]+$/, '') // Remove TLD
      setThreats([
        `${baseDomain}-login.com`,
        `${baseDomain}secure.net`,
        `${baseDomain.replace(/o/g, '0')}.com`, // Homoglyph
        `${baseDomain}.xyz`,
      ])
      setScanning(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      simulateScan()
    }
  }

  return (
    <section className="py-16 bg-landing text-landing-foreground">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-landing-muted mb-8">
          Enter your domain to preview potential threats
        </p>

        <div className="flex gap-4 max-w-md mx-auto mb-8">
          <label htmlFor="demo-domain-input" className="sr-only">
            Domain name
          </label>
          <input
            id="demo-domain-input"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="yourbrand.com"
            className="flex-1 px-4 py-3 rounded-lg bg-landing-elevated border border-landing-border text-landing-foreground placeholder-landing-muted focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            disabled={scanning}
          />
          <button
            onClick={simulateScan}
            disabled={scanning || !domain.trim()}
            className="px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-white"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {threats.length > 0 && (
          <div
            className="bg-landing-elevated rounded-lg p-6 max-w-2xl mx-auto text-left"
            aria-live="polite"
          >
            <h3 className="text-lg font-semibold mb-4">
              Found {threats.length} potential threats
            </h3>
            <div className="space-y-3">
              {threats.map((threat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-landing rounded-lg"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="font-mono text-sm flex-1">{threat}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      index % 2 === 0
                        ? 'bg-red-900 text-red-200'
                        : 'bg-orange-900 text-orange-200'
                    }`}
                  >
                    {index % 2 === 0 ? 'Critical' : 'High'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-landing-muted mt-4">
              This is a simulated preview. Sign up for real-time monitoring.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
