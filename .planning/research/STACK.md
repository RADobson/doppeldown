# Stack Research: v1.2 Polish & Dark Mode

**Project:** DoppelDown v1.2
**Focus:** Landing page redesign, UI polish, dark mode implementation
**Researched:** 2026-01-27
**Overall confidence:** HIGH

## Executive Summary

For v1.2's polish milestone, minimal stack additions are needed. The existing Next.js 14 + Tailwind CSS foundation is solid. Add `next-themes` for dark mode (industry standard, zero-flicker), optionally add `shadcn/ui` for pre-built components if landing page needs complex UI elements, and upgrade `lucide-react` to latest. **Avoid** heavy component libraries or animation frameworks - they're overkill for a polish pass.

## Current Stack Analysis

**Already in place:**
- `tailwindcss: ^3.4.17` - Current stable version (v3.4 series)
- `clsx: ^2.1.1` - Conditional classes (current)
- `tailwind-merge: ^2.6.0` - Class conflict resolution (current for Tailwind v3)
- `lucide-react: ^0.469.0` - Icons (slightly outdated, latest is 0.562.0)
- Custom color palette defined in `tailwind.config.ts`
- Basic animations in `globals.css`

**Assessment:** Solid foundation. No major changes needed, just targeted additions.

---

## Recommended Additions

### Dark Mode Foundation

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `next-themes` | `^0.4.6` | Dark mode state management | Industry standard for Next.js, zero-flicker implementation, handles system preferences, 2172 projects use it |

**Rationale:**
- Integrates perfectly with Tailwind's `dark:` classes
- No flash on page load (critical for UX)
- Handles system preference detection automatically
- Supports persistent user choice
- Lightweight (~2KB gzipped)

**Installation:**
```bash
npm install next-themes
```

**Configuration required:**
1. Set `darkMode: 'class'` in `tailwind.config.ts`
2. Wrap app in `<ThemeProvider>` component
3. Add `suppressHydrationWarning` to `<html>` tag
4. Update all color usage to support dark mode variants

---

### Optional: Component Primitives (if complex UI needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `shadcn/ui` | CLI-based | Pre-built accessible components | Only if landing page needs modals, dropdowns, tabs, etc. |

**Rationale:**
- NOT a traditional library - copies components into your codebase
- Built on Radix UI primitives (accessibility baked in)
- Styled with Tailwind (matches existing approach)
- Only install what you need (tree-shakeable by nature)
- 104K+ GitHub stars, 560K+ weekly npm downloads

**When to skip:**
- If landing page is mostly static content
- If existing components suffice
- To avoid complexity creep

**Installation (only if needed):**
```bash
npx shadcn@latest init
```

CLI will:
- Configure `components.json`
- Add required dependencies (`class-variance-authority`, `tailwindcss-animate`)
- Create `lib/utils.ts` with `cn()` helper

**Then install specific components:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
```

---

### Upgrade Existing

| Library | Current | Latest | Action |
|---------|---------|--------|--------|
| `lucide-react` | 0.469.0 | 0.562.0 | Upgrade for latest icons |

**Command:**
```bash
npm update lucide-react
```

---

## Integration Notes

### Dark Mode Implementation Strategy

**1. Tailwind Configuration**

Update `tailwind.config.ts`:
```typescript
const config: Config = {
  darkMode: 'class', // ADD THIS
  content: [...],
  theme: {
    extend: {
      colors: {
        // Existing colors work fine
        // Just add dark: variants where needed
      },
    },
  },
  plugins: [],
}
```

**2. CSS Variables Approach**

Update `globals.css` to use semantic color variables:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... etc */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... etc */
}
```

**Why CSS variables:**
- Single source of truth for colors
- Automatic theme switching without class duplication
- Easier to maintain semantic color names

**3. Component Pattern**

Every component needs dark mode consideration:
```tsx
// Before
<div className="bg-white text-gray-900 border-gray-200">

// After
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
```

**4. Provider Setup**

Create `src/components/theme-provider.tsx`:
```tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

Update `src/app/layout.tsx`:
```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

---

### Landing Page Polish Strategy

**Use existing tools first:**
- Tailwind's extensive utility classes for layout/spacing
- Existing `lucide-react` icons for visual elements
- Custom animations already in `globals.css`

