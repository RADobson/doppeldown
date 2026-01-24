'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ResetStatus = 'loading' | 'ready' | 'error' | 'success'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<ResetStatus>('loading')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [passwords, setPasswords] = useState({ new: '', confirm: '' })

  useEffect(() => {
    let cancelled = false
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const supabase = createClient()

    const markReady = () => {
      if (cancelled || settled) return
      settled = true
      setStatus('ready')
    }

    const markError = (message: string) => {
      if (cancelled || settled) return
      settled = true
      const normalizedMessage = message.includes('PKCE code verifier not found')
        ? 'Reset link must be opened in the same browser where you requested it. Please request a new reset link and try again.'
        : message
      setError(normalizedMessage)
      setStatus('error')
    }

    const errorDescription = searchParams?.get('error_description')
    if (errorDescription) {
      markError(decodeURIComponent(errorDescription))
      return () => {
        cancelled = true
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        if (session) {
          markReady()
        }
      }
    })

    const init = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        markError(sessionError.message)
        return
      }

      if (data.session) {
        markReady()
        return
      }

      timeoutId = setTimeout(() => {
        markError('Reset link is invalid or expired. Please request a new one and open it in the same browser.')
      }, 1200)
    }

    init()

    return () => {
      cancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      authListener.subscription.unsubscribe()
    }
  }, [searchParams])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match.')
      return
    }

    if (passwords.new.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: passwords.new })
      if (error) throw error

      await supabase.auth.signOut()
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center">
          <Shield className="h-12 w-12 text-primary-600" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Set a new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a strong password to secure your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {status === 'loading' && (
            <div className="text-sm text-gray-600">Validating reset link...</div>
          )}

          {status === 'error' && (
            <div className="text-sm text-gray-600">
              <Link href="/auth/forgot-password" className="text-primary-600 hover:text-primary-500 font-medium">
                Request a new reset link
              </Link>
            </div>
          )}

          {status === 'success' && (
            <div className="text-sm text-gray-600">
              Password updated.{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </div>
          )}

          {status === 'ready' && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <Input
                label="New password"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirm new password"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" loading={saving}>
                Update password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
