'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSent(false)

    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/callback?type=recovery&next=/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center">
          <Logo mode="dark" size="lg" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-border">
          <form onSubmit={handleReset} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {sent && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                If an account exists for that email, a reset link has been sent.
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />

            <Button type="submit" className="w-full" loading={loading}>
              Send reset link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
