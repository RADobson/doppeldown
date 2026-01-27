# Phase 7: UI Polish - Research

**Researched:** 2026-01-27
**Domain:** UI/UX design systems, Tailwind CSS
**Confidence:** HIGH

## Summary

UI polish for a Next.js/Tailwind application focuses on seven specific requirements: spacing consistency (8pt grid), typography scale, loading states, empty states, accessibility (focus/hover), error messages, and micro-interactions. Research confirms that Tailwind's default spacing scale naturally aligns with 8pt grid systems, Next.js App Router provides built-in Suspense/streaming for loading states, and modern accessibility guidelines emphasize focus-visible for keyboard navigation. The primary challenge is systematically applying these patterns across an existing codebase without scope creep.

**Current state analysis:**
- Existing components (Button, Input) already implement basic focus states and transitions
- Dashboard pages show basic loading states (Loader2 spinner) but lack skeleton UIs
- Empty states exist (dashboard threats list) but inconsistent patterns
- Typography uses Tailwind defaults without defined system
- Hover/focus states are inconsistent across components

**Primary recommendation:** Audit existing components first, establish design tokens in tailwind.config.ts, create reusable patterns (skeleton loader, empty state wrapper), then systematically apply polish without changing functional behavior.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.4.17 (current) | Utility-first CSS framework | Already in use, provides complete system for spacing, typography, animations |
| Next.js | 14.2.35 (current) | React framework | Already in use, provides loading.js convention for Suspense |
| Lucide React | 0.469.0 (current) | Icon library | Already in use throughout codebase |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-loading-skeleton | 3.5.0+ | Skeleton loading components | Optional - can hand-roll with Tailwind's animate-pulse |
| clsx / tailwind-merge | 2.6.0 (current) | Conditional class composition | Already in use via cn() utility |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled skeletons | react-loading-skeleton | Library adds 17KB, but hand-rolled with animate-pulse is simpler for this scope |
| Custom animations | Framer Motion | Overkill for subtle micro-interactions; Tailwind transitions sufficient |

**Installation:**
No new packages required - use existing Tailwind + Next.js built-ins.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ui/                    # Base components (button, input, etc.)
│   ├── loading/               # Skeleton loaders
│   │   ├── CardSkeleton.tsx
│   │   ├── TableSkeleton.tsx
│   │   └── StatSkeleton.tsx
│   └── empty-states/          # Empty state patterns
│       ├── EmptyState.tsx     # Base component
│       └── examples.tsx       # Specific instances
├── lib/
│   ├── design-tokens.ts       # Typography scale, spacing constants
│   └── utils.ts               # Existing cn() utility
└── app/                       # Pages using patterns
```

### Pattern 1: 8pt Grid Spacing
**What:** Use Tailwind's default spacing scale which aligns with 8pt grid (4px base unit)
**When to use:** All margins, padding, gaps between elements
**Example:**
```typescript
// Source: Tailwind defaults (https://tailwindcss.com/docs/customizing-spacing)
// Tailwind's scale: 1 unit = 0.25rem (4px)
// 8pt equivalents:
// gap-2 = 8px (1x 8pt)
// gap-4 = 16px (2x 8pt)
// gap-6 = 24px (3x 8pt)
// gap-8 = 32px (4x 8pt)

// Apply consistently:
<div className="space-y-8">      {/* 32px vertical spacing */}
  <Card className="p-6">         {/* 24px padding */}
    <div className="flex gap-4"> {/* 16px gap */}
      <Button className="px-4 py-2"> {/* 16px horizontal, 8px vertical */}
```

**Key principle:** Internal spacing ≤ External spacing. Padding inside element should be equal to or less than margin outside.

### Pattern 2: Typography Scale
**What:** Define limited type scale (5-6 sizes max) for consistency
**When to use:** All text elements throughout app
**Example:**
```typescript
// Source: Design system best practices 2026
// Recommended scale for web apps:
const typeScale = {
  h1: 'text-2xl font-bold',      // 24px - Page headers
  h2: 'text-xl font-semibold',   // 20px - Section headers
  h3: 'text-lg font-semibold',   // 18px - Sub-section headers
  body: 'text-base',             // 16px - Body text (default)
  small: 'text-sm',              // 14px - Secondary text
  xs: 'text-xs'                  // 12px - Labels, captions
}

