# DoppelDown Email Alert System

A comprehensive SMTP email alert system with robust error handling, configurable retry logic, and detailed logging to ensure reliable communication.

## Features

- **Connection Pooling**: Efficient SMTP connection management with automatic reconnection
- **Queue Management**: Priority-based email queue with configurable rate limiting
- **Retry Logic**: Exponential backoff with configurable retry attempts
- **Template System**: Professional HTML email templates for all alert types
- **Health Monitoring**: Built-in health checks and metrics
- **Detailed Logging**: Comprehensive logging for debugging and monitoring
- **Error Handling**: Custom error classes with retryable classification

## Quick Start

### Basic Usage

```typescript
import { getEmailService, sendThreatAlert } from '@/lib/email'

// Using the service directly
const emailService = getEmailService()
await emailService.initialize()
await emailService.sendThreatAlert(userEmail, brand, threats)

// Or use convenience functions
await sendThreatAlert(userEmail, brand, threats)
```

### Configuration

Configure via environment variables in `.env`:

```env
# SMTP Server Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Service Settings
EMAIL_FROM=alerts@doppeldown.app
EMAIL_REPLY_TO=support@doppeldown.app
EMAIL_ENABLED=true
EMAIL_MAX_RETRIES=5
EMAIL_RATE_LIMIT=30
```

## Email Types

### Threat Alerts

Sent when new threats are detected for a monitored brand.

```typescript
await emailService.sendThreatAlert(
  'user@example.com',
  brand,
  threats
)
```

Features:
- Priority automatically set based on threat severity
- Visual severity indicators (critical, high, medium, low)
- Direct links to threat details
- Actionable recommendations

### Scan Summaries

Sent when a brand scan completes.

```typescript
await emailService.sendScanSummary(
  'user@example.com',
  brand,
  {
    domainsChecked: 500,
    threatsFound: 3,
    threats: detectedThreats,
    scanDuration: 45000,
    scanId: 'scan-123'
  }
)
```

### Daily/Weekly Digests

Periodic summaries of brand protection status.

```typescript
// Daily digest
await emailService.sendDailyDigest('user@example.com', [
  { brand, totalThreats: 10, newThreats: 2, threats }
])

// Weekly digest
await emailService.sendWeeklyDigest('user@example.com', [
  { brand, newThreats: 5, threats }
])
```

### Welcome Emails

Onboarding email for new users.

```typescript
await emailService.sendWelcomeEmail('user@example.com', 'John Doe')
```

### Password Reset

Secure password reset flow.

```typescript
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  resetToken,
  new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24h
)
```

## Advanced Usage

### Custom Emails

```typescript
// Using templates
await emailService.sendTemplatedEmail(
  'threat_detected',
  'user@example.com',
  templateData,
  { priority: 'high', cc: 'team@example.com' }
)

// Raw email (no template)
await emailService.sendRawEmail(
  'user@example.com',
  'Custom Subject',
  '<h1>Custom HTML</h1>',
  { priority: 'normal' }
)

// Immediate send (bypass queue)
const result = await emailService.sendImmediate(
  'user@example.com',
  'Urgent Subject',
  '<h1>Urgent Content</h1>'
)
```

### Queue Management

```typescript
// Get queue statistics
const stats = emailService.getQueueStats()
console.log(stats)
// {
//   total: 25,
//   pending: 10,
//   queued: 12,
//   sending: 2,
//   retry: 1,
//   byPriority: { critical: 2, high: 5, normal: 15, low: 3 },
//   processingRate: 28
// }

// Cancel a pending email
emailService.cancelEmail(emailId)

// Process queue immediately
const processed = await emailService.processQueueNow()
```

### Event Listeners

```typescript
emailService.addEventListener((event) => {
  switch (event.type) {
    case 'queued':
      console.log('Email queued:', event.email.id)
      break
    case 'sent':
      console.log('Email sent:', event.emailId, event.result.messageId)
      break
    case 'failed':
      console.error('Email failed:', event.emailId, event.error)
      break
    case 'retry':
      console.log('Retrying:', event.emailId, 'attempt', event.attempt)
      break
  }
})
```

### Health Monitoring

```typescript
// Get comprehensive health status
const health = emailService.getHealth()
console.log(health)
// {
//   service: 'healthy' | 'degraded' | 'unhealthy' | 'disabled',
//   transport: { healthy: true, totalSent: 150, totalFailures: 2, ... },
//   queue: { total: 5, pending: 2, ... },
//   config: { enabled: true, smtpHost: 'smtp.gmail.com', rateLimit: 30 }
// }

// Quick health check
if (!emailService.isHealthy()) {
  console.warn('Email service is unhealthy!')
}

// Verify SMTP connection
await emailService.verifyConnection()
```

### Graceful Shutdown

```typescript
// In your shutdown handler
process.on('SIGTERM', async () => {
  await shutdownEmailService()
  process.exit(0)
})
```

## Configuration Reference

