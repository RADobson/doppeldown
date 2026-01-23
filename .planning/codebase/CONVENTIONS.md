# Coding Conventions

**Analysis Date:** 2026-01-23

## Naming Patterns

**Files:**
- Components: PascalCase in directories (e.g., `src/components/dashboard/`, `src/components/ui/`)
- Page files: kebab-case directory names with `page.tsx` file (e.g., `src/app/dashboard/brands/[id]/page.tsx`)
- API routes: kebab-case directory names with `route.ts` file (e.g., `src/app/api/scan/social/route.ts`)
- Utility/library files: camelCase (e.g., `domain-generator.ts`, `report-generator.ts`, `supabase/client.ts`)
- Type definition files: camelCase in `src/types/index.ts`

**Functions:**
- camelCase for all function names (e.g., `generateDomainVariations`, `checkDomainRegistration`, `fetchData`, `generateTakedownReport`)
- Private/internal functions: lowercase camelCase prefixed with underscore in component files (e.g., `_generateThreatAnalysis`)
- API handlers: uppercase HTTP method name as function (e.g., `POST()`, `GET()`)
- React event handlers: camelCase prefixed with `handle` (e.g., `handleCreateBrand`, `handleStartScan`)

**Variables:**
- camelCase for all variables and constants (e.g., `brandData`, `threatCount`, `domainsChecked`, `scanConfig`)
- Constants in uppercase with underscores (e.g., `ALLOWED_SCAN_TYPES`, `BRAND_LIMITS`, `COMMON_TLDS`, `HOMOGLYPHS`, `KEYBOARD_PROXIMITY`)
- State variables in React components: camelCase with descriptive names (e.g., `loading`, `scanning`, `scanComplete`, `brandData`)
- Type/interface instance variables match their type structure (e.g., `brands: Brand[]`, `threats: Threat[]`)

**Types & Interfaces:**
- PascalCase for all types and interfaces (e.g., `User`, `Brand`, `Threat`, `ThreatReport`, `DomainVariation`)
- Union type names: PascalCase (e.g., `ThreatType`, `ThreatSeverity`, `ThreatStatus`, `VariationType`)
- Record/mapping objects with lowercase keys matching database field names (e.g., `BRAND_LIMITS: Record<string, number>`, `threatTypeLabels: Record<string, string>`)

## Code Style

**Formatting:**
- No explicit formatter configured (no .prettierrc file detected)
- Consistent use of 2-space indentation throughout codebase
- Import statements organized with 1-2 empty lines before type declarations
- Trailing commas in multiline objects/arrays

**Linting:**
- ESLint configured via Next.js (eslint-config-next v14.2.35)
- TypeScript strict mode enabled (`"strict": true`)
- No custom ESLint configuration file detected beyond Next.js defaults

## Import Organization

**Order:**
1. External library imports (React, Next.js, third-party packages)
2. Type imports from external libraries (e.g., `type ClassValue from 'clsx'`)
3. Blank line
4. Internal type/interface imports (e.g., `import { User, Brand } from '@/types'`)
5. Internal utility/lib imports (e.g., `import { cn, formatDate } from '@/lib/utils'`)
6. Component imports (e.g., `import { Card } from '@/components/ui/card'`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used consistently throughout codebase for all internal imports
- Examples: `@/lib/utils`, `@/types`, `@/components/ui/badge`, `@/lib/supabase/server`

**Example pattern from codebase:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateDomainVariations, checkDomainRegistration } from '@/lib/domain-generator'
import { Threat, Brand } from '@/types'
```

## Error Handling

**Patterns:**
- Try-catch blocks wrapping async operations in API routes and client functions
- Error logging to console with `console.error()` including descriptive context (e.g., `console.error('Error creating brand:', error)`)
- NextResponse.json error returns with status codes:
  - 401: Unauthorized (missing/invalid auth)
  - 400: Bad request (missing required fields)
  - 403: Forbidden (brand limit reached, permission denied)
  - 404: Not found (resource doesn't exist)
  - 500: Internal server error (unhandled exceptions)
- Error object type checking: `error instanceof Error ? error.message : 'Unknown error'`
- Database errors thrown directly: `if (error) throw error`
- Client-side fallback handling with `.catch()` on promises
- Empty catch blocks used for fallback cases (e.g., DNS resolution fallbacks)

**Error responses include:**
- `{ error: 'message' }` object with status code
- Optional error code field for programmatic handling: `{ error: '...', code: 'BRAND_LIMIT_REACHED' }`

## Logging

**Framework:** Native `console` object

**Patterns:**
- `console.error()` for exceptions and failures (all API routes and async operations)
- `console.log()` for informational messages (e.g., `console.log('Starting social media scan...')`, `console.log(\`Found ${socialThreats.length} potential fake social media accounts\`)`)
- No debug or info levels - only error/log distinction
- Messages include context prefix: `'Error fetching scan:', error` or `'Scan error:', error`

## Comments

**When to Comment:**
- Limited use of comments in source code
- Comments used for section headers: `// 1. Generate and check domain variations`, `// 2. Web scanning for lookalike pages`
- Comments explain why, not what: `// Collect evidence for registered domains`, `// Rate limiting`
- Inline HTML comments in generated report templates for structure clarity

**JSDoc/TSDoc:**
- Not used in project - no JSDoc-style documentation found
- Type annotations via TypeScript serve as inline documentation
- Function purposes inferred from names and parameter/return types

## Function Design

**Size:**
- Helper functions kept small and focused (typically 5-30 lines)
- Larger functions break out internal logic into separate typed objects (e.g., `scanConfig` object in `runScan`)
- Page components allowed to be larger (100+ lines) with internal helper functions

**Parameters:**
- Named parameters using object destructuring in larger functions: `{ brandId, scanType = 'full' }` with defaults
- Type annotations for all parameters (TypeScript strict mode)
- Object parameters over multiple positional parameters
- Optional parameters marked with `?` in interfaces

**Return Values:**
- Explicit return type annotations on all functions
- Async functions return `Promise<T>`
- React components return JSX.Element
- API handlers return `NextResponse<T>`
- Helper functions return typed values: `string`, `boolean`, `Record<string, string>[]`
- Early returns for guard conditions (auth checks, validation)

## Module Design

**Exports:**
- Named exports for utility functions: `export function generateDomainVariations()`, `export async function checkDomainRegistration()`
- Default exports for React pages and components: `export default function DashboardPage()`
- Interface/type exports in centralized `src/types/index.ts`
- Internal helpers not exported (private to module)

**Barrel Files:**
- `src/types/index.ts` consolidates all type definitions for app
- No barrel files for components or utilities
- Components imported directly from their directories

## Type Usage

**Interface patterns:**
- Database entities use snake_case fields to match Supabase column names (e.g., `user_id`, `created_at`, `threat_count`, `last_scan_at`)
- Type unions for limited sets (e.g., `'free' | 'active' | 'cancelled'`)
- Optional fields marked with `?` (e.g., `logo_url?: string`, `screenshot_url?: string`)
- Nested interfaces for complex structures (e.g., `Evidence` contains `ScreenshotEvidence[]`)

**Generic type usage:**
- `Record<string, T>` for key-value mappings
- `Map<K, V>` for mutable collections with deduplication
- Array types explicitly typed: `string[]`, `DomainVariation[]`
- `any` avoided; use proper typing (found in `/api/scan/route.ts` as `any` for service client - indicates technical debt)

---

*Convention analysis: 2026-01-23*
