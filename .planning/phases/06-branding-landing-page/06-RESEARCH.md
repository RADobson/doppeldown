# Phase 6: Branding & Landing Page - Research

**Researched:** 2026-01-27
**Domain:** Landing page conversion optimization, branding assets, favicon/OG image configuration
**Confidence:** HIGH

## Summary

This phase covers two complementary workstreams: (1) establishing a distinctive text-based brand identity with proper favicon and social sharing assets, and (2) building a conversion-optimized landing page that communicates value within 5 seconds.

The existing landing page at `/src/app/page.tsx` has all sections present but uses hardcoded colors (bg-white, text-gray-*), an icon-only logo (Shield from lucide-react), and lacks branding assets entirely (no favicon, no OG images, no public folder). The signup form already has 3 fields (name, email, password) meeting LAND-07. Key work includes creating text-based logo component, generating favicon suite, adding OG/Twitter images, refactoring landing page for performance, and adding interactive demo section per LAND-08.

**Primary recommendation:** Create a reusable Logo component with light/dark variants, generate all favicon sizes via standard tooling, use Next.js file-based metadata for OG images, and optimize landing page for sub-2s LCP through image preloading and Server Components.

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.2.35 | Framework (App Router, metadata API, Image component) | Already in stack, provides file-based favicon/OG support |
| Tailwind CSS | 3.4.17 | Styling (responsive breakpoints, typography) | Already in stack, mobile-first design system |
| lucide-react | 0.469.0 | Icons for UI elements | Already in stack |
| Inter font | - | Typography (via next/font/google) | Already configured in layout.tsx |

### Supporting (Add for This Phase)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/og | (built-in) | OG image generation with ImageResponse API | Generate dynamic social images programmatically |

### No Additional Dependencies Needed

This phase uses existing stack capabilities:
- **Favicon**: File-based metadata in `/app` directory
- **OG Images**: Static PNG files or `next/og` for dynamic generation
- **Logo**: Pure React/CSS component using existing fonts
- **Performance**: Next.js Image component, React Server Components

**No installation required** - all tools are built into Next.js 14.

## Architecture Patterns

### Recommended Project Structure

```
src/app/
  favicon.ico              # 16x16, 32x32, 48x48 multi-size ICO
  icon.svg                 # SVG for modern browsers
  apple-icon.png           # 180x180 Apple Touch Icon
  opengraph-image.png      # 1200x630 OG image
  twitter-image.png        # 1200x630 Twitter card
  layout.tsx               # Root layout with metadata
  page.tsx                 # Landing page (Server Component)

src/components/
  Logo.tsx                 # Reusable logo component with variants
  landing/                 # Landing page specific components
    Hero.tsx               # Hero section (Server Component)
    Features.tsx           # Features grid
    HowItWorks.tsx         # Process steps
    Pricing.tsx            # Pricing cards
    TrustSignals.tsx       # Testimonials, badges
    DemoPreview.tsx        # Interactive threat scan preview (Client Component)
    Cta.tsx                # Final CTA section
    Footer.tsx             # Site footer

public/
  (empty or minimal)       # Favicon files go in /app, not /public
```

### Pattern 1: Text-Based Logo Component
**What:** Single Logo component with mode prop for light/dark variants
**When to use:** All pages, nav headers, footers, auth pages
**Example:**
```typescript
// Source: Custom pattern for clean typography logos
interface LogoProps {
  mode?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ mode = 'dark', size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const colorClasses = mode === 'dark'
    ? 'text-gray-900'  // For light backgrounds
    : 'text-white'     // For dark backgrounds

  return (
    <span className={cn(
      'font-bold tracking-tight',
      sizeClasses[size],
      colorClasses,
      className
    )}>
      doppel<span className="text-primary-600">_</span>down
    </span>
  )
}
```