**Add shadcn/ui components only if needed for:**
- Testimonial carousels
- Interactive feature tabs
- Pricing comparison tables
- Modal CTAs

**Don't add:**
- Animation libraries (Framer Motion overkill for static landing page)
- Full component libraries (MUI, Chakra - conflicts with existing Tailwind setup)
- CSS-in-JS solutions (unnecessary complexity)

---

## NOT Recommended

### Component Libraries to AVOID

| Library | Why Avoid |
|---------|-----------|
| Material UI (MUI) | Opinionated design system, conflicts with Tailwind, heavy bundle (~300KB) |
| Chakra UI | Different styling paradigm, requires theme provider migration, unnecessary overhead |
| Ant Design | Enterprise-focused, excessive for SaaS landing page, not Tailwind-native |

**Reason:** You already have Tailwind CSS. These libraries impose their own design systems and increase bundle size significantly. Tailwind + shadcn/ui (if needed) provides everything required.

### Animation Libraries to AVOID

| Library | Why Avoid |
|---------|-----------|
| Framer Motion | Overkill for polish pass (12KB+), adds complexity, existing CSS animations sufficient |
| GSAP | Even heavier, primarily for complex interactive experiences |
| React Spring | Physics-based animations unnecessary for business SaaS |

**Reason:** Landing page polish needs subtle transitions, not complex animations. Existing CSS animations in `globals.css` + Tailwind's transition utilities cover 95% of needs. If complex animations are absolutely required later, add Framer Motion incrementally.

### Styling Utilities to AVOID

| Library | Why Avoid |
|---------|-----------|
| Styled Components | CSS-in-JS conflicts with Tailwind philosophy, runtime overhead |
| Emotion | Same as styled-components, adds bundle size |
| `classnames` package | You already have `clsx` (same purpose, lighter) |

**Reason:** Tailwind + `clsx` + `tailwind-merge` (already installed) is the modern standard. CSS-in-JS adds unnecessary runtime cost and conflicts with Tailwind's utility-first approach.

---

## Installation Summary

**Required (for dark mode):**
```bash
npm install next-themes
```

**Optional (only if complex landing page UI needed):**
```bash
npx shadcn@latest init
npx shadcn@latest add [component-name]
```

**Upgrade existing:**
```bash
npm update lucide-react
```

**Total bundle impact:** ~2KB (next-themes only) to ~15KB (next-themes + shadcn/ui components)

---

## Configuration Checklist

- [ ] Add `darkMode: 'class'` to `tailwind.config.ts`
- [ ] Install `next-themes`
- [ ] Create `ThemeProvider` component
- [ ] Wrap app in `ThemeProvider` in `layout.tsx`
- [ ] Add `suppressHydrationWarning` to `<html>` tag
- [ ] Convert `globals.css` to CSS variables for semantic colors
- [ ] Add dark mode variants to existing components
- [ ] Create theme toggle component
- [ ] Test system preference detection
- [ ] Test manual theme switching
- [ ] Test persistence across page reloads

---

## Sources

**Dark Mode:**
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- [next-themes npm](https://www.npmjs.com/package/next-themes)
- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode)
- [How to implement dark mode in Next.js 14 with Tailwind](https://joelolawanle.com/blog/light-dark-mode-nextjs-app-router-tailwind)
- [shadcn/ui Dark Mode guide](https://ui.shadcn.com/docs/dark-mode/next)

**Component Libraries:**
- [15 Best React UI Libraries for 2026](https://www.builder.io/blog/react-component-libraries-2026)
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)
- [Headless UI vs Radix UI comparison](https://fenilsonani.com/articles/headlessui-vs-readixui)

**Utilities:**
- [Lucide React docs](https://lucide.dev/guide/packages/lucide-react)
- [lucide-react npm](https://www.npmjs.com/package/lucide-react)
- [tailwind-merge npm](https://www.npmjs.com/package/tailwind-merge)
- [clsx and tailwind-merge guide](https://shnoman97.medium.com/simplify-your-tailwind-css-class-management-with-merge-and-clsx-42f1e2458fd8)

**Animation:**
- [Motion (formerly Framer Motion)](https://motion.dev/)
- [Beyond Eye Candy: Top React Animation Libraries 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries)
