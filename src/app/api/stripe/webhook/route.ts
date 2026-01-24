import { NextRequest, NextResponse } from 'next/server'
import { getPlanFromPriceId, stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.customer && session.subscription) {
          let subscriptionTier: string | null = session.metadata?.plan || null

          if (!subscriptionTier) {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            )
            const priceId = subscription.items.data[0]?.price?.id
            subscriptionTier = priceId ? getPlanFromPriceId(priceId) : null
          }

          // Get customer email
          const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer

          // Update user subscription
          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_id: session.subscription as string,
              customer_id: session.customer as string,
              subscription_tier: subscriptionTier || 'free'
            })
            .eq('email', customer.email)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const status = subscription.status === 'active' || subscription.status === 'trialing'
          ? 'active'
          : subscription.status === 'past_due'
            ? 'past_due'
            : subscription.status === 'canceled'
              ? 'cancelled'
              : 'free'

        const priceId = subscription.items.data[0]?.price?.id
        const planFromPrice = priceId ? getPlanFromPriceId(priceId) : null

        await supabase
          .from('users')
          .update({
            subscription_status: status,
            ...(planFromPrice ? { subscription_tier: planFromPrice } : {})
          })
          .eq('subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('users')
          .update({
            subscription_status: 'cancelled',
            subscription_id: null,
            subscription_tier: 'free'
          })
          .eq('subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          await supabase
            .from('users')
            .update({ subscription_status: 'past_due' })
            .eq('subscription_id', invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
