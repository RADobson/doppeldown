/**
 * DoppelDown Library Exports
 * 
 * This file provides a centralized export point for all library modules.
 * Use this for cleaner imports throughout the application.
 * 
 * @example
 * ```ts
 * import { 
 *   generateDomainVariations, 
 *   scanForThreats, 
 *   collectEvidence 
 * } from '@/lib'
 * ```
 */

// Core utilities
export * from './utils'
export * from './shared-utils'
export * from './constants'

// Scanning modules
export * from './domain-generator'
export * from './web-scanner'
export * from './social-scanner'
export * from './scan-queue'
export * from './scan-runner'
export * from './nrd-scanner'
export * from './nrd-provider'

// Evidence and reporting
export * from './evidence-collector'
export * from './report-generator'
export * from './threat-analysis'
export * from './logo-scanner'

// Integrations
export * from './email'
export * from './notifications'
export * from './stripe'
export * from './webhooks'
export * from './api-client'

// Subscriptions and limits
export * from './tier-limits'

// Audit logging
export * from './audit-logger'