### Pattern 2: File-Based Favicon Configuration
**What:** Next.js auto-detects favicon files in /app directory
**When to use:** Root layout metadata
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
// Files in /app directory:
// - favicon.ico (required, 16/32/48px multi-size)
// - icon.svg (optional, modern browsers)
// - apple-icon.png (required, 180x180)

// Next.js auto-generates these meta tags:
// <link rel="icon" href="/favicon.ico" sizes="any" />
// <link rel="icon" href="/icon.svg" type="image/svg+xml" />
// <link rel="apple-touch-icon" href="/apple-icon.png" />
```

### Pattern 3: Hero Image LCP Optimization
**What:** Use loading="eager" or fetchPriority="high" for above-fold images
**When to use:** Hero images, dashboard preview image
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image'

// For hero/LCP images (deprecated: priority, use loading or fetchPriority)
<Image
  src="/dashboard-preview.png"
  alt="DoppelDown dashboard"
  width={1200}
  height={800}
  loading="eager"
  fetchPriority="high"
  className="rounded-2xl shadow-2xl"
/>
```

### Pattern 4: Mobile-First Responsive Layout
**What:** Unprefixed utilities for mobile, breakpoint prefixes for larger screens
**When to use:** All landing page components
**Example:**
```typescript
// Source: https://tailwindcss.com/docs/responsive-design
// Mobile-first: base is mobile, md: for tablet+, lg: for desktop+
<div className="
  px-4                    // Mobile: 16px padding
  sm:px-6                 // Small: 24px padding
  lg:px-8                 // Desktop: 32px padding

  grid grid-cols-1        // Mobile: single column
  md:grid-cols-2          // Tablet: 2 columns
  lg:grid-cols-4          // Desktop: 4 columns

  gap-6                   // Mobile: 24px gap
  lg:gap-8                // Desktop: 32px gap
">
```

### Anti-Patterns to Avoid
- **Hardcoded hex colors in landing page:** Use Tailwind color utilities (bg-white, text-gray-900) which will be refactored to semantic tokens in Phase 8
- **Large unoptimized images:** Always use Next.js Image component, never raw `<img>` tags
- **Client Components for static content:** Keep landing page sections as Server Components except for interactive elements
- **Barrel imports for icons:** Import specific icons (`import { Shield } from 'lucide-react'`) not barrel files
- **Relative favicon URLs:** Always use absolute paths (/favicon.ico not ./favicon.ico)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Favicon generation | Manual image editing for each size | Online favicon generator (RealFaviconGenerator, favicon.io) | Multi-size ICO files require specific tooling; browser compatibility is complex |
| OG image dimensions | Guess at sizes | Use standard 1200x630 | Social platforms expect specific dimensions; wrong sizes get cropped |
| Responsive breakpoints | Custom media queries | Tailwind breakpoints (sm, md, lg, xl) | Consistent with existing codebase, well-tested defaults |
| Image optimization | Manual compression/resizing | Next.js Image component | Automatic WebP, lazy loading, srcset generation |
| Font loading | Manual @font-face rules | next/font/google (Inter already configured) | Automatic optimization, no layout shift |

**Key insight:** Branding assets (favicons, OG images) are deceptively complex due to device/platform fragmentation. Use battle-tested generators rather than manual creation.

## Common Pitfalls

### Pitfall 1: Favicon Caching Issues
**What goes wrong:** Updated favicon doesn't appear after deployment
**Why it happens:** Browsers aggressively cache favicons; cache invalidation is notoriously difficult
**How to avoid:**
- Use cache-busting: access favicon directly (yourdomain.com/favicon.ico) to verify
- Hard refresh (Ctrl+Shift+R) during development
- Different browsers have different cache strategies
**Warning signs:** Favicon works locally but not in production