// Usage:
<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
<p className="text-gray-500 mt-1">Overview of your brand protection</p>
```

### Pattern 3: Loading States (Suspense + Skeleton)
**What:** Use Next.js loading.js with skeleton UI that mimics content structure
**When to use:** Any async data fetching in pages/components
**Example:**
```typescript
// Source: Next.js 15 Streaming Handbook
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// For granular control, use Suspense boundaries:
<Suspense fallback={<CardSkeleton />}>
  <AsyncThreatsList />
</Suspense>
```

### Pattern 4: Empty States
**What:** Meaningful feedback when no data exists, with icon + message + optional CTA
**When to use:** Lists with zero items, search with no results, cleared data
**Example:**
```typescript
// Source: Empty State UX Best Practices (https://www.eleken.co/blog-posts/empty-state-ux)
// Base component pattern:
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  variant?: 'default' | 'success' // Success for "All caught up!" states
}

export function EmptyState({ icon: Icon, title, description, action, variant = 'default' }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className={cn(
        "h-12 w-12 mx-auto mb-4",
        variant === 'success' ? 'text-green-500' : 'text-gray-300'
      )} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}

// Usage:
{threats.length === 0 && (
  <EmptyState
    icon={Shield}
    title="No threats detected"
    description="Run a scan to check for potential threats"
    action={{ label: "Start Scan", onClick: handleScan }}
  />
)}
```

### Pattern 5: Focus/Hover Accessibility
**What:** Use focus-visible for keyboard navigation, ensure 3:1 contrast ratio for state changes
**When to use:** All interactive elements (buttons, links, inputs)
**Example:**
```typescript
// Source: Tailwind focus-visible documentation
// Best practice: focus-visible (keyboard only) + hover
<button className="
  bg-primary-600 text-white
  hover:bg-primary-700
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary-500
  focus-visible:ring-offset-2
  transition-colors duration-200
">
  Submit
</button>

// For inputs:
<input className="
  border border-gray-300
  focus:outline-none
  focus:border-primary-500
  focus:ring-1
  focus:ring-primary-500
  transition-colors duration-200
" />

// Links:
<a className="
  text-primary-600
  hover:text-primary-700
  focus-visible:outline-2
  focus-visible:outline-offset-2
  focus-visible:outline-primary-500
  transition-colors duration-150
">
```

### Pattern 6: Error Messages
**What:** Clear, actionable, human language explaining what went wrong and how to fix
**When to use:** Form validation, API errors, user input problems
**Example:**
```typescript
// Source: Error Message UX Best Practices (https://uxwritinghub.com/error-message-examples/)
// Principles: Be specific, explain why, offer solution, avoid jargon

// ❌ Bad:
"Invalid input"
"Error 500"
"Something went wrong"

// ✅ Good:
"Email address is required"
"Your password must be at least 8 characters"
"We couldn't connect to the server. Please check your internet connection and try again."

// Implementation:
interface ErrorMessageProps {
  message: string
  action?: { label: string; onClick: () => void }
}

