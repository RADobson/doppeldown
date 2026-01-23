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

### Active

- [ ] AI visual similarity analysis (compare screenshots to brand's official site)
- [ ] AI phishing intent detection (analyze page content for credential harvesting, urgency)
- [ ] Smart threat scoring (combine domain type + visual match + content intent)
- [ ] Email alerts when new threats detected
- [ ] Fix/harden existing scanning flows (untested, potential bugs)
- [ ] Automated background scanning with scheduled jobs

### Out of Scope

- Mobile app — web-first, defer to later
- OAuth login — email/password sufficient for launch
- Real-time chat support — not needed for v1
- Multi-language support — English only for launch
- API for third-party integrations — internal use only for now

## Context

- **Existing codebase**: Full Next.js 14 app with Supabase + Stripe already integrated
- **AI access**: Both Claude and OpenAI Vision APIs available
- **Launch strategy**: Cold outreach to prospects, demo by scanning their brand live
- **Timeline**: Weekend sprint (~30+ hours)
- **Codebase mapped**: `.planning/codebase/` contains architecture and stack analysis

## Constraints

- **Timeline**: Must be demo-ready by end of weekend
- **Tech stack**: Next.js 14, Supabase, Stripe (already committed)
- **AI providers**: Claude Vision or GPT-4 Vision for image analysis
- **Budget**: AI API costs per scan should be reasonable (batch where possible)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| AI for threat scoring | Rule-based scoring too noisy, AI can assess actual danger | — Pending |
| Visual similarity via Vision API | Screenshots already captured, leverage for comparison | — Pending |
| Cold outreach go-to-market | Fastest path to revenue, prove value with live scans | — Pending |

---
*Last updated: 2026-01-23 after initialization*
