# DoppelDown Onboarding Optimization Report
*Comprehensive review of friction points, design improvements, and A/B testing plan*
*Generated: 2026-02-05*

---

## Executive Summary

After a deep review of DoppelDown's full onboarding stack — landing page, signup, auth callback, middleware, onboarding wizard, dashboard empty-state, email templates, and analytics infrastructure — I've identified **14 friction points**, prioritized **19 design improvements**, and drafted **12 A/B testing hypotheses**.

**The biggest finding:** There are actually **two competing onboarding flows** in the codebase, creating a fragmented first-time experience. Additionally, the signup page redirects to `/dashboard` instead of `/onboarding` under certain auth configurations, and the messaging around "free forever" vs "14-day trial" is contradictory.

The overall infrastructure is strong — the onboarding wizard, achievements system, adaptive experience engine, and email templates are all well-built. The issues are **flow orchestration and friction**, not missing features.

---

## Part 1: Current Flow Map

### Complete User Path (Happy Path)

```
Landing Page (Hero CTA: "Start Free — No Credit Card")
    │
    ▼
Signup Page (/auth/signup)
    │ Fields: Full Name, Email, Password
    │ CTA: "Create account"
    │
    ├── IF email confirmation ON ──────────────────────┐
    │   Show "Check your email" screen                 │
    │   User leaves app → checks email → clicks link   │
    │   Auth Callback (/auth/callback?type=signup)      │
    │   Redirects to → /onboarding ✅                  │
    │                                                   │
    └── IF email confirmation OFF (auto-confirm) ──────┐
        Redirects to → /dashboard ⚠️ (NOT /onboarding) │
        Middleware checks user_onboarding table          │
        IF row exists + status=incomplete →              │
          Redirect to /onboarding ✅                     │
        IF row doesn't exist yet →                       │
          No redirect, user lands on dashboard ⚠️       │
                                                        │
    ▼                                                   │
Onboarding Wizard (/onboarding) — 6 steps              │
    Step 0: Welcome (greeting + 3 value cards)          │
    Step 1: Profile (name + company size)               │
    Step 2: Role (role + industry + use case) ← 3 fields│
    Step 3: First Brand (brand name + domain)           │
    Step 4: Preferences (3 toggles, all defaulted ON)   │
    Step 5: Complete (static "what's next" list)        │
    │                                                   │
    ▼ Redirects to /dashboard                           │
                                                        │
Dashboard (/dashboard)                                  │
    IF no brands exist → shows SECOND onboarding flow ⚠️│
      Step 1: Add Brand (name + domain + keywords +     │
              4 social handles)                         │
      Step 2: Run Scan (manual start, poll for results) │
      Step 3: "You're All Set" confirmation             │
    IF brands exist → shows normal dashboard            │
```

### What This Means
A user can encounter **two entirely different onboarding experiences** depending on their path:
- **Path A** (email confirm ON): Signup → email verify → `/onboarding` wizard (6 steps) → dashboard
- **Path B** (email confirm OFF, row exists): Signup → `/dashboard` → middleware redirect → `/onboarding` wizard → dashboard  
- **Path C** (email confirm OFF, no row): Signup → `/dashboard` → dashboard's own `OnboardingFlow` component (3 steps, different UI)

---

## Part 2: Friction Points Identified

### 🔴 Critical (Blocks Activation)

| # | Friction Point | Location | Impact |
|---|---------------|----------|--------|
| F1 | **Dual onboarding flows** — Two completely different first-time experiences exist. The `/onboarding` wizard (6 steps, polished UI) and the dashboard's `OnboardingFlow` component (3 steps, card-based UI). Users may hit either depending on auth config and timing. | `src/app/onboarding/page.tsx` vs `src/app/dashboard/page.tsx` (lines 173-380) | HIGH — Fragmented, untestable experience |
| F2 | **Signup redirects to `/dashboard` not `/onboarding`** when auto-confirm is enabled | `src/app/auth/signup/page.tsx` line 59: `router.push('/dashboard')` | HIGH — Users skip the designed onboarding wizard |
| F3 | **Missing onboarding database tables** — The `user_onboarding`, `user_achievements`, `achievement_definitions`, `user_preferences`, `tour_progress` tables are referenced throughout the code but aren't confirmed in `supabase/schema.sql`. If missing, the entire onboarding wizard crashes. | `src/lib/onboarding.ts`, `src/app/onboarding/page.tsx` | CRITICAL — Wizard fails entirely |
| F4 | **Email verification blocks product access** — When Supabase email confirmation is enabled, users must leave the app, find the email, click the link, and return. This is the #1 cause of signup abandonment in SaaS. | `src/app/auth/signup/page.tsx` lines 36-55 | HIGH — Estimated 20-40% drop-off |

