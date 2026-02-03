'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceAmount: 0,
    description: 'Get started — forever free',
    features: [
      '1 brand to monitor',
      '1 manual scan per week',
      '25 domain variations checked',
      '1 social platform',
      'Basic threat alerts',
      'Community support',
      '7-day evidence storage'
    ],
    popular: false
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    priceAmount: 4900,
    description: 'For small businesses and startups',
    features: [
      '3 brands to monitor',
      'Weekly automated scans',
      '100 domain variations checked',
      '3 social platforms (your choice)',
      'Email alerts',
      'Basic takedown reports',
      '30-day evidence storage'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    priceAmount: 9900,
    description: 'For growing companies',
    features: [
      '10 brands to monitor',
      'Daily automated scans',
      '500 domain variations checked',
      '6 social platforms (your choice)',
      'Priority email alerts',
      'Detailed takedown reports',
      'WHOIS tracking',
      '90-day evidence storage',
      'API access'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$249',
    priceAmount: 24900,
    description: 'For large organizations',
    features: [
      'Unlimited brands',
      'Continuous monitoring',
      '2,500 domain variations checked',
      'All 8 social platforms',
      'NRD (Newly Registered Domains) feed',
      'Instant alerts + webhooks',
      'Legal-ready reports',
      'Full evidence packages',
      'Unlimited storage',
      'Priority support'
    ],
    popular: false
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setIsLoggedIn(true)

        // Get current subscription
        const { data: userData } = await supabase
          .from('users')
          .select('subscription_status, subscription_tier')
          .eq('id', user.id)
          .single()

        if (userData?.subscription_tier && userData.subscription_tier !== 'free') {
          setCurrentPlan(userData.subscription_tier)
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscribe(planId: string) {
    if (planId === 'free') {
      router.push('/auth/signup')
      return
    }

    if (!isLoggedIn) {
      router.push(`/auth/signup?plan=${planId}`)
      return
    }

    setSubscribing(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start checkout')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error starting checkout:', error)
      alert(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setSubscribing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-foreground">DoppelDown</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {isLoggedIn ? 'Upgrade Your Plan' : 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoggedIn
                ? 'Choose a plan to unlock more features and protect more brands'
                : 'Choose the plan that fits your needs. All plans include a 14-day free trial.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-2 sm:px-0">
            {PLANS.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id
              const isSubscribing = subscribing === plan.id

              return (
                <div
                  key={plan.id}
                  className={`relative bg-card rounded-2xl shadow-sm ${
                    plan.popular ? 'ring-2 ring-primary-600 md:scale-105' : 'border border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground mt-1">{plan.description}</p>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>

                    {isCurrentPlan ? (
                      <div className="mt-6 block w-full text-center py-3 rounded-lg font-semibold bg-green-100 text-green-700">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isSubscribing}
                        className={`mt-6 block w-full text-center py-3 rounded-lg font-semibold transition ${
                          plan.popular
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-muted text-foreground hover:bg-accent'
                        } disabled:opacity-50`}
                      >
                        {isSubscribing ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </span>
                        ) : isLoggedIn ? (
                          'Subscribe Now'
                        ) : (
                          'Start Free Trial'
                        )}
                      </button>
                    )}

                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
                },
                {
                  q: 'Can I change plans later?',
                  a: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Comparison */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
              How We Compare
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Traditional brand protection costs a fortune. DoppelDown doesn&apos;t.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'BrandShield', price: '$15K–$50K/yr', link: '/compare/brandshield' },
                { name: 'Red Points', price: '$25K–$100K/yr', link: '/compare/red-points' },
                { name: 'PhishLabs', price: '$50K–$250K/yr', link: '/compare/phishlabs' },
              ].map((comp) => (
                <Link
                  key={comp.name}
                  href={comp.link}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary-600 transition group"
                >
                  <div className="font-semibold text-foreground group-hover:text-primary-600 transition">
                    DoppelDown vs {comp.name}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    They charge {comp.price}. We start at $0.
                  </div>
                  <div className="text-xs text-primary-600 mt-2 group-hover:underline">
                    See full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dobson Development Pty Ltd. All rights reserved.</p>
          <div className="mt-2 space-x-4 text-sm">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
