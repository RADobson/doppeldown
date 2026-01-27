# Architecture Research: v1.2 Dark Mode & Design System

**Project:** DoppelDown v1.2 — Polish for Launch
**Researched:** 2026-01-27
**Confidence:** HIGH

## Current State

### Existing Architecture
- **Framework:** Next.js 14 App Router (src/ directory)
- **Styling:** Tailwind CSS v3.4.17
- **Component structure:**
  - Base components in `src/components/ui/` (Card, Button, Badge, Input)
  - Feature components in `src/components/` (NotificationDropdown, ScanProgress, PlatformSelector)
  - Page components in `src/app/` following App Router conventions
- **Root layout:** `src/app/layout.tsx` with Inter font, no theme provider
- **Global styles:** `src/app/globals.css` with minimal customization

### Current Color System
- **Tailwind config:** Custom semantic colors defined (primary, danger, warning, success) with shade scales (50-950)
- **Usage patterns:** Direct gray scale usage throughout components (text-gray-900, bg-gray-50, border-gray-200)
- **Hardcoded colors:** 57+ instances in dashboard alone using gray-* utilities
- **No dark mode support:** All components hardcoded for light mode only

### Design Inconsistencies
- **Color usage:** Mix of semantic (primary, danger) and utility (gray-*) colors
- **Components:** Base UI components (Card, Button) don't have dark variants
- **Spacing:** Inconsistent padding/margin patterns across pages
- **Typography:** Only title font configured (Inter), no semantic hierarchy

## Target Architecture

### Theme System Foundation

**1. Next-Themes Integration**
- Library: `next-themes` (industry standard, 13K+ GitHub stars)
- Features: localStorage persistence, system preference detection, zero-flash implementation
- Provider wraps entire app at root layout level
- Configuration: `defaultTheme: "system"`, `attribute: "class"`, `enableSystem: true`

**2. Tailwind Dark Mode Configuration**
```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  // ... existing config
}
```

**3. CSS Variable-Based Semantic Tokens**
Define semantic color tokens in `globals.css` that map to actual colors:
```css
:root {
  /* Light mode */
  --background: 0 0% 100%;          /* white */
  --foreground: 224 71% 4%;         /* near-black */
  --card: 0 0% 100%;                /* white */
  --card-foreground: 224 71% 4%;
  --primary: 217 91% 60%;           /* blue-500 equivalent */
  --primary-foreground: 0 0% 100%;
  --muted: 220 14% 96%;             /* gray-50 equivalent */
  --muted-foreground: 220 9% 46%;   /* gray-600 */
  /* ... more tokens */
}

.dark {
  /* Dark mode overrides */
  --background: 224 71% 4%;         /* near-black */
  --foreground: 213 31% 91%;        /* light gray */
  --card: 217 33% 10%;              /* dark card */
  --card-foreground: 213 31% 91%;
  --primary: 217 91% 60%;           /* same primary */
  --primary-foreground: 224 71% 4%;
  --muted: 223 47% 11%;             /* dark muted */
  --muted-foreground: 215 20% 65%;
  /* ... more tokens */
}
```

**4. Semantic Utility Classes**
Update Tailwind config to use semantic tokens:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      'card-foreground': 'hsl(var(--card-foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      // ... more semantic tokens
    }
  }
}
```

### Component Architecture

**Updated Base Components:**
- Card: `bg-card text-card-foreground border-border`
- Button: Variant-specific semantic colors (primary uses `bg-primary`, secondary uses `bg-muted`)
- Typography: `text-foreground` for body, `text-muted-foreground` for secondary
- Borders: `border-border` instead of `border-gray-200`
- Backgrounds: `bg-background` instead of `bg-white`, `bg-muted` instead of `bg-gray-50`

**Theme Toggle Component:**
New client component `ThemeToggle.tsx` in `src/components/`:
- Sun/Moon icon switcher
- Three-state toggle: light / dark / system
- Integrates with next-themes `useTheme()` hook
- Placement: Dashboard header navigation bar

## Integration Points

### 1. Root Layout (`src/app/layout.tsx`)
**Changes:**
- Add `suppressHydrationWarning` to `<html>` tag (prevents next-themes hydration warning)
- Wrap children with `ThemeProvider` from next-themes
- Import ThemeProvider as client component

```typescript
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Global Styles (`src/app/globals.css`)
**Changes:**
- Define CSS variables for semantic tokens (`:root` and `.dark`)
- Update custom scrollbar styles with dark variants
- Update threat severity classes with dark variants
- Remove hardcoded RGB color variables

