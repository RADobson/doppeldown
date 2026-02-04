/**
 * Next.js Middleware with Helmet Security Headers & Auth
 * 
 * Provides:
 * - Content Security Policy (CSP)
 * - Strict-Transport-Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 * - Auth protection for dashboard routes
 * - Onboarding redirect for new users
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Security header configuration
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline needed for Next.js
    "script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://accounts.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),

  // HTTP Strict Transport Security (HSTS)
  // Forces HTTPS for 2 years, includes subdomains, allows preload
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

  // X-Frame-Options - Prevents clickjacking
  'X-Frame-Options': 'DENY',

  // X-Content-Type-Options - Prevents MIME sniffing
  'X-Content-Type-Options': 'nosniff',

  // X-XSS-Protection - Legacy XSS protection (deprecated but still useful)
  'X-XSS-Protection': '1; mode=block',

  // Referrer-Policy - Controls referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions-Policy - Controls browser features
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'fullscreen=(self)',
  ].join(', '),

  // Cross-Origin policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',

  // Cache control for sensitive pages
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
}

// Public assets that should have less restrictive CSP
const publicAssetPaths = [
  '/_next/',
  '/static/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/googlea9a8923ee74d23ab.html',
]

function isPublicAsset(path: string): boolean {
  return publicAssetPaths.some(prefix => path.startsWith(prefix))
}

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/onboarding']

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/auth/login', '/auth/signup', '/auth/register']

// Routes that skip onboarding check (to avoid infinite redirects)
const skipOnboardingCheck = ['/onboarding', '/api', '/auth']

/**
 * Next.js Middleware
 * Applies security headers and handles auth/onboarding redirects
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname
  
  // Create a response to potentially modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client for auth checks on protected routes
  if (protectedRoutes.some(route => path.startsWith(route)) || 
      authRoutes.some(route => path.startsWith(route))) {
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Check for protected routes - redirect to login if not authenticated
    if (protectedRoutes.some(route => path.startsWith(route)) && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Check for auth routes - redirect to dashboard if already logged in
    if (authRoutes.some(route => path.startsWith(route)) && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check onboarding status for authenticated users going to dashboard
    if (user && path.startsWith('/dashboard') && !skipOnboardingCheck.some(route => path.startsWith(route))) {
      // Check if user needs onboarding
      const { data: onboarding } = await supabase
        .from('user_onboarding')
        .select('status')
        .eq('user_id', user.id)
        .single()

      // Redirect to onboarding if incomplete
      if (!onboarding || onboarding.status === 'incomplete') {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  // Apply security headers to all responses
  for (const [header, value] of Object.entries(securityHeaders)) {
    // For public assets, relax some headers
    if (isPublicAsset(path)) {
      if (header === 'Content-Security-Policy') {
        // Allow more permissive CSP for static assets
        response.headers.set(
          header,
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
        )
        continue
      }
      if (header === 'Cache-Control') {
        // Allow caching for public assets
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
        continue
      }
    }

    // Don't override existing cache-control headers set by Next.js for specific routes
    if (header === 'Cache-Control' && response.headers.has('Cache-Control')) {
      continue
    }

    response.headers.set(header, value)
  }

  // Add custom security headers for API routes
  if (path.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.0')
    
    // Ensure no caching for API responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.delete('Expires')
  }

  return response
}

/**
 * Middleware configuration
 * Define which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .html files (for verification)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|html)$).*)',
  ],
}