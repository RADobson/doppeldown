/**
 * Next.js Middleware with Helmet Security Headers
 * 
 * Provides:
 * - Content Security Policy (CSP)
 * - Strict-Transport-Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
]

function isPublicAsset(path: string): boolean {
  return publicAssetPaths.some(prefix => path.startsWith(prefix))
}

/**
 * Next.js Middleware
 * Applies security headers to all responses
 */
export function middleware(request: NextRequest): NextResponse {
  // Get the response
  const response = NextResponse.next()
  const path = request.nextUrl.pathname

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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}