### 🟡 High (Significant Friction)

| # | Friction Point | Location | Impact |
|---|---------------|----------|--------|
| F5 | **6-step wizard is too long** — Welcome, Profile, Role, First Brand, Preferences, Complete. The Welcome step is purely decorative, Profile collects info that could wait, Role asks 3 questions (role + industry + use case), and Preferences defaults are already correct. Only the "First Brand" step is essential. | `src/types/onboarding.ts` `ONBOARDING_STEPS` | MEDIUM — Each unnecessary step loses ~10-15% of users |
| F6 | **No domain auto-fill from email** — If user signs up with `sarah@acme.com`, the brand step still requires manual entry of "Acme" and "acme.com". This is dead-obvious auto-fill territory. | `src/components/onboarding/OnboardingWizard.tsx` `FirstBrandStep` | MEDIUM — Adds 15-30 seconds of unnecessary friction |
| F7 | **Brand step requires BOTH name and domain** — Brand name could be auto-derived from domain. Requiring both doubles the cognitive load for what should be a single input. | `OnboardingWizard.tsx` validation: `isStepValid` case 3 | MEDIUM — Two fields where one would suffice |
| F8 | **No pre-signup value demonstration** — The landing page has no domain scanner preview. Users must commit to signup before seeing any product value. | `src/components/landing/Hero.tsx` | HIGH — Biggest conversion lever unused |
| F9 | **"Free forever" vs "14-day trial" messaging contradiction** — Hero says "Free forever tier", signup page says "14 days free", pricing says both. Users don't know if it's actually free or a trial. | Hero.tsx, signup/page.tsx, Pricing.tsx | MEDIUM — Erodes trust at the critical moment |

### 🟢 Medium (Improvable)

| # | Friction Point | Location | Impact |
|---|---------------|----------|--------|
| F10 | **Generic CTA copy** — "Create account" is the least compelling CTA possible. No benefit orientation, no urgency. | `signup/page.tsx` line 147 | LOW — ~5-10% conversion lift available |
| F11 | **No social login configured** — `SocialLogin.tsx` component exists but isn't rendered in the signup page. Google OAuth reduces signup friction by ~20%. | `src/components/onboarding/SocialLogin.tsx` exists but unused | MEDIUM — Missed easy win |
| F12 | **Social proof sections commented out** — LogoCloud and Testimonials components exist but are disabled with TODO comments. Landing page lacks credibility signals. | `src/app/page.tsx` lines 3, 12 | MEDIUM — Landing page feels unproven |
| F13 | **No password strength indicator** — Users guess if their password meets requirements, leading to form errors and abandonment. | `signup/page.tsx` password field | LOW — ~10% reduction in signup errors |
| F14 | **Dashboard has no scan progress streaming** — During first scan, users see a spinner and periodic poll updates. No real-time progress (domains checked, URLs reviewed, etc. are shown but only update every 5 seconds). | `dashboard/page.tsx` `OnboardingFlow` scan step | LOW — Increases perceived wait time |

---

## Part 3: Design Improvements (Prioritized)

### Tier 1: Must-Fix Before Launch (~8 hours)

#### I1. Unify to a Single Onboarding Flow
**Problem:** Two competing onboarding paths.
**Solution:** Remove the `OnboardingFlow` component from `dashboard/page.tsx` and ensure ALL new users go through the `/onboarding` wizard. The dashboard's empty state (when no brands exist) should show a simple "Add your first brand" card with a link to `/dashboard/brands/new` — not an entire second onboarding experience.

**Change:**
- Delete `OnboardingFlow()` function from `dashboard/page.tsx` (lines ~173-380)
- Replace the `if (brands.length === 0)` branch with a simple empty state card
- This eliminates the confusion of two different first-run experiences

#### I2. Fix Signup Redirect
**Problem:** `router.push('/dashboard')` on auto-confirm signup bypasses onboarding.
**Solution:** Change to `router.push('/onboarding')`.

```tsx
// In src/app/auth/signup/page.tsx, line 59
// Change:
router.push('/dashboard')
// To:
router.push('/onboarding')
```

One-line fix with massive impact.