### SMTP Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_SECURE` | auto | Use SSL/TLS (auto for port 465) |
| `SMTP_USER` | - | SMTP username |
| `SMTP_PASS` | - | SMTP password |
| `SMTP_CONNECTION_TIMEOUT` | `30000` | Connection timeout (ms) |
| `SMTP_SOCKET_TIMEOUT` | `60000` | Socket timeout (ms) |
| `SMTP_MAX_CONNECTIONS` | `5` | Max concurrent connections |
| `SMTP_MAX_MESSAGES` | `100` | Messages per connection |
| `SMTP_DEBUG` | `false` | Enable debug logging |

### Service Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_FROM` | `alerts@doppeldown.app` | Default from address |
| `EMAIL_REPLY_TO` | - | Reply-to address |
| `EMAIL_ENABLED` | `true` | Enable/disable sending |
| `EMAIL_LOG_CONTENT` | `false` | Log email content |
| `EMAIL_MAX_RETRIES` | `5` | Max retry attempts |
| `EMAIL_RETRY_DELAY_MS` | `1000` | Base retry delay |
| `EMAIL_RETRY_BACKOFF` | `2` | Backoff multiplier |
| `EMAIL_MAX_RETRY_DELAY_MS` | `300000` | Max retry delay |
| `EMAIL_QUEUE_INTERVAL_MS` | `5000` | Queue processing interval |
| `EMAIL_MAX_QUEUE_SIZE` | `1000` | Max queue size |
| `EMAIL_RATE_LIMIT` | `30` | Emails per minute |

## Error Handling

The system provides specific error classes:

```typescript
import {
  ConnectionError,      // SMTP connection failed
  AuthenticationError,  // Auth failed
  TimeoutError,         // Operation timed out
  RateLimitError,       // Rate limited
  InvalidRecipientError, // Bad email address
  MessageTooLargeError, // Message exceeds limit
  SmtpError,            // SMTP server error
  QueueFullError,       // Queue capacity exceeded
  TemplateError,        // Template rendering failed
  ValidationError,      // Invalid configuration/data
} from '@/lib/email'
```

Errors include:
- `code`: Specific error code
- `retryable`: Whether the operation can be retried
- `smtpCode`: SMTP response code (if applicable)
- `context`: Additional debugging context

## Gmail Setup

For Gmail SMTP:

1. Enable 2-factor authentication
2. Create an App Password:
   - Go to Google Account > Security > App Passwords
   - Select "Mail" and generate password
3. Use the app password as `SMTP_PASS`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

## Testing

Disable email sending in test environments:

```env
EMAIL_ENABLED=false
```

Or mock the service:

```typescript
jest.mock('@/lib/email', () => ({
  getEmailService: () => ({
    sendThreatAlert: jest.fn().mockResolvedValue({ id: 'test-id' }),
    // ... other methods
  }),
}))
```

## Monitoring

### Metrics Endpoint

Add to your health/metrics endpoint:

```typescript
import { getEmailService } from '@/lib/email'

export async function GET() {
  const emailService = getEmailService()
  const health = emailService.getHealth()
  
  return Response.json({
    email: {
      status: health.service,
      sent: health.transport.totalSent,
      failed: health.transport.totalFailures,
      queue: health.queue.total,
      rate: health.queue.processingRate,
    }
  })
}
```

### Log Analysis

The system logs with these levels:
- `debug`: Detailed operation info
- `info`: Normal operations (sent, queued)
- `warn`: Non-critical issues (retries)
- `error`: Failures

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EmailAlertService                        │
│  - High-level API                                           │
│  - Template rendering                                       │
│  - Service orchestration                                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
         ▼                                           ▼
┌─────────────────────┐                 ┌─────────────────────┐
│    EmailQueue       │                 │  SmtpTransportPool  │
│  - Priority queue   │    process()    │  - Connection pool  │
│  - Rate limiting    │────────────────▶│  - Health checks    │
│  - Retry logic      │                 │  - Reconnection     │
└─────────────────────┘                 └─────────────────────┘
         │                                           │
         │                                           │
         ▼                                           ▼
┌─────────────────────┐                 ┌─────────────────────┐
│    Event System     │                 │    SMTP Server      │
│  - queued/sent/fail │                 │  (Gmail, AWS SES,   │
│  - retry/expired    │                 │   SendGrid, etc.)   │
└─────────────────────┘                 └─────────────────────┘
```

## Migration from Old System

If migrating from the basic `email.ts`:

1. The new system is backwards compatible
2. Old function signatures still work:
   ```typescript
   // These still work!
   import { sendThreatAlert, sendWelcomeEmail } from '@/lib/email'
   ```
3. New imports from `@/lib/email` instead of `@/lib/email.ts`
4. Add new environment variables for advanced features

## Troubleshooting

### Connection Refused

```
Error: ECONNREFUSED
```

- Check `SMTP_HOST` and `SMTP_PORT`
- Verify firewall allows outbound connection
- Try port 465 with `SMTP_SECURE=true`

### Authentication Failed

```
Error: EAUTH
```

- Verify `SMTP_USER` and `SMTP_PASS`
- For Gmail, use App Password
- Check account security settings

### Rate Limited

```
Error: RATE_LIMITED
```

- Reduce `EMAIL_RATE_LIMIT`
- Increase queue size
- Use a higher-tier email provider

### Template Error

```
Error: TemplateError
```

- Check template data structure
- Verify all required fields provided
- Enable `EMAIL_LOG_CONTENT=true` temporarily