### 3. Tailwind Config (`tailwind.config.ts`)
**Changes:**
- Add `darkMode: ['class']`
- Extend theme.colors with semantic token mappings
- Keep existing custom colors (primary scale, danger, warning, success) for backward compatibility

### 4. Base UI Components (`src/components/ui/`)
**Migration order:**
1. **Card** — Most used component, foundational
2. **Button** — Second most used, affects all CTAs
3. **Badge** — Used for severity/status indicators
4. **Input** — Form elements

**Migration pattern:**
```typescript
// Before
<div className="bg-white border border-gray-200 text-gray-900">

// After
<div className="bg-card border border-border text-card-foreground">
```

### 5. Dashboard Header
**New component:** `DashboardHeader.tsx` or update `dashboard/layout.tsx`
- Add ThemeToggle component next to NotificationDropdown
- Consistent header background: `bg-background border-b border-border`

### 6. No Changes Required
- **API routes** — Server-side, no theme dependency
- **Database schema** — No theme preference storage initially (localStorage only)
- **External integrations** — Stripe, Supabase UI unaffected
- **Email templates** — Remain light mode (standard practice)

## Migration Strategy

### Phase 1: Foundation (No Breaking Changes)
**Goal:** Set up theme system without breaking existing UI

1. Install next-themes: `npm install next-themes`
2. Create `ThemeProvider` wrapper component (client component)
3. Update root layout with ThemeProvider + suppressHydrationWarning
4. Add CSS variables to globals.css (both :root and .dark)
5. Configure Tailwind darkMode: ['class']
6. Extend Tailwind theme with semantic color mappings
7. Create ThemeToggle component (functional but not visible yet)

**Verification:** App still looks identical in light mode, no visual changes

### Phase 2: Base Component Migration (Incremental)
**Goal:** Migrate UI components one at a time, test in isolation

**Migration order and rationale:**

1. **Card component** (highest impact, lowest risk)
   - Used in 30+ locations
   - Simple structure (div with classes)
   - Replace: `bg-white` → `bg-card`, `border-gray-200` → `border-border`, `text-gray-900` → `text-card-foreground`
   - Test: Dashboard page, brand detail pages

2. **Typography utilities** (foundational)
   - Create helper classes: `text-foreground`, `text-muted-foreground`
   - Replace in components: `text-gray-900` → `text-foreground`, `text-gray-500` → `text-muted-foreground`
   - Test: All pages for readability

3. **Button component** (medium impact)
   - Update variant styles with semantic colors
   - Primary variant already uses semantic `primary-*` colors (no change needed)
   - Secondary/outline variants: update gray references
   - Test: All interactive elements

4. **Badge component** (low impact)
   - Update status/severity indicators
   - Keep semantic colors (danger, warning, success) but add dark variants
   - Test: Threat lists, notification dropdown

5. **Input component** (medium impact)
   - Update border and background colors
   - Add focus ring dark variants
   - Test: All forms (brand creation, settings)

**Verification after each:** Toggle dark mode, check component in all contexts

### Phase 3: Page-Level Migration (Systematic)
**Goal:** Update pages to use semantic colors, working outward from most visible

**Priority order:**
1. Dashboard (`src/app/dashboard/page.tsx`) — First impression, highest visibility
2. Brand detail (`src/app/dashboard/brands/[id]/page.tsx`) — Core workflow
3. Threats page (`src/app/dashboard/threats/page.tsx`) — Core workflow
4. Settings (`src/app/dashboard/settings/page.tsx`) — Theme toggle visible here
5. Auth pages (`src/app/auth/`) — Login, signup, reset password
6. Landing page (`src/app/page.tsx`) — Public face (tackled separately in design milestone)