#### I3. Add Domain Auto-Fill from Email
**Problem:** Users manually type their domain even though we know it from their email.
**Solution:** In the `FirstBrandStep` component, auto-detect and pre-fill.

```tsx
// In OnboardingWizard.tsx, add to component initialization:
useEffect(() => {
  const emailDomain = user.email.split('@')[1];
  const generic = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
                   'icloud.com', 'protonmail.com', 'aol.com', 'mail.com',
                   'live.com', 'me.com', 'mac.com'];
  if (emailDomain && !generic.includes(emailDomain.toLowerCase())) {
    const brandName = emailDomain.split('.')[0];
    setFormData(prev => ({
      ...prev,
      brandDomain: prev.brandDomain || emailDomain,
      brandName: prev.brandName || brandName.charAt(0).toUpperCase() + brandName.slice(1),
    }));
  }
}, [user.email]);
```

#### I4. Streamline Wizard to 3 Steps
**Problem:** 6 steps is too many. Only "First Brand" matters for activation.
**Solution:** Collapse to 3 steps:

```
Step 1: Welcome + Role (combined — single click for role, everything else removed)
Step 2: Add Your Brand (auto-filled from email, one-click confirm)
Step 3: Scan Starting → Auto-redirect to Dashboard
```

Remove: Profile step (name already collected at signup), Preferences step (defaults are correct), separate Complete step (merge into scan initiation).

#### I5. Verify/Create Onboarding Database Tables
**Problem:** Code references tables that may not exist in schema.
**Solution:** Run the SQL from `USER_ONBOARDING_STRATEGY.md` Appendix A.1 against Supabase, or add to `supabase/schema.sql` and run migration.

### Tier 2: High-Impact Improvements (~12 hours)

#### I6. Add Pre-Signup Domain Scanner
**Problem:** Zero demonstrated value before signup.
**Solution:** Add a domain input field on the landing page hero:

```
[Enter your domain: ____________] [Check for Threats →]
```

On submission, run a lightweight check (DNS lookup for common typosquat variations) and show a blurred/teaser result:
- "We found **X potential risks** for yourdomain.com"
- "Sign up free to see the full results and start monitoring"

This is the single highest-leverage conversion optimization. It turns passive visitors into curious, invested prospects.

#### I7. Fix the Free vs Trial Messaging
**Problem:** Contradictory messaging across the site.
**Solution:** Pick ONE positioning and be consistent:
- **Recommended:** "Free forever for 1 brand. Paid plans include a 14-day trial."
- Update Hero: ✓ Already says "Free forever tier" — keep this
- Update Signup: Change "14 days free" → "Free forever for 1 brand. No credit card."
- Update Pricing: Clarify that Free tier is permanent, trials are for Starter/Pro/Enterprise

#### I8. Upgrade CTA Copy
**Problem:** "Create account" is generic.
**Solution:** Test benefit-oriented alternatives:
- "Start Protecting My Brand — Free"
- "Scan My Domain — No Card Required"
- "See My Brand's Threats — Free"

#### I9. Add Social Login (Google OAuth)
**Problem:** Email/password signup has higher friction than OAuth.
**Solution:** The `SocialLogin.tsx` component already exists. Wire it into the signup page and configure Google OAuth in Supabase dashboard. This typically increases signup rate 15-25%.

#### I10. Enable Deferred Email Verification
**Problem:** Email verification blocks access.
**Solution:** Allow users to access the product immediately after signup. Send verification email in background. Show a soft banner in the dashboard: "Please verify your email to unlock all features." Gate sensitive features (takedown reports, billing) behind verification.

### Tier 3: Refinement (~10 hours)

#### I11. Add Password Strength Indicator
Visual meter below password field. Reduces form errors and abandonment.

#### I12. Activate Social Proof Sections
Uncomment LogoCloud and Testimonials. Even with beta testers or "early users," any social proof beats none. Create 2-3 composite testimonials based on the target personas (clearly labeled as representative, not fabricated).

#### I13. Improve Empty States
When the dashboard loads with data:
- Show scan progress with live domain count
- "While you wait" educational content cards
- "No threats found" framed as positive outcome with ongoing monitoring value

#### I14. Build Drip Email Sequence
Create emails 3-7 from the strategy doc. The welcome and scan-complete emails exist. Add:
- Day 2: Specific finding from their scan
- Day 5: Feature discovery (social monitoring, reports, API)
- Day 10: Upgrade nudge with usage stats
- Day 14: Trial end / social proof
- Day 30: Win-back with monitoring summary

