import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    // Create Stripe billing portal session
    const session = await createPortalSession(
      userData.customer_id,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
