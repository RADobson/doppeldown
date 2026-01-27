# Phase 5: Alert Settings - Research

**Researched:** 2026-01-27
**Domain:** Email notification preferences and scheduled digest delivery
**Confidence:** HIGH

## Summary

Phase 5 focuses on giving users control over email notification preferences. The existing codebase already has:
- Complete email infrastructure using nodemailer (`src/lib/email.ts`)
- Alert settings database table with existing columns for `email_alerts`, `alert_email`, `alert_on_severity`, `daily_digest`, `instant_critical`
- Settings page with working alert preference UI (`src/app/dashboard/settings/page.tsx`)
- Threat alert email templates (HTML with inline CSS)
- Scan completion integration that reads alert settings and sends emails

The main work required is:
1. **Extend alert_settings table** with scan summary and weekly digest toggles (the current `daily_digest` needs renaming/clarification)
2. **Add weekly digest cron endpoint** to send Monday summary emails
3. **Add scan completion summary email** template and trigger
4. **Update settings UI** to match new requirements (severity threshold as radio instead of checkboxes)

**Primary recommendation:** Leverage existing infrastructure; minimal new code required. Add one cron job for weekly digest, update email.ts with new templates, and modify settings page for clearer UX.

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| nodemailer | ^6.9.16 | SMTP email sending | Already configured, production-proven |
| date-fns | ^4.1.0 | Date formatting | Already used for email timestamps |
| Supabase | ^2.47.0 | Database & auth | Project standard |

### Supporting (No Additional Deps Needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vercel Cron | built-in | Weekly digest scheduling | Already configured for hourly scans |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| nodemailer | Resend/SendGrid SDK | More features but adds dependency; nodemailer works fine |
| Vercel Cron | Supabase pg_cron | More control but adds complexity; Vercel cron is simpler |
| Inline CSS | email-templates + juice | Better DX but existing templates work; not worth refactor |

**Installation:**
```bash
# No new packages needed - existing stack sufficient
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── email.ts              # ADD: sendScanSummary(), sendWeeklyDigest() functions
├── app/
│   ├── api/
│   │   └── cron/
│   │       ├── scan/route.ts          # Existing - add summary email trigger
│   │       └── digest/route.ts        # NEW: Weekly digest endpoint
│   └── dashboard/
│       └── settings/page.tsx          # MODIFY: Update alert preferences UI
└── types/
    └── index.ts              # MODIFY: Update AlertSettings interface
```

### Pattern 1: Existing Email Template Pattern
**What:** Inline HTML templates with nodemailer transporter
**When to use:** All new email functions
**Example:**
```typescript
// Source: src/lib/email.ts (existing pattern)
export async function sendScanSummary(
  to: string,
  brand: Brand,
  scanResult: { domainsChecked: number; threatsFound: number; threats: Threat[] }
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Inline CSS - keep max 600px width, table layout */
  </style>
</head>
<body>
  <!-- Use existing DoppelDown header template -->
</body>
</html>
`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'alerts@doppeldown.app',
    to,
    subject: `Scan Complete: ${brand.name} - ${scanResult.threatsFound} threats found`,
    html,
  })
}
```

### Pattern 2: Cron Endpoint Pattern
**What:** Secured API route triggered by Vercel Cron
**When to use:** Weekly digest scheduling
**Example:**
```typescript
// Source: src/app/api/cron/scan/route.ts (existing pattern)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Query users with weekly_digest enabled
  // Aggregate threats from past week
  // Send personalized digest emails
}
```

### Pattern 3: Alert Settings Update Pattern
**What:** Upsert user preferences to alert_settings table
**When to use:** Saving user preferences
**Example:**
```typescript
// Source: src/app/dashboard/settings/page.tsx (existing pattern)
const { error } = await supabase
  .from('alert_settings')
  .upsert({
    user_id: userData.id,
    email_alerts: alertSettings.email_alerts,
    severity_threshold: alertSettings.severity_threshold, // NEW: 'all' | 'high_critical' | 'critical'
    scan_summary_emails: alertSettings.scan_summary_emails, // NEW
    weekly_digest: alertSettings.weekly_digest, // RENAME from daily_digest
    // ... other fields
  }, { onConflict: 'user_id' })
