# Project Milestones: DoppelDown

## v1.2 Polish for Launch (Shipped: 2026-01-28)

**Delivered:** Launch-ready product with distinctive branding, dark-themed landing page, professional UI polish, semantic color system, fully functional dark mode, and scannable dashboard.

**Phases completed:** 6-10 (16 plans total)

**Key accomplishments:**
- Distinctive "doppel_down" text logo with favicon suite and OG images
- Conversion-optimized landing page with honest copy and interactive threat scan demo
- Professional UI polish: loading skeletons, empty states, focus-visible accessibility
- Semantic color system enabling theme support (HSL CSS variables)
- Fully functional dark mode with system preference detection and persistence
- F-pattern dashboard layout with progressive disclosure for reduced cognitive load

**Stats:**
- 104 files modified
- +12,555 / -1,423 lines changed
- 5 phases, 16 plans, ~40 tasks
- 2 days from start to ship

**Git range:** `docs(06)` → `docs(10)`

**What's next:** Launch outreach, user feedback, then v1.3 based on real usage

---

## v1.1 Features (Shipped: 2026-01-28)

**Delivered:** In-app notifications, social platform selection per brand, NRD monitoring for Enterprise tier.

**Quick feature additions** (no formal phase structure)

**Git tag:** v1.1

---

## v1.0 Production-Ready Platform (Shipped: 2026-01-27)

**Delivered:** Production-ready brand protection platform with tier enforcement, reliable scanning, automated background jobs, and configurable email alerts.

**Phases completed:** 1-5 (11 plans total)

**Key accomplishments:**
- Admin infrastructure with `is_admin` column and universal bypass pattern
- Reliable scanning with rate-limited queues (p-queue), retry with exponential backoff, graceful error handling
- Real-time progress UI with percentage, step labels, and cancel button
- Tier enforcement with brand count limits and manual scan quotas (Free: 1/week)
- Automated background scanning with tier-based frequencies (Starter=daily, Pro=6hr, Enterprise=hourly)
- Configurable email alerts with severity threshold, scan summaries, and weekly digest

**Stats:**
- 63 files created/modified
- 15,152 lines of TypeScript (8,659 added this milestone)
- 5 phases, 11 plans, ~65 tasks
- 4 days from start to ship

**Git range:** `feat(01-01)` → `feat(05-03)`

**What's next:** v1.1 — NRD monitoring, social platform selection, additional alerting channels

---