**Pattern for each page:**
```typescript
// Search and replace within page:
bg-white → bg-card or bg-background (context dependent)
text-gray-900 → text-foreground
text-gray-500 → text-muted-foreground
text-gray-400 → text-muted-foreground (lighter)
bg-gray-50 → bg-muted
bg-gray-100 → bg-muted (or bg-accent if interactive)
border-gray-200 → border-border
hover:bg-gray-100 → hover:bg-accent
```

**Verification:** Each page tested in both light and dark mode

### Phase 4: Feature Components (Final)
**Goal:** Update specialized components with complex styling

1. **NotificationDropdown** — Dropdown menu styling
2. **ScanProgress** — Progress indicators and animations
3. **PlatformSelector** — Multi-select UI elements

**Considerations:**
- Hover states need dark variants
- Focus states need sufficient contrast in both modes
- Icons (Lucide) already work (currentColor)

### Phase 5: Polish & QA
**Goal:** Ensure consistency and fix edge cases

1. Add ThemeToggle to dashboard header (now fully functional)
2. Test all pages in both modes systematically
3. Check color contrast ratios (WCAG AA minimum)
4. Fix any missed gray-* references (grep codebase)
5. Test system preference switching
6. Test localStorage persistence across sessions
7. Document new semantic color tokens for future development

**Quality gates:**
- [ ] No console warnings about hydration
- [ ] No color contrast failures (use browser DevTools)
- [ ] All interactive elements have hover/focus states in both modes
- [ ] Theme toggle visible and functional in dashboard
- [ ] Theme preference persists across browser sessions
- [ ] System theme changes respected in real-time

## Suggested Build Order

### Week 1: Foundation + Core Components
**Tasks:**
1. Install and configure next-themes (30 min)
2. Define CSS variables in globals.css (1 hour)
3. Update Tailwind config (30 min)
4. Create ThemeProvider wrapper (30 min)
5. Update root layout (15 min)
6. Create ThemeToggle component (1 hour)
7. Migrate Card component (1 hour)
8. Migrate Button component (1 hour)
9. Test dashboard page in dark mode (30 min)

**Outcome:** Theme system functional, 2 core components migrated, dark mode works but incomplete

### Week 2: Component Library + Dashboard
**Tasks:**
1. Migrate Badge component (30 min)
2. Migrate Input component (1 hour)
3. Migrate dashboard page (2 hours)
4. Migrate brand detail page (1.5 hours)
5. Migrate threats page (1.5 hours)
6. Add ThemeToggle to dashboard header (30 min)
7. Test all dashboard views in both modes (1 hour)

**Outcome:** Dashboard fully dark-mode compatible, theme toggle visible

### Week 3: Auth + Feature Components
**Tasks:**
1. Migrate auth pages (login, signup, reset) (2 hours)
2. Migrate settings page (1 hour)
3. Migrate NotificationDropdown (1 hour)
4. Migrate ScanProgress (1 hour)
5. Migrate PlatformSelector (1 hour)
6. Full codebase grep for remaining gray-* (30 min)
7. Fix edge cases (1 hour)

**Outcome:** All app pages dark-mode compatible

### Week 4: Polish + Landing Page
**Tasks:**
1. Contrast ratio audit (1 hour)
2. Hover/focus state review (1 hour)
3. Update landing page with design improvements + dark mode (combined with visual redesign milestone)
4. Cross-browser testing (Chrome, Firefox, Safari) (1 hour)
5. Document semantic color system in codebase (30 min)

**Outcome:** Production-ready dark mode, documentation complete

## Anti-Patterns to Avoid

### 1. Duplicating Classes (DON'T)
```typescript
// BAD: This gets unmaintainable
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
```
**Why bad:** Every component needs dark: variants, easy to miss, verbose
**Instead:** Use semantic tokens that switch automatically

### 2. Hardcoding Colors Mid-Migration
```typescript
// BAD: Mixing semantic and utility colors
<div className="bg-card text-gray-900">
```
**Why bad:** Inconsistent dark mode behavior
**Instead:** Fully migrate each component (bg-card + text-card-foreground)

### 3. Forgetting Hover/Focus States
```typescript
// BAD: Only base state has dark variant
<button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
```
**Why bad:** Hover state breaks in dark mode
**Instead:** `bg-muted hover:bg-accent` (both semantic, both switch)