```

### Anti-Patterns to Avoid
- **Separate email queue table:** Don't create a jobs table for emails; send immediately inline with scan completion
- **Per-brand alert settings:** Keep settings at user level, not brand level (matches existing schema)
- **Complex email templating libraries:** Stick with inline HTML strings; not worth the overhead
- **Client-side timezone calculation:** Store timezone preference in DB, calculate send times server-side

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email templating | Custom templating engine | Inline HTML strings | Existing pattern works; 3 templates total |
| Cron scheduling | node-cron in-process | Vercel Cron in vercel.json | Serverless deployment requires external trigger |
| CSS inlining | Manual inline styles | Pre-written inline CSS | Email templates are simple; juice overkill |
| Timezone handling | Custom offset calculation | date-fns with timezone | Already in project, handles DST |

**Key insight:** This phase builds on existing infrastructure. The email.ts file already has the pattern, alert_settings table exists, settings page already renders toggles. Focus is extension, not creation.

## Common Pitfalls

### Pitfall 1: Gmail 102KB Clipping
**What goes wrong:** Long digest emails get truncated by Gmail
**Why it happens:** Gmail clips emails over 102KB with "View entire message" link
**How to avoid:**
- Limit weekly digest to top 10 threats per brand
- Use concise threat descriptions
- Link to dashboard for full details
**Warning signs:** Test emails showing clip message in Gmail

### Pitfall 2: Outlook CSS Rendering
**What goes wrong:** Email layouts break in Outlook desktop clients
**Why it happens:** Outlook uses Word rendering engine, ignores many CSS properties
**How to avoid:**
- Use table-based layouts (existing templates do this)
- Avoid flexbox, grid, position
- Use `align` and `valign` attributes on table cells
**Warning signs:** Test in Outlook; broken layouts

### Pitfall 3: Cron Timezone Confusion
**What goes wrong:** Weekly digest sends at wrong time for users
**Why it happens:** Vercel Cron runs in UTC; user expects local time
**How to avoid:**
- Document clearly that digests send at 9am UTC (or make timezone configurable)
- If timezone is needed: store in alert_settings, query users grouped by timezone, schedule multiple cron jobs
**Warning signs:** User complaints about timing

### Pitfall 4: Severity Threshold Mapping
**What goes wrong:** Alerts sent for wrong threat levels
**Why it happens:** Mismatch between UI labels and database values
**How to avoid:**
- Clear mapping: 'all' = ['low','medium','high','critical'], 'high_critical' = ['high','critical'], 'critical' = ['critical']
- Store as enum string, not array (simpler)
**Warning signs:** Users getting alerts they disabled

### Pitfall 5: Double Email on Immediate + Summary
**What goes wrong:** User gets threat alert AND scan summary mentioning same threats
**Why it happens:** Both triggers fire on scan completion
**How to avoid:**
- If user has instant alerts enabled, don't duplicate in summary
- Summary should say "N threats (alerts sent)" or skip already-alerted threats
**Warning signs:** User complaints about duplicate notifications

## Code Examples

### Database Migration for Alert Settings
```sql
-- Source: Recommended migration pattern
-- Add new columns to existing alert_settings table

ALTER TABLE public.alert_settings
ADD COLUMN IF NOT EXISTS severity_threshold TEXT DEFAULT 'high_critical'
  CHECK (severity_threshold IN ('all', 'high_critical', 'critical')),
ADD COLUMN IF NOT EXISTS scan_summary_emails BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Rename daily_digest to weekly_digest (if desired for clarity)
-- Note: existing column name is 'daily_digest' but phase requires weekly
-- Option 1: Keep as-is and document that 'daily_digest' means weekly
-- Option 2: Add new column, migrate data, drop old (safer)

COMMENT ON COLUMN public.alert_settings.severity_threshold IS
  'Threshold for email alerts: all (low+), high_critical (high+), critical (critical only)';
COMMENT ON COLUMN public.alert_settings.scan_summary_emails IS
  'Send summary email after each scan completes';
COMMENT ON COLUMN public.alert_settings.timezone IS
  'User timezone for digest scheduling (IANA format, e.g., America/New_York)';