#### I15. Add Contextual Upgrade Prompts
When users hit free tier limits (add 2nd brand, try social scanning, etc.), show a targeted modal explaining what plan unlocks the feature, with social proof and risk-free messaging.

#### I16. Instrument Analytics Events
The strategy doc defines 30+ events. Currently only `sign_up` and `onboarding_complete` are tracked. Add the full funnel:
- `signup_started`, `signup_error`
- `onboarding_step_completed`, `onboarding_step_skipped`
- `brand_added`, `scan_initiated`, `scan_completed`
- `threat_viewed`, `report_generated`
- `upgrade_prompt_shown`, `checkout_initiated`

Without this instrumentation, A/B tests can't be measured.

#### I17. Auto-Start Scan on Brand Creation
In the wizard's `finishOnboarding`, a scan job is queued but the user doesn't see it running. Auto-redirect to dashboard with the scan already in progress, showing real-time progress.

#### I18. Add "Time Estimate" to Wizard
At the top of the onboarding wizard, add: "⏱️ 2 minutes to see your first results"
Sets expectations and reduces anxiety.

#### I19. Welcome Back Modal Optimization
The `WelcomeBackModal.tsx` component exists but isn't reviewed. Ensure it shows for returning users who haven't completed setup, with a "Continue where you left off" CTA.

---

## Part 4: A/B Testing Hypotheses

### Test H1: Pre-Signup Domain Scanner
**Hypothesis:** Adding a domain scanner input on the landing page hero will increase visitor-to-signup conversion by 30-50%.
**Control:** Current hero with direct "Start Free" CTA.
**Variant:** Hero with domain input field + teaser results + signup prompt.
**Primary Metric:** Visitor → Signup rate.
**Secondary Metrics:** Time on page, bounce rate, landing → signup page clicks.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 500 signups (whichever first).
**Expected Lift:** 30-50% improvement in visitor-to-signup rate.
**Why:** Demonstrating value before commitment is the most proven SaaS conversion technique. The "aha moment" shifts from post-signup to pre-signup.

### Test H2: 3-Step vs 6-Step Onboarding Wizard
**Hypothesis:** Reducing the onboarding wizard from 6 steps to 3 steps will increase signup-to-activated rate by 20-30%.
**Control:** Current 6-step wizard.
**Variant:** 3-step wizard (Welcome+Role → Brand → Scan Launch).
**Primary Metric:** Signup → Activated (viewed threats) rate.
**Secondary Metrics:** Wizard completion rate, time to first scan, wizard abandonment rate.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 200 signups.
**Expected Lift:** 20-30% improvement in activation rate.
**Why:** Each wizard step loses 10-15% of users. Removing 3 non-essential steps compounds to significant improvement.

### Test H3: CTA Copy — Generic vs Benefit-Oriented
**Hypothesis:** Changing the signup CTA from "Create account" to "Start Protecting My Brand — Free" will increase signup form completion by 10-15%.
**Control:** "Create account"
**Variant A:** "Start Protecting My Brand — Free"
**Variant B:** "Scan My Domain — No Card Required"
**Variant C:** "See My Brand's Threats — Free"
**Primary Metric:** Signup form completion rate.
**Secondary Metrics:** Click-through from landing page, form start rate.
**Traffic Split:** 25/25/25/25.
**Minimum Runtime:** 3 weeks or 400 signups per variant.
**Expected Lift:** 10-15% improvement over control.

### Test H4: Social Login vs Email-Only Signup
**Hypothesis:** Adding Google OAuth as a signup option will increase overall signup completion rate by 15-25%.
**Control:** Email + password only.
**Variant:** Email + password + "Continue with Google" button.
**Primary Metric:** Signup completion rate.
**Secondary Metrics:** Social vs email signup ratio, subsequent activation rate by method.
**Traffic Split:** 50/50.
**Minimum Runtime:** 3 weeks or 300 signups.
**Expected Lift:** 15-25% more completions.
**Why:** Single-click signup removes password creation friction and email verification entirely.

### Test H5: Domain Auto-Fill vs Manual Entry
**Hypothesis:** Auto-filling the brand domain from the user's email address will reduce time-to-first-scan by 40% and increase brand creation rate by 15%.
**Control:** Empty brand name + domain fields.
**Variant:** Pre-filled brand name + domain (from email, with option to edit).
**Primary Metric:** Brand creation rate in onboarding.
**Secondary Metric:** Time from onboarding start to first scan.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 200 signups.
**Expected Lift:** 15% more brands created, 40% faster time-to-scan.

