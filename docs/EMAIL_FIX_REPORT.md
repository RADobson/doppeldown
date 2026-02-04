# DoppelDown Email System — Diagnostic Report & Fixes

**Date:** 2026-02-05  
**Status:** Fixes implemented, deployment action required

---

## 🔴 Root Causes Found

### 1. Missing Auth Callback Route (CRITICAL)
**Problem:** No `/auth/callback` route existed. Supabase email confirmation links redirect to `{site_url}/auth/callback?code=...` — without this route, users clicking confirmation links got a **404 error**, making it impossible to confirm their email.

**Fix:** Created `src/app/auth/callback/route.ts` that:
- Exchanges the auth code for a session via `supabase.auth.exchangeCodeForSession()`
- Handles signup confirmations → redirect to `/onboarding`
- Handles password resets → redirect to `/auth/reset-password`
- Shows error message on failures

### 2. Signup Flow Ignores Email Confirmation (CRITICAL)
**Problem:** The signup page always redirected to `/dashboard` after `signUp()`, regardless of whether email confirmation is enabled in Supabase. When Supabase requires email confirmation, `signUp()` returns a `user` but **no `session`** — the user can't access the dashboard without confirming first.

**Fix:** Updated `src/app/auth/signup/page.tsx` to:
- Check if `data.session` is null (confirmation required)
- Show a "Check your email" confirmation screen with the user's email
- Include `emailRedirectTo` pointing to `/auth/callback?type=signup`
- Only redirect to `/dashboard` if auto-confirm is enabled

### 3. No Email Provider Configured (HIGH)
**Problem:** Two competing email systems exist with **neither properly configured**:

| System | Provider | Config Status |
|--------|----------|--------------|
| `src/lib/email.ts` + `src/lib/email/` | Nodemailer SMTP | `SMTP_USER` and `SMTP_PASS` are **empty** in `.env.local` |
| `lib/email/send.ts` | Resend API | `RESEND_API_KEY` is **not set** anywhere |

This means ALL transactional emails (threat alerts, weekly digests, welcome emails, scan summaries) silently fail.

**Fix:** Created `src/lib/email/provider.ts` — a unified email provider that:
- Auto-detects available provider: Resend → SMTP → Console
- Provides a single `sendEmail()` function
- Includes `testEmailProvider()` for health checks
- Falls back to console logging in development

### 4. Password Reset Redirect Missing Callback (MEDIUM)
**Problem:** Forgot-password page pointed reset links directly at `/auth/reset-password` instead of through the auth callback route.

**Fix:** Updated redirect to use `/auth/callback?type=recovery&next=/auth/reset-password`

### 5. Login Page Doesn't Show Auth Errors (LOW)
**Problem:** When auth callback fails (expired link, already used code), users were redirected to `/auth/login` with error params — but the page never read them.

**Fix:** Login page now reads `error_description` from URL search params and displays it.

---

## 🟡 Action Required (Vercel Environment Variables)

### Option A: Resend (Recommended for Vercel)
Resend is purpose-built for transactional emails on serverless platforms. No persistent connections needed.

1. **Sign up at [resend.com](https://resend.com)**
2. **Add & verify domain:** `doppeldown.com`
   - Add DNS records (SPF, DKIM, DMARC) they provide
3. **Create API key** and set in Vercel:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=DoppelDown <noreply@doppeldown.com>
   REPLY_TO_EMAIL=support@doppeldown.com
   ```

### Option B: SMTP (Gmail App Password)
If using Gmail SMTP:

1. **Enable 2-Step Verification** on the Google account
2. **Create App Password:** Google Account → Security → App Passwords
3. Set in Vercel:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx    # App Password, NOT account password
   EMAIL_FROM=DoppelDown <your-email@gmail.com>
   ```

> **⚠️ Gmail limitation:** From address must match the authenticated Gmail account. You can't send from `alerts@doppeldown.com` via Gmail SMTP unless it's configured as a send-as alias.

### Supabase SMTP Configuration (for auth emails)
Supabase uses its own SMTP for auth emails (signup confirmation, password reset). To customize:

1. Go to Supabase Dashboard → Settings → Auth → SMTP Settings
2. Either:
   - **Enable custom SMTP** with your Resend/Gmail credentials (same as above)
   - **Or** keep the default Supabase sender (limited to 4 emails/hour on free tier!)

> **Critical:** On the free Supabase tier, the default email sender is rate-limited to **4 emails per hour**. For production, configure custom SMTP.

---

## 📁 Files Changed

| File | Change |
|------|--------|
| `src/app/auth/callback/route.ts` | **NEW** — Auth callback handler for email confirmation |
| `src/app/auth/signup/page.tsx` | Updated — Email confirmation flow, redirect URL |
| `src/app/auth/forgot-password/page.tsx` | Updated — Uses callback route for reset |
| `src/app/auth/login/page.tsx` | Updated — Shows auth callback errors |
| `src/lib/email/provider.ts` | **NEW** — Unified email provider (Resend/SMTP/Console) |
| `src/app/api/email/test/route.ts` | **NEW** — Email health check & test endpoint |

## Files NOT Changed (intentionally)

| File | Reason |
|------|--------|
| `src/lib/email.ts` | Legacy SMTP-only code. Left intact for existing imports. Can be migrated later. |
| `src/lib/email/service.ts` | Full SMTP queue service. Still works if SMTP is configured. |
| `lib/email/send.ts` | Resend-only email functions. Still works if Resend is configured. |
| `src/middleware.ts` | Already allows `/auth/*` routes correctly. |

---

## 🧪 Testing the Fix

### 1. Test email provider health:
```bash
curl -H "Authorization: Bearer dd-cron-secret-2026-feb" \
  https://doppeldown.com/api/email/test
```

### 2. Send a test email:
```bash
curl -X POST \
  -H "Authorization: Bearer dd-cron-secret-2026-feb" \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}' \
  https://doppeldown.com/api/email/test
```

### 3. Test signup flow:
1. Go to `/auth/signup`
2. Create account with valid email
3. Should see "Check your email" screen
4. Click confirmation link in email
5. Should land on `/onboarding` (if new) or `/dashboard`

---

## 🏗️ Architecture: Before vs After

### Before (broken):
```
Signup → signUp() → redirect /dashboard (no session!) → login wall
                     ↑ No callback route
                     ↑ Confirmation link → 404

Transactional emails:
  src/lib/email.ts → nodemailer (SMTP_USER empty) → FAILS
  lib/email/send.ts → Resend (no API key) → FAILS
```

### After (fixed):
```
Signup → signUp() → "Check your email" screen
                     → User clicks link
                     → /auth/callback → exchangeCode → /onboarding ✅

Transactional emails:
  src/lib/email/provider.ts → auto-detect:
    1. Resend (if RESEND_API_KEY) → sends ✅
    2. SMTP (if SMTP_HOST+USER) → sends ✅
    3. Console (dev fallback) → logs ⚠️
```