### Pitfall 2: OG Images Not Updating
**What goes wrong:** Social platforms show old/wrong preview image when sharing
**Why it happens:** Facebook, Twitter, LinkedIn cache OG images aggressively (hours to days)
**How to avoid:**
- Use absolute URLs in metadata (https://domain.com/opengraph-image.png)
- Use Facebook/Twitter debugging tools to purge cache after updates
- Test with tools: https://developers.facebook.com/tools/debug/, https://cards-dev.twitter.com/validator
**Warning signs:** OG image looks correct in code but wrong on social shares

### Pitfall 3: Hero Section LCP Failure
**What goes wrong:** Landing page fails sub-2s LCP requirement
**Why it happens:** Large hero image without preloading, or complex JavaScript blocking render
**How to avoid:**
- Use `loading="eager"` or `fetchPriority="high"` on hero image
- Keep hero section as Server Component (no 'use client')
- Minimize JavaScript in above-the-fold content
- Compress hero image to <200KB
**Warning signs:** PageSpeed Insights shows LCP >2.5s

### Pitfall 4: Mobile Responsiveness Breaks at Edge Cases
**What goes wrong:** Layout breaks on specific device widths (e.g., 320px, 375px, 414px)
**Why it happens:** Testing only at Tailwind breakpoints, not real device widths
**How to avoid:**
- Test at actual device widths: iPhone SE (375px), iPhone 14 (390px), Pixel (412px)
- Use Chrome DevTools device toolbar
- Watch for text overflow, button sizing, and touch target sizes
**Warning signs:** Works at 768px breakpoint but breaks at 767px

### Pitfall 5: Text-Based Logo Inconsistency
**What goes wrong:** Logo looks different across pages due to font loading timing
**Why it happens:** next/font not applied consistently, or different font weights in different contexts
**How to avoid:**
- Create single Logo component, use everywhere
- Ensure Inter font is applied to entire app (already done in layout.tsx)
- Use consistent font-weight (font-bold for logo text)
**Warning signs:** Logo flickers or changes weight on navigation

## Code Examples

### OG Image Static File Setup
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// File: src/app/opengraph-image.png (1200x630px)
// File: src/app/twitter-image.png (1200x630px)

// Next.js auto-generates:
// <meta property="og:image" content="https://domain.com/opengraph-image.png" />
// <meta property="og:image:width" content="1200" />
// <meta property="og:image:height" content="630" />
// <meta name="twitter:image" content="https://domain.com/twitter-image.png" />
```

### Enhanced Layout Metadata
```typescript
// Source: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
// File: src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://doppeldown.com'), // REQUIRED for OG images
  title: {
    default: 'DoppelDown - Take Down Brand Impostors',
    template: '%s | DoppelDown'
  },
  description: 'Protect your brand from phishing attacks, typosquatting, and impersonation. Automated monitoring and takedown support.',
  keywords: ['brand protection', 'phishing detection', 'typosquatting', 'domain monitoring'],
  openGraph: {
    title: 'DoppelDown - Take Down Brand Impostors',
    description: 'Detect threats. Collect evidence. Take action.',
    url: 'https://doppeldown.com',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoppelDown - Take Down Brand Impostors',
    description: 'Detect threats. Collect evidence. Take action.',
  },
}
```

### Trust Signals Component Pattern
```typescript
// Pattern for trust signals section (LAND-04)
export function TrustSignals() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security badges */}
        <div className="flex justify-center space-x-8 mb-12">
          <div className="flex items-center text-gray-500">
            <Lock className="h-5 w-5 mr-2" />
            <span className="text-sm">256-bit SSL</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm">SOC 2 Compliant</span>
          </div>
        </div>

        {/* Testimonial */}
        <blockquote className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-700 italic">
            "DoppelDown helped us identify 15 phishing sites in the first week."
          </p>
          <footer className="mt-4">
            <div className="font-semibold text-gray-900">Sarah Chen</div>
            <div className="text-sm text-gray-500">Security Lead, TechCorp</div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
```

### Interactive Demo Preview Pattern (LAND-08)
```typescript
// Client Component for interactive demo
'use client'

import { useState } from 'react'

