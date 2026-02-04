/**
 * Auth Callback Route Handler
 * 
 * Handles Supabase auth callbacks including:
 * - Email confirmation after signup
 * - Password reset links
 * - Magic link login
 * - OAuth provider callbacks
 * 
 * Supabase redirects users here with a code that gets exchanged for a session.
 * Without this route, email confirmation links lead to 404 errors.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const type = requestUrl.searchParams.get('type') // signup, recovery, magiclink, etc.

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Determine redirect based on callback type
      let redirectTo = next

      if (type === 'recovery') {
        // Password reset flow — send to reset password page
        redirectTo = '/auth/reset-password'
      } else if (type === 'signup') {
        // Email confirmed — send to onboarding or dashboard
        redirectTo = '/onboarding'
      }

      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    }
  }

  // If code exchange fails, redirect to login with error
  const errorUrl = new URL('/auth/login', requestUrl.origin)
  errorUrl.searchParams.set('error', 'auth_callback_failed')
  errorUrl.searchParams.set('error_description', 'Could not verify your email. Please try again or request a new link.')
  return NextResponse.redirect(errorUrl)
}
