# Phase 13: Delete UI - Research

**Researched:** 2026-01-29
**Domain:** React mobile UI gestures, delete interactions, accessibility
**Confidence:** HIGH

## Summary

This phase implements swipe-to-delete gestures and 3-dots context menu delete options for scan, threat, and report list items in the DoppelDown dashboard. The backend DELETE endpoints were completed in Phase 12, so this phase focuses solely on UI/UX patterns.

**Key findings:**
- React swipe gesture libraries exist but add complexity; CSS transforms + touch events may be simpler for this use case
- 3-dots (kebab) menu pattern already implemented in brands page (`src/app/dashboard/brands/page.tsx`), can be reused
- Instant delete without confirmation requires undo functionality for good UX (but user explicitly requested no confirmation)
- Lucide-react already has `MoreVertical` icon in use, `Trash2` icon available for delete
- Mobile swipe gestures require careful accessibility consideration (touch targets, screen reader support)

**Primary recommendation:** Implement 3-dots menu delete first (reusing existing pattern), then add optional swipe-to-delete as enhancement. Both trigger same DELETE API calls to Phase 12 endpoints.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | UI framework | Already in use, client components for interaction |
| Next.js | 14.2.35 | Framework | App Router with client components for gestures |
| lucide-react | ^0.469.0 | Icons | Already has MoreVertical, Trash2 icons needed |
| Tailwind CSS | ^3.4.17 | Styling | Already used for hover states, transitions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-swipeable | ^7.0.2 | Swipe gestures | IF implementing swipe-to-delete (optional) |
| clsx | ^2.1.1 | Class conditionals | Already in use for dynamic styles |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-swipeable | Custom touch handlers | More control but more code; swipeable is battle-tested |
| react-swipeable | react-swipe-to-delete-component | Purpose-built but less maintained, last update 2019 |
| react-swipeable | Framer Motion | Powerful but heavy dependency for simple swipe |
| 3-dots menu | Custom dropdown | Already have working pattern in brands page |

**Installation (if adding react-swipeable):**
```bash
npm install react-swipeable
```

## Architecture Patterns

### Recommended Project Structure
```
src/app/dashboard/
├── threats/page.tsx         # Add delete menu to list items
├── reports/page.tsx         # Add delete menu to report cards
└── brands/[id]/page.tsx     # Add delete menu to scan list

src/components/ui/
├── swipeable-list-item.tsx  # Optional: Reusable swipe wrapper
└── delete-menu.tsx          # Optional: Extracted menu component
```

### Pattern 1: 3-Dots Kebab Menu (RECOMMENDED FIRST)

**What:** Context menu triggered by vertical 3-dot icon, shows delete option
**When to use:** Primary delete mechanism for all list items
**Example from brands page:**

```typescript
// src/app/dashboard/brands/page.tsx lines 200-251
const [showMenu, setShowMenu] = useState<string | null>(null)

<div className="absolute top-4 right-4">
  <button
    onClick={() => setShowMenu(showMenu === brand.id ? null : brand.id)}
    className="p-1 text-muted-foreground hover:text-muted-foreground rounded"
  >
    <MoreVertical className="h-5 w-5" />
  </button>
  {showMenu === brand.id && (
    <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
      <button
        onClick={() => handleDelete(brand.id)}
        disabled={actionLoading === brand.id}
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Brand
      </button>
    </div>
  )}
</div>
```

**Adaptations needed for threats/scans/reports:**
- Position menu relative to list item layout (top-right for cards, inline-right for rows)
- Call appropriate DELETE endpoint (`/api/threats/[id]`, `/api/scans/[id]`, `/api/reports/[id]`)
- Update local state to remove item from list immediately
- Show loading state during delete

### Pattern 2: Swipe-to-Delete Gesture (OPTIONAL ENHANCEMENT)

**What:** Horizontal swipe left reveals delete button, swipe completion triggers delete
**When to use:** Mobile-first experience, when users expect iOS/Android-style interactions
**Example pattern with react-swipeable:**

