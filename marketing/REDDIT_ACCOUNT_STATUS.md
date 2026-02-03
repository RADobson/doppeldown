# Reddit Account Status - DoppelDown

## Status: ❌ NOT CREATED (Browser Issue)

**Date:** 2026-02-03
**Email Used:** doppeldown.com@gmail.com

---

## What Happened

The Reddit account creation was **not completed** due to a persistent browser redirect issue in the OpenClaw `openclaw` browser profile.

### Progress Made
1. ✅ Navigated to https://www.reddit.com/register/
2. ✅ Entered email: `doppeldown.com@gmail.com`
3. ✅ Clicked Continue → Reddit sent verification code to email
4. ✅ Clicked "Skip" to bypass email verification
5. ✅ Reached "Create your username and password" page
6. ✅ Entered username: `DoppelDown` (was shown as available with ✓)
7. ❌ **BLOCKED** — Before password could be entered and submitted, the browser tab was repeatedly redirected to `softwaresuggest.com/vendors`

### Root Cause
The `openclaw` browser profile appears to have a redirect hijack (possibly a rogue extension, service worker, or cached redirect) that persistently redirects browser tabs to `https://www.softwaresuggest.com/vendors`. This happened every time across 5+ attempts, even after restarting the browser.

---

## Issues Encountered
- **Browser redirect hijack**: Tabs redirect from Reddit to SoftwareSuggest within seconds
- **Email verification**: Reddit requires a 6-digit email verification code (can be skipped, but email needs verification eventually)
- **No CAPTCHA encountered** during the signup flow

---

## Action Required
To complete the Reddit account creation, you'll need to either:

1. **Fix the openclaw browser profile** — Check for rogue extensions in `chrome://extensions` and clear the profile's browsing data, service workers, and cached redirects
2. **Create the account manually** using a clean browser with these details:
   - **Email:** doppeldown.com@gmail.com
   - **Username:** Try "DoppelDown" first → "DoppelDownHQ" → "DoppelDown_Official" if taken
   - **Password:** DoppelD0wn!2026
3. **Email verification** will be needed — check doppeldown.com@gmail.com for the Reddit verification code

---

## Username Availability (as of 2026-02-03)
- `DoppelDown` — ✅ Was shown as available during the attempt
- `DoppelDownHQ` — Not tested
- `DoppelDown_Official` — Not tested

---

## Notes
- The email `doppeldown.com@gmail.com` has been submitted to Reddit's signup flow multiple times, so verification emails may have been sent
- No account was created — the signup was never finalized (password never submitted)
- The SoftwareSuggest form also auto-filled with stored data (Ernie Dobson, Dobson Development Pty Ltd) — the browser profile has saved form data that should be reviewed