### 4. Inline Styles with Colors
```typescript
// BAD: Can't respond to theme changes
<div style={{ backgroundColor: '#ffffff' }}>
```
**Why bad:** Bypasses Tailwind dark mode system
**Instead:** Use Tailwind classes or CSS variables if inline styles required

### 5. Assuming All Grays are the Same Semantic Role
```typescript
// BAD: All grays become 'muted'
text-gray-400 → text-muted-foreground
text-gray-600 → text-muted-foreground
text-gray-900 → text-muted-foreground
```
**Why bad:** Loses hierarchy and contrast
**Instead:** Map based on semantic meaning:
- Primary text: `text-foreground` (gray-900)
- Secondary text: `text-muted-foreground` (gray-600)
- Disabled/tertiary: `text-muted-foreground/70` (gray-400)

### 6. Skipping suppressHydrationWarning
```typescript
// BAD: Will cause hydration warnings
<html lang="en">
```
**Why bad:** Next-themes modifies html class on client, SSR mismatch
**Instead:** `<html lang="en" suppressHydrationWarning>`

## Design System Consistency Improvements

Beyond dark mode, establish consistent patterns:

### Color Palette
**Semantic roles defined:**
- Background: Page background (white / dark gray)
- Foreground: Primary text (near-black / near-white)
- Card: Elevated surface (white / slightly lighter dark)
- Muted: Subtle backgrounds (gray-50 / gray-800)
- Border: Dividers and outlines (gray-200 / gray-700)
- Accent: Interactive hover states (gray-100 / gray-750)
- Primary: Brand color (blue-500 / blue-400)
- Destructive: Danger actions (red-600 / red-500)

**Usage guidelines:**
- Page backgrounds: `bg-background`
- Cards and panels: `bg-card`
- Primary text: `text-foreground`
- Secondary text: `text-muted-foreground`
- Interactive backgrounds: `bg-muted hover:bg-accent`

### Spacing Scale
**Already using Tailwind defaults (good):**
- Component padding: `p-4` or `p-6` (consistent)
- Component gaps: `gap-4` or `gap-6`
- Section spacing: `space-y-6` or `space-y-8`

**Recommendation:** Document standard spacing patterns
- Small components (badges, inputs): `px-3 py-1.5` or `px-4 py-2`
- Cards: `p-6` for content, `px-6 py-4` for headers
- Page sections: `space-y-8` for major sections, `space-y-4` for related items

### Typography Hierarchy
**Current:** Only Inter font configured
**Recommendation:** Define semantic text styles
```typescript
// In Tailwind config or CSS
.text-heading-1 { @apply text-3xl font-bold text-foreground }
.text-heading-2 { @apply text-2xl font-bold text-foreground }
.text-heading-3 { @apply text-lg font-semibold text-foreground }
.text-body { @apply text-sm text-foreground }
.text-caption { @apply text-xs text-muted-foreground }
```

**Or use classes directly:**
- Page titles: `text-2xl font-bold text-foreground`
- Section titles: `text-lg font-semibold text-foreground`
- Body text: `text-sm text-foreground`
- Secondary text: `text-sm text-muted-foreground`
- Captions: `text-xs text-muted-foreground`

### Component Variants
**Standardize Button variants:**
- Primary: Call-to-action (already defined)
- Secondary: Less prominent actions (update with semantic colors)
- Outline: Alternative style (update with semantic colors)
- Ghost: Minimal style (update with semantic colors)
- Danger: Destructive actions (already defined)

**Standardize Badge variants:**
- Default: Neutral information
- Severity levels: Critical, high, medium, low (already defined, add dark variants)
- Status: Success, warning, error (already defined, add dark variants)

## File Structure Changes

**New files to create:**
```
src/
├── components/
│   ├── theme-provider.tsx        # NEW: next-themes wrapper
│   └── theme-toggle.tsx           # NEW: theme switcher UI
```

**Files to modify:**
```
src/
├── app/
│   ├── layout.tsx                 # MODIFY: Add ThemeProvider, suppressHydrationWarning
│   ├── globals.css                # MODIFY: Add CSS variables, dark variants
│   └── dashboard/
│       └── layout.tsx             # MODIFY: Add ThemeToggle to header
├── components/
│   └── ui/
│       ├── card.tsx               # MODIFY: Semantic colors
│       ├── button.tsx             # MODIFY: Semantic colors
│       ├── badge.tsx              # MODIFY: Dark variants
│       └── input.tsx              # MODIFY: Semantic colors
└── tailwind.config.ts             # MODIFY: Add darkMode, extend colors
```