```typescript
import { useSwipeable } from 'react-swipeable'

function SwipeableListItem({ item, onDelete }) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      // Only allow left swipe (negative delta)
      if (eventData.deltaX < 0) {
        setSwipeOffset(Math.max(eventData.deltaX, -80))
        setIsSwiping(true)
      }
    },
    onSwipedLeft: (eventData) => {
      // If swiped far enough, show delete button
      if (Math.abs(eventData.deltaX) > 40) {
        setSwipeOffset(-80)
      } else {
        setSwipeOffset(0)
      }
      setIsSwiping(false)
    },
    onSwiped: () => {
      setIsSwiping(false)
    },
    trackMouse: true, // Enable mouse swipe for desktop testing
    preventScrollOnSwipe: true
  })

  return (
    <div className="relative overflow-hidden">
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out'
        }}
        className="bg-card"
      >
        {/* List item content */}
      </div>
      {swipeOffset < 0 && (
        <button
          onClick={() => onDelete(item.id)}
          className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white flex items-center justify-center"
          style={{ transform: `translateX(${80 + swipeOffset}px)` }}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
```

**Note:** Swipe pattern adds complexity (touch event handling, animation states, accessibility challenges). Start with 3-dots menu, add swipe as v2 if users request it.

### Pattern 3: Delete Handler with Optimistic Updates

**What:** Call DELETE endpoint, immediately update UI, rollback on error
**When to use:** All delete actions for instant feedback
**Example:**

```typescript
const [deleting, setDeleting] = useState<string | null>(null)

async function handleDelete(id: string) {
  setDeleting(id)

  // Optimistically remove from UI
  const itemBackup = items.find(i => i.id === id)
  setItems(items.filter(i => i.id !== id))

  try {
    const response = await fetch(`/api/threats/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Delete failed')

    // Success - item already removed from UI
    setDeleting(null)
  } catch (error) {
    console.error('Delete error:', error)
    // Rollback - restore item to UI
    if (itemBackup) {
      setItems(prev => [...prev, itemBackup].sort((a, b) =>
        new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
      ))
    }
    alert('Failed to delete item. Please try again.')
    setDeleting(null)
  }
}
```

### Anti-Patterns to Avoid

- **Don't use window.confirm():** Brands page uses it (line 88), but better UX is inline confirmation or undo toast
- **Don't swipe both directions:** Only swipe-left-to-delete; swiping right typically means "archive" or "mark as read"
- **Don't block delete during loading:** Show loading state but allow UI interaction
- **Don't forget click-outside:** Close 3-dots menu when clicking outside (add event listener)
- **Don't skip accessibility:** Swipe gestures need keyboard alternatives (Enter key on delete button)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe gesture detection | Custom touchstart/touchmove handlers | react-swipeable | Handles passive listeners, edge cases, mouse fallback |
| Menu positioning | Manual coordinate calculation | CSS absolute positioning + Tailwind | Simpler, responsive, already in use |
| Optimistic updates | Manual state sync | React useState pattern above | Proven pattern, handles rollback cleanly |
| Icons | SVG files or icon font | lucide-react | Already installed, tree-shakeable, TypeScript support |
| Click outside detection | Manual document event listener | useEffect with ref | Standard React pattern, cleanup handled |

**Key insight:** The brands page already has a working 3-dots menu pattern. Don't rebuild it; extract and reuse the pattern for threats/scans/reports.

## Common Pitfalls

### Pitfall 1: Swipe Conflicts with Scroll

**What goes wrong:** Vertical scrolling on mobile gets blocked by horizontal swipe detection
**Why it happens:** Touch event handlers prevent default behavior to detect swipe direction
**How to avoid:** Use `preventScrollOnSwipe: true` option carefully; only prevent when horizontal swipe confirmed
**Warning signs:** Users report "can't scroll" on mobile; page feels janky

### Pitfall 2: Menu Doesn't Close on Outside Click

**What goes wrong:** 3-dots menu stays open after clicking elsewhere, cluttering UI
**Why it happens:** No document-level click listener to detect outside clicks
**How to avoid:** Add useEffect to listen for clicks and close menu if target is outside
```typescript
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(null)
    }
  }
  if (showMenu) {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }
}, [showMenu])
```
**Warning signs:** Users complain menus "get stuck open"

### Pitfall 3: Delete Without Feedback

**What goes wrong:** Item disappears instantly with no confirmation user's action succeeded
**Why it happens:** No toast notification or undo option after delete
**How to avoid:** Per phase requirement, no confirmation dialog. But could add subtle toast: "Threat deleted" (optional, NOT required)
**Warning signs:** Users unsure if delete worked; accidentally delete and can't recover

### Pitfall 4: Accessibility - Keyboard Access

**What goes wrong:** Swipe gestures and menu dropdowns can't be accessed via keyboard
**Why it happens:** Only mouse/touch events handled, no keyboard event handlers
**How to avoid:**
- Add `tabIndex={0}` to menu button
- Add `onKeyDown` handler for Enter/Space to open menu
- Add keyboard navigation (arrow keys) within menu
- Ensure delete button is focusable and activatable with Enter
**Warning signs:** Screen reader users report "can't delete items"

### Pitfall 5: Race Condition on Rapid Delete

**What goes wrong:** User clicks delete multiple times rapidly, triggers multiple DELETE requests
**Why it happens:** No debouncing or loading state prevents re-click
**How to avoid:** Set `deleting` state immediately, disable button while `deleting === item.id`
**Warning signs:** Console shows multiple DELETE requests; database errors about missing rows

### Pitfall 6: Mobile Touch Target Too Small

**What goes wrong:** Users struggle to tap 3-dots menu or delete button on mobile
**Why it happens:** Icon/button is smaller than 44x44px minimum touch target
**How to avoid:** Ensure button has `p-2` or larger padding, total touch area ≥44x44px
**Warning signs:** Users report "can't tap the menu button"

## Code Examples

Verified patterns from existing codebase and official sources:

### Existing DELETE Endpoint Call Pattern

Already implemented in Phase 12, ready to use:

```typescript
// Source: src/app/api/threats/[id]/route.ts (lines 6-102)
// DELETE /api/threats/:id
// Returns: { success: true } on 200, { error: string } on 401/404/500

