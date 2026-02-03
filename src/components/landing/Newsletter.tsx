'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage("You're in! We'll send you brand protection tips and product updates.")
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-landing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4 text-primary-200" />
                <span className="text-primary-100 text-sm font-medium">Brand Protection Weekly</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get brand protection tips delivered to your inbox
              </h2>
              
              <p className="text-primary-100 text-lg">
                Practical advice on protecting your brand from phishing, typosquatting, and 
                impersonation. No spam, unsubscribe anytime.
              </p>
            </div>

            {/* Right Content - Form */}
            <div>
              {status === 'success' ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">You're subscribed!</h3>
                  <p className="text-primary-100 text-sm">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-landing-muted" />
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white text-landing-foreground rounded-xl placeholder:text-landing-muted/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-landing text-white rounded-xl font-semibold hover:bg-landing-elevated transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      'Subscribing...'
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-200 bg-red-500/20 rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">{message}</p>
                    </div>
                  )}
                </form>
              )}

              <p className="text-primary-200 text-sm mt-4 text-center">
                Join 2,000+ security professionals getting weekly insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
