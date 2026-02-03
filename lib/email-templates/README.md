# DoppelDown Email Templates

Professional transactional email templates built with [React Email](https://react.email/) for the DoppelDown brand protection platform.

## Templates

| Template | Purpose | File |
|----------|---------|------|
| **Welcome** | Sent after user signup | `welcome.tsx` |
| **Threat Alert** | New threat detected notification | `threat-alert.tsx` |
| **Weekly Report** | Weekly brand protection summary | `weekly-report.tsx` |
| **Trial Ending** | Trial expiration reminders (3 days, 1 day) | `trial-ending.tsx` |
| **Invoice** | Payment receipts and invoices | `invoice.tsx` |

## Design System

All emails follow DoppelDown's cyber/neon aesthetic:

- **Background**: Dark (#0a0a0f)
- **Surface**: Elevated dark cards (#111827, #1f2937)
- **Primary**: Blue (#3b82f6) with glow effects
- **Accent**: Purple (#8b5cf6)
- **Text**: Light (#f9fafb) with muted secondary (#9ca3af)
- **Borders**: Subtle gray (#374151)

## Usage

### Sending Emails

```typescript
import { sendWelcomeEmail, sendThreatAlertEmail } from '@/lib/email';

// Welcome email
await sendWelcomeEmail('user@example.com', 'John', 'https://doppeldown.com/dashboard');

// Threat alert
await sendThreatAlertEmail('user@example.com', {
  userName: 'John',
  brandName: 'Acme Corp',
  threatType: 'phishing',
  threatUrl: 'https://acme-secure.xyz',
  severity: 'critical',
  detectedAt: '2026-02-03 14:30 UTC',
  similarityScore: 92,
  threatId: 'threat_123',
});
```

### Using Templates Directly

```typescript
import { WelcomeEmail } from '@/lib/email-templates';
import { render } from '@react-email/render';

const html = await render(WelcomeEmail({ userName: 'John' }));
```

## Environment Variables

Add to your `.env.local`:

```bash
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=DoppelDown <noreply@doppeldown.com>
REPLY_TO_EMAIL=support@doppeldown.com
```

## Preview Emails

To preview emails during development:

```bash
npx react-email dev
```

Or use the exported HTML from `render()` in your test emails.

## Mobile Responsiveness

All templates are mobile-responsive with:
- Fluid container width (max-width: 600px)
- Stacked layouts on mobile
- Responsive typography
- Touch-friendly buttons (min 44px tap targets)

## Accessibility

- Semantic HTML structure
- Color contrast ratios meet WCAG AA
- Meaningful link text
- Preview text for email clients
