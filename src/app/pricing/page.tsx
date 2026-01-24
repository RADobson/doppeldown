'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    priceAmount: 4900,
    description: 'For small businesses and startups',
    features: [
      '1 brand to monitor',
      'Weekly automated scans',
      'Email alerts',
      'Basic takedown reports',
      'Domain monitoring',
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
      '3 brands to monitor',
      'Daily automated scans',
      'Priority email alerts',
      'Detailed takedown reports',
      'Domain + web monitoring',
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
      '10 brands to monitor',
      'Continuous monitoring',
      'Instant alerts + webhooks',
      'Legal-ready reports',
      'Full evidence packages',
      'Unlimited storage',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager'
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">DoppelDown</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {isLoggedIn ? 'Upgrade Your Plan' : 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isLoggedIn
                ? 'Choose a plan to unlock more features and protect more brands'
                : 'Choose the plan that fits your needs. All plans include a 14-day free trial.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id
              const isSubscribing = subscribing === plan.id

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-sm ${
                    plan.popular ? 'ring-2 ring-primary-600 scale-105' : 'border border-gray-200'
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
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 mt-1">{plan.description}</p>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">/month</span>
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
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
                          <span className="text-gray-600">{feature}</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
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
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DoppelDown. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