export function ErrorMessage({ message, action }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-red-600 hover:text-red-700 mt-2 underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Pattern 7: Micro-interactions
**What:** Subtle transitions on hover/focus/active states (150-300ms duration)
**When to use:** All interactive elements for feedback
**Example:**
```typescript
// Source: Tailwind transitions documentation
// Default timing: 150ms for micro-interactions, 300ms for larger changes

// Button hover/active:
<button className="
  bg-primary-600
  hover:bg-primary-700
  active:scale-95
  transition-all duration-200
  ease-in-out
">

// Card hover:
<Link className="
  block border border-gray-200 rounded-lg
  hover:border-primary-300
  hover:bg-primary-50/50
  hover:shadow-md
  transition-all duration-200
">

// Icon scale on hover:
<button className="
  group
  p-2 rounded-lg
  hover:bg-gray-100
  transition-colors duration-150
">
  <Icon className="
    h-5 w-5
    group-hover:scale-110
    transition-transform duration-200
  " />
</button>

// Respect motion preferences:
<div className="
  transition-transform duration-300
  hover:scale-105
  motion-reduce:transition-none
  motion-reduce:hover:scale-100
">
```

### Anti-Patterns to Avoid
- **Inconsistent spacing:** Mixing random values (px-3, px-5, px-7) instead of 8pt multiples
- **transition-all everywhere:** Performance hit, prefer specific properties (transition-colors, transition-transform)
- **Missing empty states:** Showing blank screens when data is empty
- **Generic error messages:** "Something went wrong" without actionable guidance
- **No loading feedback:** Async operations without visual indication
- **Hover-only focus states:** Keyboard users can't see focus without focus-visible
- **Too many typography sizes:** Using text-xs through text-9xl inconsistently

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skeleton loaders | Custom shimmer animations | Tailwind's animate-pulse utility | Built-in, accessible, performant |
| Focus ring styles | Custom outline CSS | Tailwind focus-visible variants | WCAG compliant, respects keyboard navigation |
| Motion preferences | Custom JS detection | Tailwind motion-reduce/motion-safe | Respects prefers-reduced-motion, no JS needed |
| Spacing system | Random px values | Tailwind's default spacing scale | Already 8pt-aligned, consistent |
| Transitions | Custom @keyframes | Tailwind transition utilities | Optimized timing functions, GPU-accelerated |

**Key insight:** Tailwind CSS provides battle-tested utilities for all seven requirements. Custom solutions risk accessibility issues, performance problems, and maintenance burden.

## Common Pitfalls

### Pitfall 1: Inconsistent Spacing
**What goes wrong:** Developers use arbitrary spacing values (px-3, px-5, mx-7) instead of consistent 8pt grid
**Why it happens:** Not understanding Tailwind's spacing scale relationship to 8pt grid
**How to avoid:**
- Establish spacing tokens: use only gap-2, gap-4, gap-6, gap-8 (8px, 16px, 24px, 32px)
- Document internal ≤ external rule: padding inside ≤ margin outside
- Code review for spacing consistency
**Warning signs:**
- Elements feel misaligned
- Spacing feels "off" without obvious reason
- Mixing px-3 and px-4 in similar contexts

### Pitfall 2: Loading Without Skeleton Structure
**What goes wrong:** Using centered spinner for all loading states instead of skeleton UI
**Why it happens:** Spinner is easier/faster to implement
**How to avoid:**
- Create skeleton components that match actual content layout
- Use Next.js loading.js convention for route-level loading
- Use Suspense boundaries for component-level loading
**Warning signs:**
- Layout shifts when content loads
- Jarring transition from spinner to content
- User confusion about what's loading

### Pitfall 3: Empty States Missing Context
**What goes wrong:** Empty lists show nothing or generic "No items" text
**Why it happens:** Treating empty state as error case rather than valid state
**How to avoid:**
- Create EmptyState component with icon + title + description + optional action
- Differentiate types: first-use, user-cleared, no-results, error
- Use celebratory states for "All caught up!" scenarios
**Warning signs:**
- Users confused about why list is empty
- No clear next action when empty
- Blank screens

### Pitfall 4: Focus States Only for Mouse Users
**What goes wrong:** Using hover: without focus-visible:, keyboard users can't see focus
**Why it happens:** Testing only with mouse, not keyboard (Tab navigation)
**How to avoid:**
- Always pair hover: with focus-visible:
- Test with Tab key navigation
- Use focus-visible:ring-2 for clear indicators
- Ensure 3:1 contrast ratio for focus states (WCAG 2.1)
**Warning signs:**
- Keyboard navigation shows no visual feedback
- Users complain about accessibility
- WCAG audits fail

### Pitfall 5: Using transition-all Performance Hit
**What goes wrong:** Adding transition-all to many elements causes performance issues
**Why it happens:** Seems convenient to transition everything
**How to avoid:**
- Use specific transition utilities: transition-colors, transition-transform, transition-opacity
- Avoid transitioning layout properties (width, height, margin)
- Prefer transform/opacity (GPU-accelerated)
- Profile with Chrome DevTools for 90ms target
**Warning signs:**
- Janky animations on lower-end devices
- Style recalculations > 90ms
- Visible lag on hover/focus

### Pitfall 6: Typography Size Proliferation
**What goes wrong:** Using 8+ different text sizes inconsistently across app
**Why it happens:** Not establishing type scale upfront
**How to avoid:**
- Define 5-6 size scale maximum (h1, h2, h3, body, small, xs)
- Document semantic usage (h1 for page headers, not "big text")
- Create design tokens file
**Warning signs:**
- Same semantic element has different sizes on different pages
- Unclear hierarchy
- Text feels inconsistent

### Pitfall 7: Generic Error Messages
**What goes wrong:** Showing "Something went wrong" or "Error 500" without explanation
**Why it happens:** Developer-centric thinking (we know what error means)
**How to avoid:**
- Always explain what happened in plain language
- Provide actionable next step
- Avoid technical jargon/codes in user-facing messages
- Test messages with non-technical users
**Warning signs:**
- Support tickets asking "what does this error mean?"
- Users abandoning flow due to confusing errors
- Error messages with status codes (500, 404) visible to users

## Code Examples

Verified patterns from official sources:

### 8pt Grid Spacing
```typescript
// Source: Tailwind spacing documentation
// Consistent spacing hierarchy using 8pt multiples

// Page-level spacing
<div className="space-y-8">          {/* 32px between sections */}

  {/* Card spacing */}
  <Card className="p-6">             {/* 24px padding */}

    {/* Internal element spacing */}
    <div className="mb-4">           {/* 16px bottom margin */}
      <h2 className="text-xl font-semibold">Title</h2>
    </div>

    {/* Grid gaps */}
    <div className="grid grid-cols-2 gap-4"> {/* 16px gap */}
      {/* content */}
    </div>

  </Card>
</div>
```

### Skeleton Loading Pattern
```typescript
// Source: Next.js App Router loading.js convention
// app/dashboard/threats/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Card skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Empty State Component
```typescript
// Source: Empty State UX patterns (Eleken, Mobbin)
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  variant?: 'default' | 'success'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className={cn(
        "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
        variant === 'success' ? 'bg-green-100' : 'bg-gray-100'
      )}>
        <Icon className={cn(
          "h-8 w-8",
          variant === 'success' ? 'text-green-600' : 'text-gray-400'
        )} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
```

### Accessible Focus States
```typescript
// Source: Tailwind hover-focus-and-other-states documentation
// Component with complete accessibility states

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'px-4 py-2 text-sm font-medium rounded-lg',

          // Colors
          'bg-primary-600 text-white',

          // Hover state (mouse)
          'hover:bg-primary-700',

          // Focus outline (keyboard - CRITICAL for a11y)
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary-500',
          'focus-visible:ring-offset-2',

          // Active state (click)
          'active:scale-95',

          // Disabled state
          'disabled:opacity-50',
          'disabled:cursor-not-allowed',
          'disabled:hover:bg-primary-600',

          // Transitions
          'transition-all duration-200',

          // Motion preferences
          'motion-reduce:transition-none',
          'motion-reduce:active:scale-100'
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
```

### Micro-interaction Pattern
```typescript
// Source: Tailwind animation best practices
// Card with subtle hover animation

<Link
  href={`/dashboard/threats/${threat.id}`}
  className={cn(
    // Base styles
    'block p-4 border border-gray-200 rounded-lg',

    // Hover micro-interaction
    'hover:border-primary-300',
    'hover:bg-primary-50/50',
    'hover:shadow-md',

    // Smooth transition
    'transition-all duration-200 ease-in-out',

    // Focus state for keyboard
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary-500',

    // Respect motion preferences
    'motion-reduce:transition-none'
  )}
>
  {/* content */}
</Link>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Centered spinner for all loading | Skeleton UI matching content structure | ~2020 | Better perceived performance, reduced layout shift |
| focus: for all focus states | focus-visible: for keyboard only | ~2021 (Tailwind 2.1+) | Better UX - no focus rings on mouse click |
| Custom spacing values | 8pt grid system via Tailwind defaults | Ongoing | More consistent, scalable designs |
| transition-all | Specific transition properties | ~2022 | Better performance, 60fps interactions |
| Empty state = error | Empty state = valid UI state | ~2019 | Better UX, clear next actions |
| Technical error messages | Plain language + actionable guidance | Ongoing | Reduced support tickets, better conversion |
| Animations for aesthetics | Subtle micro-interactions for feedback | ~2023 | Purposeful motion, better accessibility |

**Deprecated/outdated:**
- **prefers-reduced-motion media queries in CSS:** Use Tailwind's motion-reduce/motion-safe variants instead
- **Custom focus ring implementations:** Use Tailwind's focus-visible utilities for WCAG compliance
- **Separate loading routes:** Next.js 13+ App Router provides loading.js convention

## Open Questions

Things that couldn't be fully resolved:

1. **Typography font selection (1-2 fonts max requirement)**
   - What we know: System fonts are fast, web fonts require loading strategy
   - What's unclear: Is the app currently using custom fonts or system fonts?
   - Recommendation: Check tailwind.config.ts for custom fontFamily. If none defined, using system fonts (Inter via Next.js defaults). This satisfies UIPOL-02 requirement.

2. **Severity of existing spacing inconsistencies**
   - What we know: Components use mix of spacing values (seen in dashboard pages)
   - What's unclear: How pervasive the problem is without full audit
   - Recommendation: Create spacing audit checklist, prioritize high-traffic pages (dashboard, threats list)

3. **Dark mode impact on focus states**
   - What we know: Phase 9 will implement dark mode
   - What's unclear: Whether focus-visible ring colors need adjustment for dark backgrounds
   - Recommendation: Current focus-visible:ring-primary-500 should work, but verify in Phase 9 that ring colors meet 3:1 contrast in dark mode

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS Customizing Spacing](https://tailwindcss.com/docs/customizing-spacing) - Spacing scale and 8pt grid alignment
- [Tailwind CSS Hover, Focus, and Other States](https://tailwindcss.com/docs/hover-focus-and-other-states) - Accessibility states, focus-visible
- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation) - Built-in animations and custom patterns
- [Tailwind CSS Transition Property](https://tailwindcss.com/docs/transition-property) - Transitions for micro-interactions
- [Next.js Loading UI and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) - loading.js convention, Suspense

### Secondary (MEDIUM confidence)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Design tokens, typography patterns
- [Best Practices for Loading States in Next.js](https://www.getfishtank.com/insights/best-practices-for-loading-states-in-nextjs) - Skeleton UI patterns
- [Empty State UX Examples and Design Rules](https://www.eleken.co/blog-posts/empty-state-ux) - Empty state patterns and types
- [Empty State UI Pattern (Mobbin)](https://mobbin.com/glossary/empty-state) - Best practices and examples
- [Error Message UX Best Practices](https://uxwritinghub.com/error-message-examples/) - Microcopy guidelines
- [UX Writing Best Practices](https://www.parallelhq.com/blog/ux-writing-best-practices) - Plain language error messages
- [CSS/JS Animation Trends 2026](https://webpeak.org/blog/css-js-animation-trends/) - Subtle micro-interactions emphasis

### Tertiary (LOW confidence)
- [react-loading-skeleton npm](https://www.npmjs.com/package/react-loading-skeleton) - Alternative to hand-rolled skeletons (not recommended for this scope)
- [Design System Typography Guide](https://www.designsystems.com/typography-guides/) - General typography principles

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in project, official documentation verified
- Architecture: HIGH - Patterns sourced from Tailwind/Next.js official docs, established UX research
- Pitfalls: HIGH - Based on documented accessibility issues (WCAG), performance best practices, common UX mistakes

**Research date:** 2026-01-27
**Valid until:** ~2026-04-27 (90 days - design systems evolve slowly, Tailwind 3.x stable)

**Constraints applied:**
- Phase 6 branding decisions: Primary-600 (#2563eb) used as accent color in focus states
- Phase 8 prerequisite: No color refactoring - use existing semantic color names
- Phase 9 dependency: Dark mode will need verification of focus state contrast
- Scope: Polish only, no functional changes
