import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS, createCheckoutSession, getOrCreateCustomer, type PlanType } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS]
    if (!selectedPlan.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 400 }
      )
    }

    // Get user's customer ID if exists
    const { data: userData } = await supabase
      .from('users')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      user.id,
      user.email!,
      userData?.customer_id
    )

    // Save customer ID if new
    if (!userData?.customer_id) {
      await supabase
        .from('users')
        .update({ customer_id: customer.id })
        .eq('id', user.id)
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      selectedPlan.priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?cancelled=true`,
      plan as PlanType
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
