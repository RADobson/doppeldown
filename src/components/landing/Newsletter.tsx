'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

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
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600/10 rounded-full mb-4">
          <Mail className="h-6 w-6 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-landing-foreground mb-3">
          Get Brand Protection Tips
        </h2>
        <p className="text-landing-muted mb-8 max-w-lg mx-auto">
          Practical advice on protecting your brand from phishing, typosquatting, and
          impersonation — delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 rounded-lg px-4 py-3 max-w-md mx-auto">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-landing-elevated border border-landing-border rounded-lg text-landing-foreground placeholder:text-landing-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-red-400 mt-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </section>
  )
}
