# DoppelDown Sitemap & IndieHackers Report
**Date:** 2026-02-03

---

## 1. Sitemap Submission to Google Search Console

### Ping Endpoint Attempts

**Option 1:** `curl "https://www.google.com/ping?sitemap=https://www.doppeldown.com/sitemap.xml"`
- **Result:** HTTP 404 — **DEPRECATED**
- Response: "Sitemaps ping is deprecated"

**Option 2:** `curl "https://www.google.com/ping?sitemap=https://doppeldown.com/sitemap.xml"`
- **Result:** HTTP 404 — **DEPRECATED**
- Response: "Sitemaps ping is deprecated"

### Why Both Failed
Google officially deprecated the sitemaps ping endpoint in June 2023. See: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping

The endpoint now returns 404 for all requests. Both Google and Bing have removed support for unauthenticated sitemap submissions because the vast majority of pings were spam.

### What IS Working ✅
- **robots.txt** already references the sitemap:
  ```
  Sitemap: https://doppeldown.com/sitemap.xml
  ```
  Google will discover the sitemap via robots.txt during regular crawls.

### How to Submit the Sitemap (Recommended Methods)

#### Method 1: Google Search Console UI (Recommended)
1. Go to https://search.google.com/search-console
2. Select the `doppeldown.com` property
3. Navigate to **Sitemaps** in the left sidebar
4. Enter `https://www.doppeldown.com/sitemap.xml` in the "Add a new sitemap" field
5. Click **Submit**

#### Method 2: Search Console API (Requires OAuth2)
The API endpoint exists but requires OAuth2 authentication:
```
PUT https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fdoppeldown.com/sitemaps/https%3A%2F%2Fwww.doppeldown.com%2Fsitemap.xml
Authorization: Bearer <OAuth2_token>
```
- **Scope required:** `https://www.googleapis.com/auth/webmasters`
- This requires setting up a Google Cloud project with OAuth2 credentials
- Not feasible via simple curl without prior authentication setup

### Action Items
- [ ] **Manual submission via Search Console UI** — This is the fastest reliable method
- [x] robots.txt already references sitemap — Google will auto-discover
- [ ] Consider setting up Google Cloud OAuth credentials for future API automation

---

## 2. IndieHackers Account Creation

### Status: ❌ Not Possible with Email/Password

### What Happened
IndieHackers was acquired by Reddit and now uses **Reddit accounts for authentication**. When clicking "Join" or "Get Access" on IndieHackers, users are redirected to Reddit's sign-up page at `https://www.reddit.com/`.

The sign-up options available are:
- Continue with Phone Number (→ Reddit)
- Continue with Google (→ Reddit OAuth)
- Continue with Apple (→ Reddit OAuth)
- Sign up with Email (→ creates a **Reddit account**, not an IndieHackers account)

### Key Findings
- IndieHackers no longer has its own independent sign-up flow
- All authentication is handled through Reddit
- The "Join" link on IndieHackers leads to a paid **IH+ membership** ($198/year annual) which ALSO requires a Reddit account first
- Free accounts can browse and post but require Reddit login
- Cannot create an account with `doppeldown.com@gmail.com` / `DoppelD0wn!2026` directly on IndieHackers

### Recommended Next Steps
1. **Create a Reddit account** first with the desired credentials
2. **Log into IndieHackers** using the Reddit account
3. Then create a product page at https://www.indiehackers.com/products/new
4. Consider whether IH+ ($198/year) is worth it for premium features

### Alternative Free Options for Product Listing
- IndieHackers product page (free, just needs Reddit account): https://www.indiehackers.com/products/new
- Post a "Show IH" post about DoppelDown for community visibility