### Test H6: Signup Form Fields — 2 vs 3
**Hypothesis:** Removing the "Full name" field from signup (collecting it in onboarding instead) will increase signup form completion by 5-10%.
**Control:** 3 fields (Name, Email, Password).
**Variant:** 2 fields (Email, Password). Name collected in wizard Step 1.
**Primary Metric:** Signup form completion rate.
**Secondary Metrics:** Time to complete signup, error rate.
**Traffic Split:** 50/50.
**Minimum Runtime:** 3 weeks or 400 signups.
**Expected Lift:** 5-10% improvement.
**Why:** Each field removed increases completion 5-10% (Baymard Institute research).

### Test H7: Deferred vs Immediate Email Verification
**Hypothesis:** Deferring email verification (allowing immediate product access) will increase signup-to-activated rate by 25-40%.
**Control:** Email verification required before product access.
**Variant:** Immediate access with soft verification prompt in-app.
**Primary Metric:** Signup → Activated rate.
**Secondary Metrics:** Email verification rate within 7 days, abuse rate, support tickets.
**Traffic Split:** 50/50.
**Minimum Runtime:** 4 weeks or 200 signups.
**Expected Lift:** 25-40%.
**Risk:** Potential increase in spam accounts. Mitigate with rate limiting on scans.

### Test H8: Scan Progress — Spinner vs Live Updates
**Hypothesis:** Showing real-time scan progress (domains checked, threats found) instead of a generic spinner will increase scan completion patience by 30% and reduce scan cancellations.
**Control:** Spinner + "Scanning..." text (current dashboard OnboardingFlow).
**Variant:** Progress bar + live counters + estimated time remaining.
**Primary Metric:** Scan completion rate (users who wait vs cancel/leave).
**Secondary Metrics:** Time spent on scan page, user satisfaction.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 150 scans.
**Expected Lift:** 30% fewer scan abandonments.

### Test H9: Free Tier Messaging — "Free Forever" vs "14-Day Trial"
**Hypothesis:** Consistent "Free forever for 1 brand" messaging will increase signup rate by 10-20% compared to "14-day trial" messaging.
**Control:** Current mixed messaging ("14 days free" on signup + "Free forever" on landing).
**Variant A:** Consistent "Free forever for 1 brand" everywhere.
**Variant B:** Consistent "14-day free trial of Pro features" everywhere.
**Primary Metric:** Visitor → Signup rate.
**Secondary Metrics:** Free → Paid conversion rate (longer-term), perceived value.
**Traffic Split:** 33/33/33.
**Minimum Runtime:** 4 weeks or 300 signups per variant.
**Note:** This also fixes a trust issue. Contradictory messaging makes users suspicious.

### Test H10: Landing Page with Social Proof vs Without
**Hypothesis:** Adding testimonials and a logo cloud to the landing page will increase visitor-to-signup conversion by 15-25%.
**Control:** Current page (Testimonials and LogoCloud commented out).
**Variant:** Uncommented sections with beta tester quotes and early adopter logos.
**Primary Metric:** Landing page → Signup rate.
**Secondary Metrics:** Time on page, scroll depth, bounce rate.
**Traffic Split:** 50/50.
**Minimum Runtime:** 3 weeks or 1000 landing page visitors.
**Expected Lift:** 15-25%.

### Test H11: Onboarding Wizard Skip vs No-Skip
**Hypothesis:** Removing the "Skip" option from the brand setup step will increase brand creation rate by 20% without significantly increasing abandonment.
**Control:** Current wizard with skip buttons on optional steps.
**Variant:** Remove skip from brand step (keep skip on profile/role).
**Primary Metric:** Brand creation rate during onboarding.
**Secondary Metrics:** Wizard abandonment rate, time in wizard.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 200 signups.
**Note:** The brand step is already marked `skippable: false` in `ONBOARDING_STEPS`, but the dashboard fallback flow doesn't enforce this. Unifying flows (I1) makes this test cleaner.