export function DemoPreview() {
  const [domain, setDomain] = useState('')
  const [threats, setThreats] = useState<string[]>([])
  const [scanning, setScanning] = useState(false)

  const simulateScan = () => {
    if (!domain) return
    setScanning(true)

    // Simulate finding threats (no actual API call)
    setTimeout(() => {
      setThreats([
        `${domain.replace('.', '-')}login.com`,
        `${domain.replace('.', '')}.xyz`,
        `${domain.slice(0, -4)}security.com`
      ])
      setScanning(false)
    }, 1500)
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-gray-400 mb-8">Enter your domain to preview potential threats</p>

        <div className="flex gap-4 max-w-md mx-auto mb-8">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourbrand.com"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <button
            onClick={simulateScan}
            disabled={scanning}
            className="px-6 py-3 bg-primary-600 rounded-lg font-semibold"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {threats.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-4">Potential Threats Found:</h3>
            {threats.map((threat, i) => (
              <div key={i} className="flex items-center py-2 border-b border-gray-700">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                <span className="font-mono">{threat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| priority prop on Image | loading="eager" or fetchPriority="high" | Next.js 16 | priority deprecated, use alternatives |
| Manual meta tags in Head | File-based metadata (favicon.ico, opengraph-image.png) | Next.js 13+ App Router | Automatic meta tag generation |
| Multiple PNG favicon sizes | SVG + multi-size ICO + apple-icon.png (3 files) | 2024-2025 | Reduced from 16 files to 3-4 for 99.9% coverage |
| next/head for metadata | Metadata API in layout.tsx | Next.js 13+ | Cleaner, more maintainable |

**Deprecated/outdated:**
- **priority prop:** Deprecated in Next.js 16, use `loading="eager"` or `fetchPriority="high"` instead
- **Separate favicon sizes (favicon-16.png, favicon-32.png, etc.):** Bundle into single .ico file
- **next/head:** Pages Router pattern, replaced by Metadata API in App Router

## Open Questions

1. **Interactive demo data source (LAND-08)**
   - What we know: Demo should show threat preview without signup
   - What's unclear: Should it use static/fake data, or hit a public endpoint?
   - Recommendation: Use simulated/client-side data for landing page demo (no API calls needed)

2. **Social sharing image design**
   - What we know: Need 1200x630 OG image with brand identity
   - What's unclear: Exact visual design, text content
   - Recommendation: Create static PNG with "doppel_down" logo + tagline; can iterate later

3. **Trust signals content (LAND-04)**
   - What we know: Need testimonials, security badges, or client logos
   - What's unclear: Whether to use real testimonials or placeholder
   - Recommendation: Use security badges (SSL, data privacy) for launch; add real testimonials post-launch

## Sources

### Primary (HIGH confidence)
- [Next.js Favicon Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) - File conventions, supported formats
- [Next.js OG Image Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - OG/Twitter image configuration
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - priority deprecation, preload/loading options
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design) - Mobile-first breakpoints

### Secondary (MEDIUM confidence)
- [Web.dev LCP Optimization](https://web.dev/articles/optimize-lcp) - LCP thresholds and optimization strategies
- [Kleinbyte Favicon Guide 2026](https://kleinbyte.com/blog/the-ultimate-guide-to-favicon-creation-sizes-formats-and-best-practices-2026) - Modern favicon sizes

### Tertiary (LOW confidence)
- [Fibr SaaS Landing Pages 2026](https://fibr.ai/landing-page/saas-landing-pages) - Conversion rate benchmarks
- [SaaSFrame Landing Page Trends](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) - Interactive demo patterns
- [CrazyEgg Trust Signals](https://www.crazyegg.com/blog/trust-signals/) - Trust signal placement best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing Next.js/Tailwind, file-based metadata is official pattern
- Architecture: HIGH - Component structure follows Next.js conventions
- Performance (LCP): HIGH - Official Next.js docs on Image component
- Favicon/OG: HIGH - Official Next.js file conventions
- Conversion patterns: MEDIUM - Based on industry research, not verified A/B tests

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - stable patterns, no fast-moving dependencies)