## Testing Strategy

### Per-Phase Testing
After each migration phase:
1. **Visual regression:** Check affected pages in light mode (should look identical)
2. **Dark mode check:** Toggle to dark mode, verify all elements visible and styled
3. **Interaction testing:** Hover, focus, click states work in both modes
4. **Browser DevTools:** Check for console warnings (hydration, missing styles)

### Final QA Checklist
- [ ] All pages render correctly in light mode
- [ ] All pages render correctly in dark mode
- [ ] Theme toggle switches immediately (no flash)
- [ ] Theme persists across page navigation
- [ ] Theme persists across browser sessions (localStorage)
- [ ] System theme detection works (test with OS theme change)
- [ ] No hydration warnings in console
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All hover states visible in both modes
- [ ] All focus states visible in both modes (keyboard navigation)
- [ ] Icons (Lucide) visible in both modes (currentColor works)
- [ ] Form inputs readable in both modes
- [ ] Dropdowns/modals styled for both modes (NotificationDropdown)
- [ ] Loading states visible in both modes (Loader2 spinner)

### Tools
- **Browser DevTools:** Lighthouse audit for contrast ratios
- **Manual testing:** Toggle between themes extensively
- **System theme test:** Change OS dark mode while app open
- **Persistence test:** Close browser, reopen, verify theme remembered

## Success Criteria

**Functional requirements:**
- [ ] Dark mode toggle present and functional in dashboard header
- [ ] Theme preference persists across sessions (localStorage)
- [ ] System theme detection works (respects prefers-color-scheme)
- [ ] No flash of unstyled content on page load
- [ ] All existing functionality works in both modes

**Visual requirements:**
- [ ] Consistent color usage (no hardcoded gray-* except for specific exceptions)
- [ ] All text readable in both modes (sufficient contrast)
- [ ] All interactive elements have clear hover/focus states in both modes
- [ ] Cards, buttons, inputs visually consistent across app
- [ ] Brand colors (primary blue) used consistently for CTAs

**Technical requirements:**
- [ ] No hydration warnings in console
- [ ] No TypeScript errors from theme changes
- [ ] Semantic color tokens documented in code comments
- [ ] Migration approach documented for future components

**Performance:**
- [ ] No noticeable delay when switching themes (<100ms perceived)
- [ ] No layout shift when theme loads (suppressHydrationWarning works)

## Sources

This research is based on current Next.js 14 and Tailwind CSS best practices for 2026:

- [Implementing a light/dark mode toggle with app router + RSC · vercel/next.js · Discussion #53063](https://github.com/vercel/next.js/discussions/53063)
- [How to implement light & dark mode in Next.js 14 with Tailwind (2 methods) | Joel Olawanle](https://joelolawanle.com/blog/light-dark-mode-nextjs-app-router-tailwind)
- [Light & Dark Mode in Next.js App Router + Tailwind with No Flicker | Dave Gray](https://www.davegray.codes/posts/light-dark-mode-nextjs-app-router-tailwind)
- [GitHub - pacocoursey/next-themes: Perfect Next.js dark mode in 2 lines of code](https://github.com/pacocoursey/next-themes)
- [Dark Mode with Design Tokens in Tailwind CSS](https://www.richinfante.com/2024/10/21/tailwind-dark-mode-design-tokens-themes-css)
- [GitHub - nareshbhatia/tailwindcss-dark-mode-semantic-colors: Demo of implementing dark mode using Tailwind CSS and semantic color tokens](https://github.com/nareshbhatia/tailwindcss-dark-mode-semantic-colors)
- [Theme variables - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/theme)
- [Dark mode - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/dark-mode)
- [Tailwind CSS Best Practices 2025-2026: Design Tokens, Typography & Responsive Patterns | FrontendTools](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Scaling a design system with Tailwind CSS | Nearform](https://nearform.com/digital-community/scaling-a-design-system-with-tailwind-css/)

---
*Architecture research completed 2026-01-27*