### Test H12: Welcome Email Timing — Immediate vs Delayed
**Hypothesis:** Sending the welcome email 30 minutes after signup (instead of immediately) will increase email open rate by 20%, because users are still in the product during immediate sends.
**Control:** Welcome email sent immediately on signup.
**Variant:** Welcome email sent 30 minutes post-signup.
**Primary Metric:** Welcome email open rate.
**Secondary Metrics:** Click-through rate, Day-2 return rate.
**Traffic Split:** 50/50.
**Minimum Runtime:** 2 weeks or 200 emails sent.

---

## Part 5: Implementation Priority Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │  I6 Pre-scan      │  I2 Fix redirect  │
    │  H1 Test scanner  │  I1 Unify flows   │
    │  I7 Fix messaging │  I3 Auto-fill     │
    │  H7 Defer verify  │  I4 3-step wizard │
    │                   │  I5 DB tables     │
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT │                │                   │ EFFORT
    │  I8 CTA copy      │  I14 Email drip   │
    │  I18 Time est.    │  I9 Social login   │
    │  H3 Test CTAs     │  I16 Analytics     │
    │  H6 Test fields   │  I15 Upgrade modal │
    │  I12 Social proof │  I10 Defer verify  │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

### Recommended Execution Order

**Week 1 (Must-do):**
1. I5 — Verify/create database tables (blocks everything)
2. I2 — Fix signup redirect to `/onboarding` (one-line fix)
3. I1 — Remove duplicate onboarding from dashboard
4. I3 — Add domain auto-fill from email
5. I4 — Streamline wizard to 3 steps
6. I7 — Fix free vs trial messaging consistency

**Week 2 (High-impact):**
7. I8 — Update CTA copy
8. I6 — Build pre-signup domain scanner
9. I16 — Instrument analytics events
10. I18 — Add time estimate to wizard

**Week 3 (Growth):**
11. I9 — Add Google OAuth
12. I10 — Implement deferred email verification
13. I12 — Activate social proof sections
14. Begin A/B test H1 (pre-signup scanner)

**Week 4+ (Optimization):**
15. I14 — Build email drip sequence
16. I15 — Contextual upgrade prompts
17. Run remaining A/B tests (H2-H12 as traffic allows)

---

## Part 6: Key Metrics to Track

### North Star Metric
**Signup → Activated rate** (where Activated = signed up + added brand + completed scan + viewed at least one threat)

### Supporting Metrics

| Category | Metric | Current | Target |
|----------|--------|---------|--------|
| Acquisition | Visitor → Signup | Unknown | >5% |
| Activation | Signup → Brand Added | Unknown | >80% |
| Activation | Brand Added → Scan Complete | Unknown | >90% |
| Activation | Signup → Activated | Unknown | >50% |
| Time | Time to First Scan | Unknown | <3 min |
| Conversion | Free → Paid (30-day) | Unknown | >12% |
| Retention | Day-7 Return Rate | Unknown | >35% |
| Onboarding | Wizard Completion Rate | Unknown | >85% |
| Onboarding | Wizard Step Skip Rate | Unknown | <15% |

### Instrumentation Prerequisite
**None of these metrics can be measured without implementing I16 (analytics events).** This is the foundation for all optimization work. Without instrumentation, we're optimizing blind.

---

## Appendix: File Reference

| File | Role in Onboarding |
|------|-------------------|
| `src/app/auth/signup/page.tsx` | Signup form, redirect logic |
| `src/app/auth/callback/route.ts` | Auth callback, post-verification redirect |
| `src/middleware.ts` | Auth protection, onboarding redirect check |
| `src/app/onboarding/page.tsx` | Onboarding wizard page (server component) |
| `src/components/onboarding/OnboardingWizard.tsx` | 6-step wizard UI |
| `src/app/dashboard/page.tsx` | Dashboard with embedded `OnboardingFlow` |
| `src/lib/onboarding.ts` | Onboarding state management (client) |
| `src/lib/onboarding-context.tsx` | Onboarding context provider |
| `src/types/onboarding.ts` | Type definitions, step config, constants |
| `src/components/onboarding/OnboardingChecklist.tsx` | Post-wizard checklist widget |
| `src/components/onboarding/ProductTour.tsx` | Dashboard tour |
| `src/components/onboarding/Achievements.tsx` | Gamification system |
| `src/components/onboarding/SocialLogin.tsx` | Google OAuth (unused) |
| `src/components/landing/Hero.tsx` | Landing page hero + CTA |
| `src/components/landing/Pricing.tsx` | Pricing section |
| `src/lib/email/templates.ts` | Email templates |
| `docs/USER_ONBOARDING_STRATEGY.md` | Existing strategy document |
