'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Mail } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'
import { gtagEvent } from '@/components/analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
        },
      })

      if (error) throw error

      // Track signup conversion
      // 1. GA4 event - tracked via GA4 and flows to Google Ads if linked
      gtagEvent('sign_up', { method: 'email' })
      
      // 2. Google Ads conversion - only fires if proper conversion label is configured
      // Format: AW-CONVERSION_ID/CONVERSION_LABEL (e.g., AW-11489904624/AbCdEfGhIjK)
      const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
      if (conversionLabel) {
        gtagEvent('conversion', {
          send_to: conversionLabel,
          value: 1.0,
          currency: 'USD',
        })
      }

      // Check if email confirmation is required
      // When Supabase has email confirmation enabled, user won't have a session yet
      if (data.user && !data.session) {
        // Email confirmation required — show confirmation UI
        setConfirmationSent(true)
      } else {
        // Auto-confirm is on or session was created immediately
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  // Show email confirmation screen
  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="flex justify-center items-center mb-8">
            <Logo mode="dark" size="lg" />
          </Link>

          <div className="bg-card py-10 px-6 shadow-sm sm:rounded-xl border border-border">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-3">
              Check your email
            </h2>
            <p className="text-muted-foreground mb-6">
              We sent a confirmation link to{' '}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link to activate your account.
            </p>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mb-6">
              <strong>Didn&apos;t get the email?</strong> Check your spam folder, or make sure you entered the correct email address.
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setConfirmationSent(false)
                setEmail('')
                setPassword('')
                setName('')
              }}
            >
              Try a different email
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Already confirmed?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center mb-8">
            <Logo mode="dark" size="lg" />
          </Link>

          <h2 className="text-3xl font-bold text-foreground">
            Start your free trial
          </h2>
          <p className="mt-2 text-muted-foreground">
            14 days free. No credit card required.
          </p>

          <form onSubmit={handleSignUp} className="mt-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
              hint="Must be at least 8 characters"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create account
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex flex-1 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h3 className="text-2xl font-bold mb-8">
            Everything you need to protect your brand
          </h3>
          <ul className="space-y-4">
            {[
              'Detect typosquatting domains in minutes',
              'Automated phishing page detection',
              'Evidence collection for legal action',
              'Professional takedown reports',
              'Real-time threat alerts',
              'Track threats through resolution'
            ].map((feature, i) => (
              <li key={i} className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-primary-200" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 bg-primary-700/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="font-semibold">Enterprise-grade at startup prices</div>
            </div>
            <p className="text-primary-100 text-sm">
              Same AI-powered detection used by Fortune 500 companies, now accessible to businesses of all sizes. Start free, upgrade when you&apos;re ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
