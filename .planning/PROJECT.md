# DoppelDown

## What This Is

Brand protection SaaS that detects typosquatting domains, lookalike websites, and fake social accounts threatening a company's brand. Built for businesses who want automated monitoring and actionable takedown reports. Differentiator: AI-powered threat analysis that scores visual similarity and phishing intent, not just domain pattern matching.

## Core Value

**Detect real threats, not noise.** AI analysis distinguishes actually-dangerous impersonation sites from benign domain registrations — so users act on what matters.

## Requirements

### Validated

- ✓ User authentication (email/password via Supabase) — existing
- ✓ Subscription tiers with Stripe (Free/Starter/Pro/Enterprise) — existing
- ✓ Brand CRUD with tier-based limits — existing
- ✓ Domain variation generation (500+ typosquats, homoglyphs, TLD swaps) — existing
- ✓ Web scanning via search API — existing
- ✓ Social media account scanning — existing
- ✓ Evidence collection (screenshots, WHOIS, HTML snapshots) — existing
- ✓ PDF report generation for takedowns — existing
- ✓ Dashboard with brand/threat overview — existing
- ✓ AI visual similarity analysis (GPT-4o-mini vision comparing screenshots) — existing
- ✓ AI phishing intent detection (credential harvesting, urgency signals) — existing
- ✓ Smart threat scoring (weighted composite: domain 35%, visual 40%, phishing 25%) — existing
- ✓ Admin accounts with `is_admin` column and tier bypass — v1.0
- ✓ Tier enforcement with brand count limits (Free=1, Starter=3, Pro=10, Enterprise=unlimited) — v1.0
- ✓ Rate-limited scanning queues with graceful error handling — v1.0
- ✓ Auto-retry with exponential backoff for failed scans — v1.0
- ✓ Real-time scan progress UI with cancel button — v1.0
- ✓ Manual scan quotas (Free: 1/week, Paid: unlimited) — v1.0
- ✓ Automated background scanning per tier (Starter=daily, Pro=6hr, Enterprise=hourly) — v1.0
- ✓ Email alerts with severity threshold configuration — v1.0
- ✓ Scan completion summary emails — v1.0
- ✓ Weekly digest emails — v1.0

### Active

(None yet — define in next milestone)

### Out of Scope

- Mobile app — web-first, defer to later
- OAuth login — email/password sufficient for launch
- Real-time chat support — not needed for v1
- Multi-language support — English only for launch
- API for third-party integrations — internal use only for now

## Context

- **Current state**: v1.0 shipped with 15,152 LOC TypeScript
- **Tech stack**: Next.js 14, Supabase, Stripe, p-queue for rate limiting
- **AI providers**: Claude and OpenAI Vision APIs for threat analysis
- **Launch strategy**: Cold outreach to prospects, demo by scanning their brand live
- **Codebase mapped**: `.planning/codebase/` contains architecture and stack analysis

## Constraints

- **Tech stack**: Next.js 14, Supabase, Stripe (committed)
- **AI providers**: Claude Vision or GPT-4 Vision for image analysis
- **Budget**: AI API costs per scan should be reasonable (batch where possible)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| AI for threat scoring | Rule-based scoring too noisy, AI can assess actual danger | ✓ Good |
| Visual similarity via Vision API | Screenshots already captured, leverage for comparison | ✓ Good |
| Cold outreach go-to-market | Fastest path to revenue, prove value with live scans | — Pending |
| Admin bypass pattern `!userData?.is_admin &&` | Consistent, greppable, null-safe | ✓ Good |
| Enterprise tier uses MAX_SAFE_INTEGER | Semantic clarity for unlimited | ✓ Good |
| Provider-specific rate limit queues | Prevents 429 cascades, different APIs have different limits | ✓ Good |
| Rolling 7-day quota window | Simpler than calendar week, fairer to users | ✓ Good |
| Hours-based scan frequency | More granular than days, supports Enterprise hourly | ✓ Good |
| Severity threshold with fallback chain | Backward compatible with existing alert_on_severity | ✓ Good |

---
*Last updated: 2026-01-27 after v1.0 milestone*
