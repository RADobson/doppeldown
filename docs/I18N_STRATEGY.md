# DoppelDown Internationalization & Localization Strategy

## Comprehensive Implementation Plan for Global Expansion

**Version**: 2.0  
**Date**: February 5, 2026  
**Status**: Strategy Complete — Implementation Pending  
**Supersedes**: `docs/LOCALIZATION_STRATEGY.md` (retained as reference)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Architecture Decision: Custom vs next-intl](#3-architecture-decision)
4. [Target Markets & Locale Strategy](#4-target-markets--locale-strategy)
5. [Technical Infrastructure](#5-technical-infrastructure)
6. [Content Classification & Localization Approach](#6-content-classification--localization-approach)
7. [Translation Management](#7-translation-management)
8. [SEO & Discoverability](#8-seo--discoverability)
9. [Implementation Phases](#9-implementation-phases)
10. [Locale Detection & Routing](#10-locale-detection--routing)
11. [UI/UX Considerations](#11-uiux-considerations)
12. [Legal & Compliance](#12-legal--compliance)
13. [Email & Notification Localization](#13-email--notification-localization)
14. [API Localization](#14-api-localization)
15. [Testing Strategy](#15-testing-strategy)
16. [Performance Budget](#16-performance-budget)
17. [Future Expansion Roadmap](#17-future-expansion-roadmap)
18. [Risk Assessment](#18-risk-assessment)
19. [Success Metrics](#19-success-metrics)

---

## 1. Executive Summary

DoppelDown has a complete but **unintegrated** i18n infrastructure. Translation files exist for English, Spanish (LATAM), and Portuguese (Brazil). The detection, context, middleware, and LanguageSelector components are built. However, **zero application components currently consume translations** — all 273 source files use hardcoded English strings.

This strategy provides the roadmap to:
- Integrate the existing i18n infrastructure into the live application
- Convert ~150+ components from hardcoded strings to translated keys
- Establish SEO-optimized localized URL routing
- Set up a scalable translation management workflow
- Define a phased expansion path to additional languages

**Estimated effort**: ~6–8 weeks for Phases 1–3 (core integration), ~3–4 additional weeks for Phases 4–5 (SEO, blog, email, testing hardening).

---

## 2. Current State Assessment

### What Exists (✅ Built, Not Wired)

| Component | Location | Status |
|-----------|----------|--------|
| i18n Config | `src/lib/i18n/config.ts` | ✅ Complete — locales, currencies, date formats, RTL prep |
| Type Definitions | `src/lib/i18n/types.ts` | ✅ Complete — `TranslationMessages` interface covering all sections |
| Translation Engine | `src/lib/i18n/translate.ts` | ✅ Complete — interpolation, fallback chain, formatting |
| Locale Detection | `src/lib/i18n/detection.ts` | ✅ Complete — URL, cookie, Accept-Language, fallback |
| React Context | `src/lib/i18n/context.tsx` | ✅ Complete — `I18nProvider`, `useI18n`, `useTranslation`, `useFormatting` |
| Middleware | `src/lib/i18n/middleware.ts` | ✅ Complete — redirect logic, Content-Language header |
| English Translations | `src/lib/i18n/translations/en.ts` | ✅ Complete — all sections |
| Spanish Translations | `src/lib/i18n/translations/es.ts` | ✅ Complete — all sections |
| Portuguese Translations | `src/lib/i18n/translations/pt.ts` | ✅ Complete — all sections |
| Language Selector | `src/components/LanguageSelector.tsx` | ✅ Complete — dropdown + inline variants |

### What's Missing (❌ Not Integrated)

| Gap | Impact |
|-----|--------|
| `layout.tsx` does not wrap app in `I18nProvider` | No component can access translations |
| `middleware.ts` does not call `i18nMiddleware()` | No locale detection/routing happens |
| `html lang` attribute is hardcoded to `"en"` | Accessibility & SEO broken for non-English |
| No `[locale]` route segment in App Router | No URL-based locale switching (`/es/`, `/pt/`) |
| All ~150 UI components have hardcoded English | UI remains English-only |
| No hreflang tags in `<head>` | SEO signal for language variants absent |
| Sitemap is English-only | Google won't index localized pages |
| Blog posts (17) are English-only with no localization plan | Largest content mass has no i18n story |
| Email templates use hardcoded English | Non-English users get English emails |
| OpenGraph/Twitter metadata is English-only | Social sharing shows English regardless |
| No localized legal pages (Privacy, Terms) | Compliance gap for non-English markets |

### Codebase Scale

| Category | Count | Localization Complexity |
|----------|-------|------------------------|
| Landing components | 12 files, ~1,636 LOC | Medium — marketing copy heavy |
| Dashboard pages | 10 files | Medium — UI labels + dynamic data |
| Auth pages | 4 files | Low — form labels, errors |
| Blog posts | 17 files | **High** — long-form content, SEO-critical |
| Industry pages | 7 files | High — marketing copy, SEO |
| Comparison pages | 6 files | High — marketing copy, SEO |
| API routes | 35 files | Low — error messages only |
| Shared components | ~40 files | Medium — UI labels, aria-labels |
| Onboarding components | 8 files | Medium — wizard text, tooltips |
| Email templates | 4 templates | Medium — full-body copy |
| Legal pages | 2 files | **High** — must be legally reviewed |

---

## 3. Architecture Decision

### Recommendation: Keep Custom i18n System (Do Not Adopt next-intl)

There's an alternative `radobson-i18n` implementation suggesting `next-intl`. After analysis:

**Why keep the custom system:**

1. **Already built and comprehensive** — The custom system in `src/lib/i18n/` covers everything `next-intl` provides: detection, routing, context, formatting, interpolation, pluralization.

2. **No new dependency** — `next-intl` adds a dependency + plugin requirement in `next.config.js`. The custom system is zero-dependency.

3. **Full control** — Custom pluralization rules, domain-specific formatting (threat severity labels, scan status), and Supabase-aware email localization are easier with a system we own.

4. **No App Router restructure required** — `next-intl` requires restructuring all routes under `app/[locale]/`. The custom system can work with the current flat route structure using middleware rewrites instead of physical route segments.

5. **Type safety already achieved** — `TranslationMessages` interface provides compile-time checking for all translation keys.

**Key architectural decision for URL routing:**

Instead of restructuring the entire `app/` directory to `app/[locale]/`, we will use **middleware-based locale rewriting**:

```
User visits: /es/pricing
Middleware detects: locale = "es"
Internally rewrites to: /pricing (same physical page)
Page reads locale from: cookie/header set by middleware
```

This avoids duplicating every page component under `[locale]` segments while still supporting localized URLs for SEO.

---

## 4. Target Markets & Locale Strategy

### Phase 1 Markets (Launch)

| Locale | Market | Rationale | Currency |
|--------|--------|-----------|----------|
| `en` | US, UK, AU, CA | Primary market, 60% of target SMBs | USD |
| `es` | Mexico, Colombia, Argentina, Chile | 500M+ Spanish speakers, growing cybersecurity awareness in LATAM | USD |
| `pt-BR` | Brazil | Largest LATAM economy, high digital brand abuse rates | USD |

### Phase 2 Markets (6–12 months post-launch)

| Locale | Market | Rationale |
|--------|--------|-----------|
| `fr` | France, Canada (Quebec), Francophone Africa | Large enterprise market |
| `de` | Germany, Austria, Switzerland (DACH) | Strong data protection culture (GDPR-native) |
| `ja` | Japan | High cybersecurity spending per capita |

### Phase 3 Markets (12–24 months)

| Locale | Market | Rationale |
|--------|--------|-----------|
| `ko` | South Korea | Aggressive digital economy |
| `ar` | MENA region | First RTL language — validates RTL infrastructure |
| `zh-Hans` | China (Simplified) | Requires separate deployment (GFW considerations) |

### Locale Configuration

```typescript
// Current config.ts supports:
locales: ['en', 'es', 'pt']  // Phase 1

// Phase 2 expansion:
locales: ['en', 'es', 'pt', 'fr', 'de', 'ja']

// Phase 3:
locales: ['en', 'es', 'pt', 'fr', 'de', 'ja', 'ko', 'ar', 'zh-Hans']
```

### Pricing Localization Strategy

All pricing displays in USD for Phase 1 (standardized global pricing). Phase 2 introduces purchasing power parity adjustments:

| Market | USD Price | Localized | Rationale |
|--------|-----------|-----------|-----------|
| US/UK/AU | $29/mo | $29/mo | Base pricing |
| LATAM (es) | $29/mo | $19/mo | ~35% PPP adjustment |
| Brazil (pt) | $29/mo | $19/mo | ~35% PPP adjustment |
| DACH (de) | $29/mo | €29/mo | Near parity |
| Japan (ja) | $29/mo | ¥3,900/mo | Near parity |

---

## 5. Technical Infrastructure

### 5.1 Middleware-Based Locale Routing

Instead of `app/[locale]/` restructuring, we extend the existing `middleware.ts`:

```typescript
// src/middleware.ts — enhanced
import { i18nMiddleware } from '@/lib/i18n/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // === I18N ROUTING (NEW) ===
  // Run i18n middleware first for locale detection + rewriting
  const i18nResponse = i18nMiddleware(request)
  if (i18nResponse) {
    // Apply security headers to redirect responses
    applySecurityHeaders(i18nResponse, path)
    return i18nResponse
  }

  // === EXISTING AUTH + SECURITY LOGIC ===
  let response = NextResponse.next({ request: { headers: request.headers } })
  
  // ... existing auth/onboarding checks ...
  // ... existing security headers ...
  
  // Set Content-Language header from detected locale
  const locale = getRequestLocale(request)
  response.headers.set('Content-Language', locale)
  
  return response
}
```

### 5.2 Layout Integration

```typescript
// src/app/layout.tsx — enhanced
import { I18nProvider, detectLanguage, type Locale } from '@/lib/i18n'
import { cookies, headers } from 'next/headers'

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  const headersList = headers()
  
  const { locale } = detectLanguage({
    cookies: cookieStore.toString(),
    acceptLanguage: headersList.get('accept-language'),
  })

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* Dynamic hreflang tags */}
        <HreflangTags />
      </head>
      <body className={inter.className}>
        <I18nProvider locale={locale}>
          {/* ... existing providers ... */}
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
```

### 5.3 Component Translation Pattern

Three patterns depending on component type:

**Pattern A: Client Components (most UI components)**
```tsx
'use client'
import { useI18n } from '@/lib/i18n'

export default function Hero() {
  const { t } = useI18n()
  return <h1>{t('landing.hero.headline')}</h1>
}
```

**Pattern B: Server Components (pages with metadata)**
```tsx
import { translate, type Locale } from '@/lib/i18n'
import { cookies, headers } from 'next/headers'

export async function generateMetadata() {
  const locale = getServerLocale() // helper using cookies/headers
  return {
    title: translate(locale, 'landing.hero.headline'),
    alternates: { languages: getLocalizedUrls('/pricing', BASE_URL) },
  }
}
```

**Pattern C: API Routes (error messages)**
```tsx
import { getRequestLocale } from '@/lib/i18n/middleware'

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request)
  // Use locale for error messages in response
  return NextResponse.json({ 
    error: translate(locale, 'errors.unauthorized.message') 
  }, { status: 401 })
}
```

### 5.4 New Files Required

| File | Purpose |
|------|---------|
| `src/lib/i18n/server.ts` | Server-side helpers (getServerLocale, etc.) |
| `src/components/seo/HreflangTags.tsx` | Dynamic hreflang tag generation |
| `src/lib/i18n/translations/fr.ts` | French translations (Phase 2) |
| `src/lib/i18n/translations/de.ts` | German translations (Phase 2) |
| `src/lib/i18n/translations/ja.ts` | Japanese translations (Phase 2) |

---

## 6. Content Classification & Localization Approach

### Tier 1: UI Strings (Translate — Already Done)
**Coverage**: Navigation, buttons, form labels, error messages, dashboard labels  
**Approach**: Translation keys via `t()` function  
**Status**: ✅ Translations written, ❌ components not wired  
**Effort**: ~3 days to wire all components

### Tier 2: Marketing Copy (Translate — Already Done)  
**Coverage**: Landing page hero, features, how-it-works, pricing, FAQ, CTA  
**Approach**: Translation keys via `t()` function  
**Status**: ✅ Translations written, ❌ components not wired  
**Effort**: ~2 days to wire all landing components

### Tier 3: Legal Content (Translate — Requires Legal Review)
**Coverage**: Privacy Policy, Terms of Service  
**Approach**: Separate localized page components per locale  
**Status**: ❌ Not started  
**Effort**: ~1 week (translation + legal review per locale)  
**Strategy**: Professional translation required — NOT machine translation. Legal content must be reviewed by a local attorney for each target market.

### Tier 4: Blog Content (Phased Localization)
**Coverage**: 17 blog posts, ~40,000+ words total  
**Approach**: **Do NOT translate all blog posts.** Instead:

1. **Phase 1**: Translate only the 5 highest-traffic posts into es/pt
2. **Phase 2**: Create locale-specific blog content (not translations, but original content addressing local market concerns)
3. **Phase 3**: Use AI-assisted translation for remaining posts with human review

**Priority blog posts for localization** (based on SEO keyword value):
1. `what-is-typosquatting-complete-guide-2026`
2. `phishing-attack-statistics-2026-what-smbs-need-to-know`
3. `brand-protection-for-small-business-practical-guide`
4. `how-to-protect-your-brand-from-domain-squatting-and-phishing-2026`
5. `brand-impersonation-statistics-case-studies-2026`

**Blog localization architecture:**
```
src/content/
├── blog/
│   ├── en/
│   │   ├── what-is-typosquatting.mdx
│   │   └── ...
│   ├── es/
│   │   ├── que-es-typosquatting.mdx    (translated)
│   │   └── ...
│   └── pt/
│       ├── o-que-e-typosquatting.mdx   (translated)
│       └── ...
```

### Tier 5: Industry & Comparison Pages (Translate — Phase 2)
**Coverage**: 7 industry pages, 6 comparison pages  
**Approach**: Marketing-quality human translation  
**Status**: ❌ Not started  
**Effort**: ~2 weeks per locale  
**Note**: These are SEO-critical pages. Translations must include localized keyword research — direct translation of SEO content rarely ranks well.

### Tier 6: Generated Content (Auto-Localized)
**Coverage**: Takedown reports (PDF), threat alerts, weekly digests  
**Approach**: Template-based using translation keys + dynamic data  
**Status**: Translation keys exist, template integration pending  
**Effort**: ~1 week

### Tier 7: User-Generated Content (Not Translated)
**Coverage**: Brand names, domain names, threat URLs, user notes  
**Approach**: Displayed as-is regardless of locale  
**Note**: Technical data (URLs, WHOIS records, DNS records) is inherently language-neutral.

---

## 7. Translation Management

### 7.1 Current Workflow (Acceptable for 3 Locales)

With only en/es/pt, the TypeScript-based translation files work well:

1. Developer adds a new key to `types.ts`
2. TypeScript compiler flags missing keys in `es.ts` and `pt.ts`
3. Developer/translator adds the translations
4. PR review catches quality issues

### 7.2 Scale Workflow (5+ Locales — Phase 2)

When expanding to 5+ locales, adopt a Translation Management System (TMS):

**Recommended: Crowdin**

| Feature | Why It Matters |
|---------|----------------|
| Git integration | Syncs translation files directly to repo |
| In-context editing | Translators see text in the actual UI |
| Machine translation pre-fill | Speeds up initial drafts (Google Translate + DeepL) |
| Translation memory | Reuses translations across similar strings |
| Quality assurance | Catches formatting errors, untranslated strings |
| Glossary | Enforces consistent cybersecurity terminology |
| Cost | Free for open-source, $40/mo for teams |

**Workflow with Crowdin:**

```
Developer → adds English string → pushes to main branch
                                       ↓
                              Crowdin detects new string
                                       ↓
                              Pre-fills with machine translation
                                       ↓
                              Human translator reviews/edits
                                       ↓
                              Crowdin pushes translated file via PR
                                       ↓
                              Developer reviews + merges
```

### 7.3 Translation Quality Gates

| Gate | Tool | Timing |
|------|------|--------|
| **Missing key detection** | TypeScript compiler | Build time |
| **String length validation** | Custom ESLint rule | PR review |
| **Placeholder consistency** | Crowdin QA checks | Translation time |
| **Visual regression** | Playwright screenshots | CI pipeline |
| **Native speaker review** | Manual review | Before release |

### 7.4 Domain Glossary

Maintain a glossary of cybersecurity terms to ensure consistency:

| English | Spanish (LATAM) | Portuguese (BR) | Notes |
|---------|-----------------|------------------|-------|
| Phishing | Phishing | Phishing | Keep English — universally understood |
| Typosquatting | Typosquatting | Typosquatting | Keep English — technical term |
| Takedown | Eliminación | Remoção | Localize — users need to understand the action |
| Threat | Amenaza | Ameaça | Localize |
| Brand protection | Protección de marca | Proteção de marca | Localize |
| Scan | Escaneo | Varredura | Localize |
| False positive | Falso positivo | Falso positivo | Cognate — works in all |
| WHOIS | WHOIS | WHOIS | Technical — keep English |
| DNS | DNS | DNS | Technical — keep English |
| SSL/TLS | SSL/TLS | SSL/TLS | Technical — keep English |
| Dashboard | Panel | Painel | Localize |
| API Key | Clave de API | Chave de API | Partial localize |

---

## 8. SEO & Discoverability

### 8.1 URL Structure

```
English (default):  https://doppeldown.com/pricing
Spanish:            https://doppeldown.com/es/pricing
Portuguese:         https://doppeldown.com/pt/pricing

Blog (English):     https://doppeldown.com/blog/what-is-typosquatting-complete-guide-2026
Blog (Spanish):     https://doppeldown.com/es/blog/que-es-typosquatting-guia-completa-2026
Blog (Portuguese):  https://doppeldown.com/pt/blog/o-que-e-typosquatting-guia-completa-2026
```

**Key decisions:**
- Default locale (`en`) has NO prefix → cleaner URLs, no redirect for majority traffic
- Subpath routing (not subdomain, not ccTLD) → simplest to manage, shares domain authority
- Blog slugs are localized (not just prefixed) → better SEO in target language

### 8.2 Hreflang Implementation

Create `src/components/seo/HreflangTags.tsx`:

```tsx
import { locales, defaultLocale, HIDE_DEFAULT_LOCALE } from '@/lib/i18n'

export function HreflangTags({ pathname }: { pathname: string }) {
  const baseUrl = 'https://doppeldown.com'
  const cleanPath = removeLocaleFromPath(pathname)
  
  return (
    <>
      {locales.map(locale => {
        const href = locale === defaultLocale && HIDE_DEFAULT_LOCALE
          ? `${baseUrl}${cleanPath}`
          : `${baseUrl}/${locale}${cleanPath}`
        return <link key={locale} rel="alternate" hreflang={locale} href={href} />
      })}
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}${cleanPath}`} />
    </>
  )
}
```

### 8.3 Localized Sitemap

Update `src/app/sitemap.ts` to generate entries for all locales:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseEntries = generateNextSitemap() // existing
  const allEntries: MetadataRoute.Sitemap = []
  
  for (const entry of baseEntries) {
    // Add the base (English) entry
    allEntries.push({
      ...entry,
      alternates: {
        languages: {
          en: entry.url,
          es: entry.url.replace('https://doppeldown.com', 'https://doppeldown.com/es'),
          pt: entry.url.replace('https://doppeldown.com', 'https://doppeldown.com/pt'),
        },
      },
    })
  }
  
  return allEntries
}
```

### 8.4 Localized Metadata Per Page

Each page should generate locale-aware metadata:

```typescript
// src/lib/i18n/server.ts
export function getServerLocale(): Locale {
  const cookieStore = cookies()
  const headersList = headers()
  const { locale } = detectLanguage({
    cookies: cookieStore.toString(),
    acceptLanguage: headersList.get('accept-language'),
  })
  return locale
}

// In any page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const locale = getServerLocale()
  const t = createTranslator(locale)
  
  return {
    title: t('landing.hero.headline'),
    description: t('landing.hero.subheadline'),
    openGraph: {
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_MX' : 'pt_BR',
    },
    alternates: {
      languages: getLocalizedUrls('/', 'https://doppeldown.com'),
    },
  }
}
```

### 8.5 Google Search Console

- Register property for `doppeldown.com` (already done)
- Set up international targeting for `/es/` → Spanish, `/pt/` → Portuguese
- Submit localized sitemaps
- Monitor hreflang errors in the International Targeting report

---

## 9. Implementation Phases

### Phase 1: Core Integration (Week 1–2)
**Goal**: Wire the existing i18n system into the live app. English-only users see zero change.

| Task | File(s) | Effort |
|------|---------|--------|
| Create `src/lib/i18n/server.ts` with `getServerLocale()` helper | New file | 2h |
| Update `layout.tsx` — wrap in `I18nProvider`, dynamic `lang` attr | `src/app/layout.tsx` | 2h |
| Update `middleware.ts` — integrate `i18nMiddleware()` | `src/middleware.ts` | 4h |
| Add HreflangTags component | `src/components/seo/HreflangTags.tsx` | 2h |
| Wire LanguageSelector into Hero nav + Footer | `Hero.tsx`, `Footer.tsx` | 2h |
| Convert landing components to use `t()` | 12 files in `components/landing/` | 8h |
| Convert auth pages to use `t()` | 4 files in `app/auth/` | 4h |
| Convert error pages to use `t()` | `error.tsx`, `not-found.tsx` | 1h |
| Smoke test all 3 locales | Manual | 4h |

**Milestone**: Switching locale via LanguageSelector renders the landing page + auth in es/pt.

### Phase 2: Dashboard & App Chrome (Week 3–4)
**Goal**: All logged-in UI is localized.

| Task | File(s) | Effort |
|------|---------|--------|
| Convert dashboard layout + nav | `dashboard/layout.tsx` + components | 4h |
| Convert dashboard pages (overview, brands, threats, reports, settings) | 10 page files | 12h |
| Convert onboarding wizard | 8 files in `components/onboarding/` | 6h |
| Convert shared UI components (badge, button labels, empty states) | ~15 files in `components/ui/` | 6h |
| Convert notification dropdown | `NotificationDropdown.tsx` | 2h |
| Localize date/number formatting throughout dashboard | Various | 4h |
| Add locale to user settings (persist to DB) | `settings/page.tsx`, API | 4h |

**Milestone**: Full app UI works in en/es/pt. Dashboard, threats, brands, reports all localized.

### Phase 3: SEO & Metadata (Week 5)
**Goal**: Search engines correctly index localized versions.

| Task | Effort |
|------|--------|
| Update `sitemap.ts` to include all locale variants | 4h |
| Add `generateMetadata` with locale-aware titles/descriptions to all pages | 8h |
| Set up localized `robots.ts` (same rules, but confirms locale paths) | 1h |
| Update `opengraph-image.tsx` and `twitter-image.tsx` for locale text | 4h |
| Update structured data (JSON-LD) for locale-specific `inLanguage` | 4h |
| Google Search Console international targeting setup | 2h |

**Milestone**: Google correctly indexes `/es/` and `/pt/` pages with proper hreflang signals.

### Phase 4: Email & Notifications (Week 6)
**Goal**: All system communications respect user's locale.

| Task | Effort |
|------|--------|
| Store user locale preference in `profiles` table | 2h |
| Update email service to read user locale and translate templates | 6h |
| Localize: welcome, threat alert, weekly digest, password reset | 4h |
| Localize Stripe checkout/portal redirect (Stripe supports locale param) | 2h |
| Localize push notification text | 2h |

**Milestone**: Non-English users receive emails in their language.

### Phase 5: Content Localization (Week 7–10)
**Goal**: High-value content pages available in target languages.

| Task | Effort |
|------|--------|
| Translate top 5 blog posts into es/pt | 2 weeks (professional translation) |
| Set up MDX-based blog with locale routing | 1 week |
| Localize 7 industry pages | 1 week (professional translation) |
| Localize 6 comparison pages | 1 week (professional translation) |
| Professional translation + legal review of Privacy Policy (es, pt) | 2 weeks |
| Professional translation + legal review of Terms of Service (es, pt) | 2 weeks |

**Milestone**: Key content pages rank in Spanish/Portuguese search results.

### Phase 6: Hardening & QA (Week 11–12)
**Goal**: Production-quality localization with no regressions.

| Task | Effort |
|------|--------|
| Visual regression testing — screenshot all pages in all locales | 1 week |
| Fix text overflow/truncation issues (es/pt strings ~25% longer) | 3 days |
| Test RTL preparation (even though no RTL locale yet) | 1 day |
| Performance audit — measure bundle size impact | 1 day |
| Accessibility audit — screen reader testing per locale | 2 days |
| E2E tests for locale switching, persistence, routing | 3 days |

---

## 10. Locale Detection & Routing

### Detection Waterfall

```
1. URL path prefix    → /es/pricing → locale = "es"
2. Cookie (dd_locale) → dd_locale=pt → locale = "pt"  
3. Accept-Language    → es-MX,es;q=0.9 → locale = "es"
4. Default            → locale = "en"
```

### Routing Rules

| User Action | Behavior |
|-------------|----------|
| First visit, browser=English | Serve English, no redirect |
| First visit, browser=Spanish | Set cookie `dd_locale=es`, redirect to `/es/` |
| First visit, browser=Portuguese | Set cookie `dd_locale=pt`, redirect to `/pt/` |
| Visit `/es/pricing` directly | Serve Spanish, set cookie |
| Visit `/en/pricing` | Redirect to `/pricing` (hide default locale) |
| Switch locale via selector | Set cookie, navigate to localized URL |
| Return visit (cookie exists) | Serve cookie locale, redirect if needed |
| API request (`/api/*`) | No redirect — detect locale from header for error messages |

### Cookie Specification

| Property | Value |
|----------|-------|
| Name | `dd_locale` |
| Max-Age | 365 days |
| Path | `/` |
| SameSite | `Lax` |
| Secure | Yes (production) |
| HttpOnly | No (needs client-side access for selector) |

---

## 11. UI/UX Considerations

### 11.1 Text Expansion

Spanish and Portuguese strings are typically 20–35% longer than English. Design accommodations:

| Component | English | Spanish | Solution |
|-----------|---------|---------|----------|
| Nav links | "Threats" (7 chars) | "Amenazas" (8 chars) | Flexible nav widths |
| Buttons | "Start Free Trial" (16) | "Iniciar Prueba Gratis" (21) | `min-w` instead of fixed `w` |
| Badges | "Critical" (8) | "Crítica" (7) | No change needed |
| Table headers | "Takedown Requested" (18) | "Eliminación Solicitada" (22) | Allow wrapping or truncation |

**CSS guidelines:**
- Never use `width: fixed` on text containers
- Use `min-width` + `max-width` for buttons
- Allow `text-overflow: ellipsis` for constrained areas
- Test all breakpoints in the longest locale

### 11.2 Language Selector Placement

- **Desktop nav**: Globe icon + locale name, right side of navbar
- **Mobile nav**: Full locale name in hamburger menu
- **Footer**: Inline text switcher (`English | Español | Português`)
- **Settings page**: Full dropdown with flag + locale name
- **First-visit banner**: Optional geo-aware "View this page in Español?" prompt

### 11.3 Right-to-Left (RTL) Preparation

Even though Phase 1 has no RTL locales, prepare now:

- Use CSS logical properties (`margin-inline-start` instead of `margin-left`)
- Set `dir` attribute on `<html>` dynamically
- Avoid hardcoded directional icons (arrows, chevrons)
- Test with `dir="rtl"` on HTML element periodically

### 11.4 Font Considerations

| Locale | Font Stack | Notes |
|--------|-----------|-------|
| en, es, pt, fr, de | Inter (current) | Latin script — all covered |
| ja | Inter + Noto Sans JP | Need Japanese font subset |
| ko | Inter + Noto Sans KR | Need Korean font subset |
| ar | Inter + Noto Sans Arabic | Need Arabic font + RTL |
| zh-Hans | Inter + Noto Sans SC | Need Simplified Chinese font |

**Strategy**: Use `next/font` with `subsets` array. Load CJK/Arabic fonts only for their respective locales using dynamic imports to avoid bundle bloat.

---

## 12. Legal & Compliance

### 12.1 Privacy & Terms

| Requirement | Implementation |
|-------------|----------------|
| LGPD (Brazil) | Portuguese Privacy Policy must reference LGPD specifically |
| GDPR language | Privacy Policy must be available in user's language (GDPR Art. 12) |
| Cookie consent | Cookie banner must be localized |
| Terms acceptance | Terms must be presented in user's language |

### 12.2 Data Residency

Not currently required for Phase 1 markets (all data stays in Supabase US region). For Phase 2+ (EU/DACH expansion), consider:
- EU data residency for German customers
- Supabase project in EU region

### 12.3 Translation Accuracy Disclaimer

Add to footer in non-English locales:
> "This content has been translated from English. In case of discrepancy, the English version prevails."

---

## 13. Email & Notification Localization

### 13.1 Architecture

```
User locale stored in: profiles.preferred_locale (Supabase)
                        ↓
Email service reads locale → creates translator → renders template
                        ↓
Rendered email sent via: Resend / Nodemailer
```

### 13.2 Template Strategy

Each email template uses the existing translation keys under the `emails` namespace:

```typescript
// src/lib/email/localized-templates.ts
import { translate, type Locale } from '@/lib/i18n'

export function renderWelcomeEmail(locale: Locale, data: { name: string }) {
  const t = (key: string, params?: Record<string, string | number>) => 
    translate(locale, key, params)
  
  return {
    subject: t('emails.welcome.subject'),
    html: `
      <h1>${t('emails.welcome.greeting', { name: data.name })}</h1>
      <p>${t('emails.welcome.body')}</p>
      <a href="${APP_URL}/dashboard">${t('emails.welcome.cta')}</a>
    `,
  }
}
```

### 13.3 Stripe Integration

Stripe Checkout and Customer Portal support locale parameter:

```typescript
const session = await stripe.checkout.sessions.create({
  locale: userLocale, // 'es', 'pt-BR', etc.
  // ... other params
})
```

---

## 14. API Localization

### 14.1 Error Messages

API error responses should respect the caller's locale:

```typescript
// Detect locale from Accept-Language header
const locale = getRequestLocale(request)

return NextResponse.json({
  error: translate(locale, 'errors.unauthorized.message'),
  code: 'UNAUTHORIZED', // Machine-readable code stays English
}, { status: 401 })
```

### 14.2 API Response Data

User-facing text in API responses (threat descriptions, scan status labels) should be locale-aware:

```typescript
// Threat status labels
const statusLabel = translate(locale, `threats.status.${threat.status}`)
```

Technical data (URLs, WHOIS records, timestamps) remains unlocalized.

### 14.3 Webhook Payloads

Webhooks deliver machine-readable data — always in English with ISO formats. Localization is the consumer's responsibility.

---

## 15. Testing Strategy

### 15.1 Unit Tests

```typescript
// Translation completeness test
import { en, es, pt } from '@/lib/i18n/translations'

describe('Translation completeness', () => {
  const enKeys = extractAllKeys(en)
  
  test('Spanish has all English keys', () => {
    const esKeys = extractAllKeys(es)
    const missing = enKeys.filter(k => !esKeys.includes(k))
    expect(missing).toEqual([])
  })

  test('Portuguese has all English keys', () => {
    const ptKeys = extractAllKeys(pt)
    const missing = enKeys.filter(k => !ptKeys.includes(k))
    expect(missing).toEqual([])
  })

  test('No empty translation values', () => {
    const emptyKeys = findEmptyValues(es)
    expect(emptyKeys).toEqual([])
  })
  
  test('Interpolation placeholders match', () => {
    // Ensure {name}, {count} etc. are present in all locales
    for (const key of enKeys) {
      const enPlaceholders = extractPlaceholders(getNestedValue(en, key))
      const esPlaceholders = extractPlaceholders(getNestedValue(es, key))
      expect(esPlaceholders).toEqual(enPlaceholders)
    }
  })
})
```

### 15.2 E2E Tests (Playwright)

```typescript
// tests/e2e/i18n.spec.ts
test.describe('Internationalization', () => {
  test('switches to Spanish via selector', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Language"]')
    await page.click('text=Español')
    
    await expect(page).toHaveURL(/\/es/)
    await expect(page.locator('h1')).toContainText('Defiende tu marca')
  })

  test('persists locale across navigation', async ({ page }) => {
    await page.goto('/es')
    await page.click('text=Precios')
    await expect(page).toHaveURL(/\/es\/pricing/)
  })

  test('respects Accept-Language header', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-BR' })
    await page.goto('/')
    await expect(page).toHaveURL(/\/pt/)
  })
  
  test('cookie persistence across sessions', async ({ page, context }) => {
    await page.goto('/es')
    await page.close()
    const newPage = await context.newPage()
    await newPage.goto('/')
    await expect(newPage).toHaveURL(/\/es/)
  })
})
```

### 15.3 Visual Regression Tests

Use Playwright to capture screenshots of every page in every locale and compare against baselines:

```typescript
for (const locale of ['en', 'es', 'pt']) {
  for (const path of ['/pricing', '/auth/login', '/dashboard']) {
    test(`visual-${locale}-${path}`, async ({ page }) => {
      await page.goto(`/${locale}${path}`)
      await expect(page).toHaveScreenshot(`${locale}${path.replace(/\//g, '-')}.png`)
    })
  }
}
```

### 15.4 CI Pipeline Integration

```yaml
# .github/workflows/i18n-check.yml
- name: Translation completeness
  run: npx vitest run src/lib/i18n/__tests__/completeness.test.ts

- name: Visual regression (all locales)
  run: npx playwright test tests/e2e/i18n-visual.spec.ts

- name: Bundle size check
  run: |
    npm run build
    # Fail if translations add >30KB to bundle
```

---

## 16. Performance Budget

### Bundle Size Impact

| Component | Size (gzipped) | Notes |
|-----------|----------------|-------|
| en.ts | ~4.5 KB | Base translations |
| es.ts | ~5.0 KB | ~10% longer strings |
| pt.ts | ~5.0 KB | ~10% longer strings |
| i18n runtime (config, translate, detection, context) | ~3.5 KB | Utilities |
| **Total** | **~18 KB** | All locales included |

### Optimization Options (If Needed)

1. **Lazy-load non-default locales**: Only load es.ts/pt.ts when user switches
2. **Namespace splitting**: Load only the active page's translations
3. **Compile-time extraction**: Pre-resolve translations at build time for SSG pages

**Recommendation**: At ~18KB gzipped, the full bundle is acceptable. No optimization needed unless expanding to 10+ locales.

### Core Web Vitals Target

| Metric | Current | With i18n | Target |
|--------|---------|-----------|--------|
| LCP | <2.5s | <2.6s | <2.5s |
| FID | <100ms | <100ms | <100ms |
| CLS | <0.1 | <0.1 | <0.1 |

The i18n system adds minimal overhead — translations are resolved synchronously from in-memory objects. No additional network requests or layout shifts expected.

---

## 17. Future Expansion Roadmap

### Adding a New Locale (Checklist)

```markdown
## Adding Locale: [XX]

### Configuration
- [ ] Add `'xx'` to `locales` array in `config.ts`
- [ ] Add display name to `localeNames`
- [ ] Add country codes to `localeCountries`
- [ ] Add currency config to `localeCurrencies`
- [ ] Add date format to `localeDateFormats`
- [ ] Add RTL flag if applicable

### Translations
- [ ] Create `translations/xx.ts` implementing `TranslationMessages`
- [ ] Export from `translations/index.ts`
- [ ] Add to `LanguageSelector` flag map
- [ ] Professional review of translations

### Content
- [ ] Translate Privacy Policy + legal review
- [ ] Translate Terms of Service + legal review
- [ ] Translate top 5 blog posts
- [ ] Create locale-specific landing page copy (not just translation)

### SEO
- [ ] Add to sitemap generation
- [ ] Verify hreflang tags include new locale
- [ ] Register in Google Search Console
- [ ] Localized keyword research for blog/industry pages

### Testing
- [ ] Visual regression screenshots
- [ ] E2E locale switching test
- [ ] Translation completeness test passes
- [ ] Bundle size check passes
- [ ] Native speaker UX review

### Launch
- [ ] Announce in changelog/blog
- [ ] Update marketing materials
- [ ] Monitor Search Console for indexing
```

### Technology Evolution

| Timeframe | Consideration |
|-----------|---------------|
| 6 months | Evaluate Crowdin/Lokalise if managing 5+ locales manually becomes painful |
| 12 months | Consider server-side locale routing via Next.js `[locale]` segments if middleware approach shows limitations |
| 18 months | Evaluate AI-powered translation with human review for blog post volume |
| 24 months | Consider locale-specific subdomains (`es.doppeldown.com`) if SEO data supports it |

---

## 18. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Translation quality issues | Medium | High | Professional translators + native speaker review |
| SEO ranking loss during transition | Low | High | Proper hreflang + canonical setup; gradual rollout |
| Bundle size bloat with many locales | Low (Phase 1) | Medium | Lazy loading locales; namespace splitting |
| Middleware performance impact | Low | Medium | Locale detection is ~1ms; no external API calls |
| Hardcoded strings missed during conversion | High | Low | ESLint rule to flag string literals in JSX |
| Text overflow breaking layouts | Medium | Medium | Visual regression tests; responsive design review |
| Legal translation inaccuracy | Low | **Critical** | Professional legal translators + local attorney review |
| Inconsistent terminology across pages | Medium | Medium | Glossary enforcement in translation workflow |
| Stale translations after English update | Medium | Medium | TypeScript compiler catches structural mismatches; Crowdin catches content staleness |

---

## 19. Success Metrics

### Launch Metrics (First 90 Days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Non-English organic traffic | 15% of total | Google Analytics by locale |
| Non-English signups | 10% of total | Supabase analytics by locale |
| Translation coverage | 100% UI, 30% blog | Automated completeness test |
| Core Web Vitals | No regression | Google Search Console |
| Bounce rate (es/pt) | Within 10% of English | Google Analytics |

### Growth Metrics (6–12 Months)

| Metric | Target | Notes |
|--------|--------|-------|
| Spanish organic traffic | 20% of total | LATAM SEO effort |
| Portuguese organic traffic | 10% of total | Brazil market focus |
| MRR from non-English users | 15% of total | Stripe analytics |
| Translation key coverage | 100% all locales | Automated |
| Locale-specific NPS | >40 | In-app survey |

---

## Appendix A: File Change Summary

### Files to Modify

| File | Change Type | Phase |
|------|-------------|-------|
| `src/app/layout.tsx` | Add I18nProvider, dynamic lang attr, hreflang | 1 |
| `src/middleware.ts` | Integrate i18nMiddleware | 1 |
| `src/components/landing/Hero.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/Features.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/HowItWorks.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/Pricing.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/FAQ.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/Footer.tsx` | Add LanguageSwitcherInline, use t() | 1 |
| `src/components/landing/Cta.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/Newsletter.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/WhyNow.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/TrustSignals.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/DemoPreview.tsx` | Replace hardcoded strings with t() | 1 |
| `src/components/landing/Testimonials.tsx` | Replace hardcoded strings with t() | 1 |
| `src/app/auth/login/page.tsx` | Use t() for form labels, errors | 1 |
| `src/app/auth/signup/page.tsx` | Use t() for form labels | 1 |
| `src/app/auth/forgot-password/page.tsx` | Use t() | 1 |
| `src/app/auth/reset-password/page.tsx` | Use t() | 1 |
| `src/app/error.tsx` | Use t() | 1 |
| `src/app/not-found.tsx` | Use t() | 1 |
| `src/app/dashboard/layout.tsx` | Use t() for nav labels | 2 |
| `src/app/dashboard/page.tsx` | Use t() | 2 |
| `src/app/dashboard/brands/*` | Use t() | 2 |
| `src/app/dashboard/threats/*` | Use t() | 2 |
| `src/app/dashboard/reports/*` | Use t() | 2 |
| `src/app/dashboard/settings/*` | Use t(), add locale setting | 2 |
| `src/app/onboarding/*` | Use t() | 2 |
| `src/app/sitemap.ts` | Add locale variants | 3 |
| `src/app/opengraph-image.tsx` | Locale-aware text | 3 |
| `src/lib/email/service.ts` | Read user locale, translate templates | 4 |
| `src/lib/report-generator.ts` | Locale-aware PDF generation | 4 |

### New Files to Create

| File | Purpose | Phase |
|------|---------|-------|
| `src/lib/i18n/server.ts` | Server-side locale helper | 1 |
| `src/components/seo/HreflangTags.tsx` | Dynamic hreflang tags | 1 |
| `src/lib/i18n/__tests__/completeness.test.ts` | Translation coverage test | 1 |
| `tests/e2e/i18n.spec.ts` | E2E locale switching tests | 2 |
| `src/lib/email/localized-templates.ts` | Locale-aware email rendering | 4 |
| `.github/workflows/i18n-check.yml` | CI pipeline for translation QA | 3 |

---

## Appendix B: Quick Start for Developers

### How to use translations in a new component

```tsx
'use client'
import { useI18n } from '@/lib/i18n'

export function MyComponent() {
  const { t, formatDate, formatCurrency } = useI18n()
  
  return (
    <div>
      <h1>{t('section.title')}</h1>
      <p>{t('section.description', { name: 'DoppelDown' })}</p>
      <span>{formatDate(new Date())}</span>
      <span>{formatCurrency(29.99)}</span>
    </div>
  )
}
```

### How to add a new translation key

1. Add to `src/lib/i18n/types.ts` (TypeScript will flag missing implementations)
2. Add English value to `translations/en.ts`
3. Add Spanish value to `translations/es.ts`
4. Add Portuguese value to `translations/pt.ts`
5. Use `t('your.new.key')` in your component
6. Run `npm run test:run` to verify completeness

### How to test a specific locale

```bash
# Method 1: URL prefix
open http://localhost:3000/es/pricing

# Method 2: Browser language
# Chrome → Settings → Languages → Add Spanish, move to top

# Method 3: Cookie
document.cookie = "dd_locale=es; path=/; max-age=31536000"
location.reload()
```
