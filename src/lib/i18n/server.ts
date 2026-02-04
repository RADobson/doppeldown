/**
 * Server-side i18n Helpers
 * 
 * Provides locale detection for Server Components and API routes
 * where React context is not available.
 */

import { cookies, headers } from 'next/headers'
import { detectLanguage } from './detection'
import { createTranslator, createScopedTranslator } from './translate'
import type { Locale } from './config'

/**
 * Get the current locale from server context (cookies + headers).
 * Use in Server Components and `generateMetadata`.
 * 
 * @example
 * ```tsx
 * // In a page.tsx (Server Component)
 * import { getServerLocale } from '@/lib/i18n/server'
 * 
 * export default function Page() {
 *   const locale = getServerLocale()
 *   // ...
 * }
 * ```
 */
export function getServerLocale(): Locale {
  const cookieStore = cookies()
  const headersList = headers()

  const { locale } = detectLanguage({
    cookies: cookieStore.toString(),
    acceptLanguage: headersList.get('accept-language'),
  })

  return locale
}

/**
 * Create a server-side translator for the current request locale.
 * 
 * @example
 * ```tsx
 * import { getServerTranslator } from '@/lib/i18n/server'
 * 
 * export async function generateMetadata() {
 *   const t = getServerTranslator()
 *   return { title: t('landing.hero.headline') }
 * }
 * ```
 */
export function getServerTranslator() {
  const locale = getServerLocale()
  return createTranslator(locale)
}

/**
 * Create a scoped server-side translator for a specific namespace.
 * 
 * @example
 * ```tsx
 * import { getScopedServerTranslator } from '@/lib/i18n/server'
 * 
 * export default function DashboardPage() {
 *   const t = getScopedServerTranslator('dashboard')
 *   return <h1>{t('welcome', { name: user.name })}</h1>
 * }
 * ```
 */
export function getScopedServerTranslator(namespace: string) {
  const locale = getServerLocale()
  return createScopedTranslator(locale, namespace)
}
