import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Starter',
              price: '$49',
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
              name: 'Professional',
              price: '$99',
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
              name: 'Enterprise',
              price: '$249',
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
          ].map((plan, i) => (
            <div
              key={i}
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
                <Link
                  href="/auth/signup"
                  className={`mt-6 block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Start Free Trial
                </Link>
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
          ))}
        </div>
      </div>
    </section>
  )
}
