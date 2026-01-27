'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
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
              <a href="#" className="text-primary-600 hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
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
            <p className="text-primary-100 italic">
              "DoppelDown helped us identify and take down 15 phishing sites targeting our customers within the first week."
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded-full" />
              <div className="ml-3">
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-primary-200">Security Lead, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
