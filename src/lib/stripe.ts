import Stripe from 'stripe'
import { getTierLimits } from './tier-limits'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

// Get tier limits for plan configuration
const starterLimits = getTierLimits('starter')
const professionalLimits = getTierLimits('professional')
const enterpriseLimits = getTierLimits('enterprise')

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 4900, // $49/month
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    brandLimit: starterLimits.brands,
    scanFrequency: 'weekly' as const,
    features: [
      `${starterLimits.brands} brands to monitor`,
      'Weekly automated scans',
      `${starterLimits.variationLimit} domain variations checked`,
      `${starterLimits.socialPlatforms} social platform${starterLimits.socialPlatforms > 1 ? 's' : ''} (your choice)`,
      'Email alerts',
      'Basic reports',
      'Domain monitoring',
    ],
  },
  professional: {
    name: 'Professional',
    price: 9900, // $99/month
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    brandLimit: professionalLimits.brands,
    scanFrequency: 'daily' as const,
    features: [
      `${professionalLimits.brands} brands to monitor`,
      'Daily automated scans',
      `${professionalLimits.variationLimit} domain variations checked`,
      `${professionalLimits.socialPlatforms} social platforms (your choice)`,
      'Priority email alerts',
      'Detailed takedown reports',
      'Domain + web monitoring',
      'WHOIS tracking',
      'Evidence collection',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 24900, // $249/month
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    brandLimit: enterpriseLimits.brands === Infinity ? Number.MAX_SAFE_INTEGER : enterpriseLimits.brands,
    scanFrequency: 'continuous' as const,
    features: [
      'Unlimited brands to monitor',
      'Continuous monitoring',
      `${enterpriseLimits.variationLimit.toLocaleString()} domain variations checked`,
      'All 8 social platforms',
      'NRD (Newly Registered Domains) feed',
      'Instant alerts + webhooks',
      'Legal-ready reports',
      'Full evidence packages',
      'API access',
      'Priority support',
      'Custom integrations',
    ],
  },
}

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  plan?: PlanType
): Promise<Stripe.Checkout.Session> {
  if (!priceId) {
    throw new Error('Missing Stripe price ID for plan')
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: plan ? { plan } : undefined,
    subscription_data: plan ? { metadata: { plan } } : undefined,
  })
}

export async function createCustomer(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
  })
}

export async function getOrCreateCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string
): Promise<Stripe.Customer> {
  if (existingCustomerId) {
    try {
      return await stripe.customers.retrieve(existingCustomerId) as Stripe.Customer
    } catch {
      // Customer doesn't exist, create new one
    }
  }

  return createCustomer(email)
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId)
}

export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId)
}

export function getPlanFromPriceId(priceId: string): PlanType | null {
  for (const [plan, config] of Object.entries(PLANS)) {
    if (config.priceId === priceId) {
      return plan as PlanType
    }
  }
  return null
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}