```

### Updated TypeScript Interface
```typescript
// Source: src/types/index.ts pattern
export interface AlertSettings {
  email_alerts: boolean           // Master toggle
  alert_email: string             // Where to send
  severity_threshold: 'all' | 'high_critical' | 'critical'  // NEW: replaces alert_on_severity array
  scan_summary_emails: boolean    // NEW: per-scan summary
  weekly_digest: boolean          // Renamed from daily_digest
  timezone?: string               // NEW: for digest timing
  instant_critical: boolean       // Existing: bypass threshold for critical
  webhook_url?: string            // Enterprise only
  webhook_secret?: string         // Enterprise only
}
```

### Scan Summary Email Function
```typescript
// Source: Pattern from existing sendThreatAlert in email.ts
export async function sendScanSummary(
  to: string,
  brand: Brand,
  scan: { id: string; domainsChecked: number; threatsFound: number },
  threats: Threat[]
): Promise<void> {
  const criticalCount = threats.filter(t => t.severity === 'critical').length
  const highCount = threats.filter(t => t.severity === 'high').length

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-box { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .stat-number { font-size: 24px; font-weight: bold; color: #1e40af; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Scan Complete</h1>
    <p>${brand.name}</p>
  </div>

  <div style="padding: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 15px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 24px; font-weight: bold; color: #1e40af;">${scan.domainsChecked}</div>
          <div>Domains Checked</div>
        </td>
        <td width="20"></td>
        <td align="center" style="padding: 15px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 24px; font-weight: bold; color: ${scan.threatsFound > 0 ? '#dc2626' : '#22c55e'};">${scan.threatsFound}</div>
          <div>Threats Found</div>
        </td>
      </tr>
    </table>

    ${threats.length > 0 ? `
      <h3 style="margin-top: 30px;">Top Threats</h3>
      ${threats.slice(0, 5).map(t => `
        <div style="border-left: 4px solid ${t.severity === 'critical' ? '#dc2626' : t.severity === 'high' ? '#ea580c' : '#d97706'}; padding: 10px 15px; margin: 10px 0; background: #fafafa;">
          <strong>${t.severity.toUpperCase()}</strong>: ${t.domain || t.url}
        </div>
      `).join('')}
      ${threats.length > 5 ? `<p style="color: #6b7280;">And ${threats.length - 5} more...</p>` : ''}
    ` : `
      <p style="text-align: center; color: #22c55e; margin-top: 30px;">No threats detected!</p>
    `}

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/brands/${brand.id}"
         style="display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
        View Full Results
      </a>
    </div>
  </div>

  <div class="footer">
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Manage alert settings</a></p>
  </div>
</body>
</html>
`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'alerts@doppeldown.app',
    to,
    subject: `Scan Complete: ${brand.name} - ${scan.threatsFound} threat${scan.threatsFound !== 1 ? 's' : ''} found`,
    html,
  })
}
```

### Weekly Digest Cron Endpoint
```typescript
// Source: Pattern from existing /api/cron/scan/route.ts
// File: src/app/api/cron/digest/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWeeklyDigest } from '@/lib/email'
import { subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const weekAgo = subDays(new Date(), 7).toISOString()

  // Get users with weekly digest enabled
  const { data: settings } = await supabase
    .from('alert_settings')
    .select(`
      user_id,
      alert_email,
      severity_threshold,
      users!inner(email)
    `)
    .eq('weekly_digest', true)

  let sent = 0
  let errors: string[] = []

  for (const setting of settings || []) {
    try {
      // Get user's brands
      const { data: brands } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', setting.user_id)

      // Get threats from past week for each brand
      const brandSummaries = []
      for (const brand of brands || []) {
        const { data: threats, count } = await supabase
          .from('threats')
          .select('*', { count: 'exact' })
          .eq('brand_id', brand.id)
          .gte('detected_at', weekAgo)

        if (count && count > 0) {
          brandSummaries.push({
            brand,
            newThreats: count,
            threats: threats || []
          })
        }
      }

      // Send digest if there's anything to report
      const email = setting.alert_email || setting.users?.email
      if (email && brandSummaries.length > 0) {
        await sendWeeklyDigest(email, brandSummaries)
        sent++
      }
    } catch (error) {
      errors.push(`User ${setting.user_id}: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  return NextResponse.json({ sent, errors, timestamp: new Date().toISOString() })
}
```

### Vercel Cron Configuration
```json
// Source: vercel.json (extend existing)
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/scan",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
```
Note: `0 9 * * 1` = Every Monday at 9:00 AM UTC

### Settings Page UI Update (Severity Radio Buttons)
```typescript
// Source: Pattern from existing settings/page.tsx
// Replace checkbox-based severity with radio group

<div>
  <p className="font-medium text-gray-900 mb-2">Alert Severity Threshold</p>
  <p className="text-sm text-gray-500 mb-3">Which threats should trigger email alerts?</p>
  <div className="space-y-2">
    {[
      { value: 'all', label: 'All Threats', desc: 'Low, Medium, High, and Critical' },
      { value: 'high_critical', label: 'High + Critical Only', desc: 'Skip low and medium severity' },
      { value: 'critical', label: 'Critical Only', desc: 'Only the most severe threats' },
    ].map((option) => (
      <label key={option.value} className="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="severity_threshold"
          value={option.value}
          checked={alertSettings.severity_threshold === option.value}
          onChange={(e) => setAlertSettings({
            ...alertSettings,
            severity_threshold: e.target.value as 'all' | 'high_critical' | 'critical'
          })}
          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
        />
        <div>
          <span className="font-medium text-gray-900">{option.label}</span>
          <p className="text-sm text-gray-500">{option.desc}</p>
        </div>
      </label>
    ))}
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| daily_digest column | weekly_digest needed | Phase 5 requirement | Add new column or repurpose |
| alert_on_severity array | severity_threshold enum | Phase 5 requirement | Simpler UX with radio buttons |
| No scan summary email | Summary email on completion | Phase 5 requirement | New email function needed |

**Deprecated/outdated:**
- The current `daily_digest` column name is misleading if it's actually weekly; consider renaming for clarity
- The `alert_on_severity` TEXT[] is more complex than needed; enum is cleaner for 3 options

## Open Questions

1. **Timezone Implementation Scope**
   - What we know: CONTEXT.md mentions "Monday 9am user's timezone" for weekly digest
   - What's unclear: Should we implement full timezone support or default to UTC?
   - Recommendation: Start with UTC, add timezone dropdown as enhancement. Full timezone requires storing preference and potentially multiple cron triggers.

2. **Instant Critical vs Threshold Interaction**
   - What we know: Current schema has `instant_critical` toggle
   - What's unclear: If threshold is "high_critical", does instant_critical have any effect?
   - Recommendation: instant_critical bypasses threshold for critical threats, useful when threshold is "all" to ensure critical aren't batched.

3. **Scan Summary vs Threat Alert Deduplication**
   - What we know: Both can trigger on scan completion
   - What's unclear: Should summary skip threats already sent via instant alert?
   - Recommendation: Summary always includes all threats found; note in template if instant alert was sent.

## Sources

### Primary (HIGH confidence)
- **Existing codebase** - src/lib/email.ts, src/app/dashboard/settings/page.tsx, supabase/schema.sql
- **Vercel Cron Docs** - Existing vercel.json pattern already in project

### Secondary (MEDIUM confidence)
- [Mailtrap Nodemailer Tutorial 2026](https://mailtrap.io/blog/sending-emails-with-nodemailer/) - HTML templates, debugging
- [Supabase pg_cron Docs](https://supabase.com/docs/guides/database/extensions/pg_cron) - Alternative scheduling approach
- [Designmodo HTML/CSS Email 2026](https://designmodo.com/html-css-emails/) - Email client compatibility
- [Vercel Cron Template](https://vercel.com/templates/next.js/vercel-cron) - Cron configuration pattern

### Tertiary (LOW confidence)
- [Inngest Next.js Cron](https://www.kengreeff.com/posts/2jCjv4Y67AnzcbnNEg4itr) - Alternative to Vercel cron
- [NicelyDone Notification Settings](https://nicelydone.club/pages/notification-settings) - UI pattern inspiration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project, no new dependencies
- Architecture: HIGH - Follows established patterns in codebase
- Pitfalls: MEDIUM - Email client quirks verified with official sources; deduplication logic is best practice

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - stable domain, no major version changes expected)