async function deleteItem(id: string, type: 'threats' | 'scans' | 'reports') {
  const response = await fetch(`/api/${type}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Delete failed')
  }

  return response.json() // { success: true }
}
```

### 3-Dots Menu with Close-on-Outside-Click

```typescript
// Pattern extracted from brands page with improvements
import { useState, useEffect, useRef } from 'react'
import { MoreVertical, Trash2 } from 'lucide-react'

function ListItemWithMenu({ item, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <div className="relative">
      {/* List item content */}

      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          aria-label="More options"
          aria-expanded={showMenu}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => {
                onDelete(item.id)
                setShowMenu(false)
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Optimistic Delete with Rollback

```typescript
function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDeleteThreat(id: string) {
    setDeleting(id)

    // Backup for rollback
    const threatBackup = threats.find(t => t.id === id)

    // Optimistically update UI
    setThreats(prev => prev.filter(t => t.id !== id))

    try {
      const response = await fetch(`/api/threats/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      // Success - item already removed
    } catch (error) {
      console.error('Failed to delete threat:', error)

      // Rollback - restore item
      if (threatBackup) {
        setThreats(prev => [...prev, threatBackup].sort(
          (a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
        ))
      }

      alert('Failed to delete threat. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    // ... list items
  )
}
```

### React-Swipeable Basic Setup (Optional)

```typescript
// Source: https://www.npmjs.com/package/react-swipeable
import { useSwipeable } from 'react-swipeable'

function SwipeableItem({ item, onDelete }) {
  const [revealed, setRevealed] = useState(false)

  const handlers = useSwipeable({
    onSwipedLeft: () => setRevealed(true),
    onSwipedRight: () => setRevealed(false),
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  return (
    <div className="relative overflow-hidden">
      <div {...handlers} className="relative z-10 bg-card transition-transform duration-200"
           style={{ transform: revealed ? 'translateX(-80px)' : 'translateX(0)' }}>
        {/* Item content */}
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 text-white flex items-center justify-center"
      >
        <Trash2 />
      </button>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| window.confirm() | Inline confirmation or undo toast | ~2020 | Better mobile UX, non-blocking |
| Manual touch handlers | react-swipeable library | 2019+ | Handles edge cases, passive listeners |
| Delete button only | Swipe + menu options | iOS 7+ (2013) | Mobile-first expectations |
| Immediate delete | Optimistic updates with rollback | React 16+ | Faster perceived performance |

**Deprecated/outdated:**
- **window.confirm():** Brands page still uses it (line 88), but blocks UI and looks dated. Modern pattern: instant delete with undo toast OR inline confirmation (if confirmation needed)
- **react-swipe-to-delete-component:** Last updated 2019, not maintained. Use react-swipeable instead if implementing swipe

## Open Questions

1. **Should swipe-to-delete be implemented in v1 or deferred?**
   - What we know: User requirement says "swipe-to-delete gesture available" but 3-dots menu also required
   - What's unclear: Whether swipe is must-have or nice-to-have for initial launch
   - Recommendation: Start with 3-dots menu (simpler, works on desktop). Add swipe in follow-up task if user feedback requests it. Phase can have multiple plans.

2. **Should we add undo functionality despite "no confirmation" requirement?**
   - What we know: User explicitly said "no confirmation dialog", "instant delete"
   - What's unclear: Whether undo toast (non-blocking) violates "instant delete" intent
   - Recommendation: Implement instant delete as requested. If user testing shows accidental deletes, suggest undo toast as follow-up. Don't add it now.

3. **Where should 3-dots menu be positioned on different screen sizes?**
   - What we know: Brands page uses absolute top-right positioning on cards
   - What's unclear: Threats page uses row layout, not cards. Where does menu go?
   - Recommendation: Top-right for card layouts (reports), inline-right for row layouts (threats list)

4. **Should scan deletion be available from dashboard scan list or only brand detail page?**
   - What we know: Dashboard has scan history on brand detail page (`/dashboard/brands/[id]`)
   - What's unclear: Whether scans appear in a top-level scans list or only within brand context
   - Recommendation: Check if scans list page exists. If yes, add delete menu. If no, add delete to brand detail page scan list.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/app/dashboard/brands/page.tsx` - Working 3-dots menu pattern with delete (lines 200-251)
- Existing codebase: `src/app/api/threats/[id]/route.ts` - DELETE endpoint pattern (Phase 12)
- Existing codebase: `src/app/dashboard/threats/page.tsx` - Current list layout for threats
- Existing codebase: `src/app/dashboard/reports/page.tsx` - Current card layout for reports
- npm package: react-swipeable v7.0.2 - [Official docs](https://www.npmjs.com/package/react-swipeable)
- Lucide icons: [Official icon library](https://lucide.dev/icons/) - MoreVertical, Trash2 confirmed available

### Secondary (MEDIUM confidence)
- [React Swipeable best practices](https://www.dhiwise.com/post/enhancing-user-experience-with-react-swipeable-best-practices) - Performance and UX guidance
- [Material UI Menu component](https://mui.com/material-ui/react-menu/) - Context menu patterns (not using MUI, but patterns apply)
- [LogRocket swipe-to-delete accessibility](https://blog.logrocket.com/ux-design/accessible-swipe-contextual-action-triggers/) - Accessibility challenges and solutions
- [Delete button UI best practices](https://www.designmonks.co/blog/delete-button-ui) - Destructive action patterns
- [NN/G confirmation dialogs](https://www.nngroup.com/articles/confirmation-dialog/) - When to use/skip confirmation
- [UX Movement undo vs confirm](https://uxmovement.com/buttons/how-to-design-destructive-actions-that-prevent-data-loss/) - Undo approach for low-stakes deletes

### Tertiary (LOW confidence)
- react-swipe-to-delete-component - Mentioned in search results but last updated 2019, not recommended
- Various Medium articles on swipe gestures - General patterns but not specific to current versions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use except react-swipeable (optional)
- Architecture: HIGH - Working pattern exists in brands page, can be adapted
- Pitfalls: HIGH - Based on common React/mobile UX issues well-documented in 2026

**Research date:** 2026-01-29
**Valid until:** 60 days (stable domain, libraries mature)
