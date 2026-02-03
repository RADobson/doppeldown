/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['localhost'],
  },
  
  // Security headers configuration (supplemented by middleware.ts)
  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
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
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(self), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), fullscreen=(self)',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
      {
        key: 'Cross-Origin-Resource-Policy',
        value: 'same-origin',
      },
    ]

    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // API route caching headers (override Cache-Control)
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
        ],
      },
      {
        // Static assets - cache for 1 year with immutable flag
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public assets - cache for 1 hour with stale-while-revalidate
        source: '/:path*.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
  
  // Build-time environment variables
  env: {
    // Cache configuration defaults
    CACHE_DEFAULT_TTL: process.env.CACHE_DEFAULT_TTL || '300',
    CACHE_KEY_PREFIX: process.env.CACHE_KEY_PREFIX || 'doppeldown:',
    CACHE_MAX_MEMORY_ENTRIES: process.env.CACHE_MAX_MEMORY_ENTRIES || '10000',
    CACHE_DEBUG: process.env.CACHE_DEBUG || 'false',
  },
}

module.exports = nextConfig
