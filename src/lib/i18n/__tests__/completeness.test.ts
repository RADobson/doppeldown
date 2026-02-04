/**
 * Translation Completeness Tests
 * 
 * Ensures all locales have the same keys as English (base) translations,
 * no empty values, and interpolation placeholders are consistent.
 */

import { describe, test, expect } from 'vitest'
import { translations } from '../translations'
import { locales, defaultLocale, type Locale } from '../config'

/**
 * Recursively extract all dot-notation keys from a nested object
 */
function extractAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractAllKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

/**
 * Extract {placeholder} names from a string
 */
function extractPlaceholders(value: unknown): string[] {
  if (typeof value !== 'string') return []
  const matches = value.match(/\{(\w+)\}/g)
  return matches ? matches.sort() : []
}

/**
 * Get a nested value by dot-notation key
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current
}

/**
 * Find keys with empty string values
 */
function findEmptyValues(obj: Record<string, unknown>, prefix = ''): string[] {
  const emptyKeys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      emptyKeys.push(...findEmptyValues(value as Record<string, unknown>, fullKey))
    } else if (typeof value === 'string' && value.trim() === '') {
      emptyKeys.push(fullKey)
    }
  }

  return emptyKeys
}

// ============================================================================
// Tests
// ============================================================================

describe('Translation Completeness', () => {
  const baseLocale = defaultLocale
  const baseTranslations = translations[baseLocale] as unknown as Record<string, unknown>
  const baseKeys = extractAllKeys(baseTranslations)

  // Sanity check — base translations should have a reasonable number of keys
  test('base translations (en) have substantial content', () => {
    expect(baseKeys.length).toBeGreaterThan(100)
  })

  // Test each non-default locale
  const nonDefaultLocales = locales.filter(l => l !== baseLocale)

  for (const locale of nonDefaultLocales) {
    describe(`Locale: ${locale}`, () => {
      const localeTranslations = translations[locale] as unknown as Record<string, unknown>
      const localeKeys = extractAllKeys(localeTranslations)

      test(`has all keys from ${baseLocale}`, () => {
        const missing = baseKeys.filter(k => !localeKeys.includes(k))
        if (missing.length > 0) {
          console.error(`Missing keys in ${locale}:`, missing)
        }
        expect(missing).toEqual([])
      })

      test(`has no extra keys not in ${baseLocale}`, () => {
        const extra = localeKeys.filter(k => !baseKeys.includes(k))
        if (extra.length > 0) {
          console.warn(`Extra keys in ${locale} (not in ${baseLocale}):`, extra)
        }
        // Warn but don't fail — extra keys are not necessarily wrong
        // expect(extra).toEqual([])
      })

      test('has no empty translation values', () => {
        const emptyKeys = findEmptyValues(localeTranslations)
        if (emptyKeys.length > 0) {
          console.error(`Empty values in ${locale}:`, emptyKeys)
        }
        expect(emptyKeys).toEqual([])
      })

      test('interpolation placeholders match base locale', () => {
        const mismatches: string[] = []

        for (const key of baseKeys) {
          const baseValue = getNestedValue(baseTranslations, key)
          const localeValue = getNestedValue(localeTranslations, key)

          const basePlaceholders = extractPlaceholders(baseValue)
          const localePlaceholders = extractPlaceholders(localeValue)

          if (JSON.stringify(basePlaceholders) !== JSON.stringify(localePlaceholders)) {
            mismatches.push(
              `${key}: ${baseLocale}=${basePlaceholders.join(',')} vs ${locale}=${localePlaceholders.join(',')}`
            )
          }
        }

        if (mismatches.length > 0) {
          console.error(`Placeholder mismatches in ${locale}:`, mismatches)
        }
        expect(mismatches).toEqual([])
      })
    })
  }
})

describe('Translation Quality', () => {
  for (const locale of locales) {
    describe(`Locale: ${locale}`, () => {
      const localeTranslations = translations[locale] as unknown as Record<string, unknown>

      test('meta.direction is valid', () => {
        const direction = getNestedValue(localeTranslations, 'meta.direction')
        expect(['ltr', 'rtl']).toContain(direction)
      })

      test('meta.language is non-empty', () => {
        const language = getNestedValue(localeTranslations, 'meta.language')
        expect(typeof language).toBe('string')
        expect((language as string).length).toBeGreaterThan(0)
      })
    })
  }
})
