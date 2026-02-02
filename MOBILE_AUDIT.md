# Mobile Responsiveness Audit — DoppelDown

**Date:** 3 February 2026  
**Auditor:** Claude (automated audit)  
**Commit:** `8567ee4`

---

## Summary

Full audit of all pages in the DoppelDown SaaS app for mobile responsiveness issues. The codebase was already in reasonably good shape — many responsive patterns (sidebar slide-out, flex-wrap filters, responsive grids) were already implemented in prior commits.

**3 new issues found and fixed.** All previously-identified issues were already resolved.

---

## Issues Found & Fixed (This Audit)

### 1. Brand Detail — "Last Scan" Stat Card Text Overflow
**File:** `src/app/dashboard/brands/[id]/page.tsx`  
**Problem:** The "Last Scan" date/time text in the stats grid could overflow its container on narrow mobile screens (especially in the 2-col grid at `grid-cols-2`), causing horizontal scroll or text overlap.  
**Fix:** Added `min-w-0` to the text container div, `truncate` to the date text, and responsive text sizing (`text-xs sm:text-sm`) so the date degrades gracefully on small screens.

### 2. Global Horizontal Scroll Prevention
**File:** `src/app/globals.css`  
**Problem:** Despite individual component fixes, edge cases could still cause `overflow-x` on mobile (e.g. scale transforms, wide tables in compare pages). No global safety net existed.  
**Fix:** Added `overflow-x: hidden` on both `html` and `body` elements as a defensive measure to prevent any horizontal scroll on mobile devices.

### 3. DemoPreview Input/Button Layout on Mobile
**File:** `src/components/landing/DemoPreview.tsx`  
**Problem:** The domain input and "Scan" button were in a horizontal `flex` layout that became cramped on narrow screens (<375px), with the button being too narrow to tap comfortably.  
**Fix:** Changed to `flex-col sm:flex-row` so input and button stack vertically on mobile. Added `w-full sm:w-auto` to the scan button so it's full-width on mobile for better tap targets.

---

## Previously Resolved Issues (Already in Codebase)

The following issues were checked and confirmed already fixed:

| Area | Issue | Status |
|------|-------|--------|
| Landing Pricing | 4-col grid too tight at md breakpoint | ✅ `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| Landing Footer | 4-col grid jump at md | ✅ `grid-cols-2 md:grid-cols-4` |
| Landing Hero Nav | Login/Signup buttons crowded on mobile | ✅ Responsive spacing + text sizing |
| Threat Detail Analysis | Hardcoded 3-col grid | ✅ `grid-cols-1 sm:grid-cols-3` |
| Threat Detail Evidence | Button row overflow | ✅ `flex-wrap` + responsive layout |
| Threat Detail Header | Action buttons too wide on mobile | ✅ Responsive button labels |
| Threats List Filters | Dropdowns overflow | ✅ `flex-wrap w-full md:w-auto` |
| Threats List Badges | Metadata badges overflow | ✅ `flex-wrap` on badge row |
| Dashboard Onboarding | Social handles 2-col grid on mobile | ✅ `grid-cols-1 sm:grid-cols-2` |
| Pricing Page | `scale-105` causing overflow | ✅ `md:scale-105` (only at md+) |
| Pricing Page | Heading too large on mobile | ✅ `text-3xl md:text-5xl` |
| Compare Pages | Tables need horizontal scroll | ✅ `overflow-x-auto` + `min-w-[600px]` |
| Reports Page | Action buttons not wrapping | ✅ `flex-wrap` on button row |
| Notification Dropdown | Could clip off-screen on mobile | ✅ Responsive width `w-[calc(100vw-2rem)] sm:w-80` |
| Dashboard Layout | Mobile sidebar | ✅ Slide-out with backdrop |
| Auth Pages | Form layout on mobile | ✅ Already responsive (sm:max-w-md) |
| Legal Pages | Content width | ✅ `max-w-4xl mx-auto px-4` |
| Brand Detail Header | Scan button width | ✅ `w-full sm:w-auto` |
| Brand Detail Scan History | Tight layout on mobile | ✅ `flex-col sm:flex-row` |

---

## Pages Audited

1. **Landing page** (`src/app/page.tsx` + all `components/landing/`) — ✅
2. **Auth pages** (`src/app/auth/login`, `signup`, `forgot-password`, `reset-password`) — ✅
3. **Dashboard layout** (`src/app/dashboard/layout.tsx`) — ✅
4. **Dashboard home** (`src/app/dashboard/page.tsx` + onboarding flow) — ✅
5. **Brands list** (`src/app/dashboard/brands/page.tsx`) — ✅
6. **Brand detail** (`src/app/dashboard/brands/[id]/page.tsx`) — ✅
7. **New brand** (`src/app/dashboard/brands/new/page.tsx`) — ✅
8. **Threats list** (`src/app/dashboard/threats/page.tsx`) — ✅
9. **Threat detail** (`src/app/dashboard/threats/[id]/page.tsx`) — ✅
10. **Reports list** (`src/app/dashboard/reports/page.tsx`) — ✅
11. **New report** (`src/app/dashboard/reports/new/page.tsx`) — ✅
12. **Settings** (`src/app/dashboard/settings/page.tsx`) — ✅
13. **Pricing** (`src/app/pricing/page.tsx`) — ✅
14. **Privacy policy** (`src/app/privacy/page.tsx`) — ✅
15. **Terms of service** (`src/app/terms/page.tsx`) — ✅
16. **Compare: Red Points** (`src/app/compare/red-points/page.tsx`) — ✅
17. **Compare: BrandShield** (`src/app/compare/brandshield/page.tsx`) — ✅
18. **Compare: PhishLabs** (`src/app/compare/phishlabs/page.tsx`) — ✅
19. **NotificationDropdown** (`src/components/NotificationDropdown.tsx`) — ✅

---

## Build Verification

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (41/41)
```

No build errors introduced.
