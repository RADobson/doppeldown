# DoppelDown Webhook Integration Guide

> **Receive real-time notifications** when threats are detected, scans complete, or threats are resolved — instead of polling the API.

---

## Overview

DoppelDown can send HTTP POST requests to your server whenever important events occur. This is ideal for:

- **Security dashboards** — Display new threats as they're found
- **Slack/Teams alerts** — Route threat notifications to your team channels
- **Automated workflows** — Trigger takedown procedures when critical threats appear
- **Audit systems** — Log all scanning activity to your SIEM

---

## Setup

### 1. Configure Your Webhook URL

Set your webhook endpoint in **Dashboard → Settings → Integrations**:

```
https://your-server.com/webhooks/doppeldown
```

### 2. Set a Webhook Secret (Recommended)

A shared secret is used to sign payloads with HMAC-SHA256, so you can verify requests are genuinely from DoppelDown.

Generate a strong secret:
```bash
openssl rand -hex 32
```

Enter it in **Dashboard → Settings → Integrations → Webhook Secret**.

### 3. Verify Signatures

Every webhook request includes an `X-DoppelDown-Signature` header containing the HMAC-SHA256 hex digest of the request body.

#### Node.js / TypeScript
```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express example
app.post('/webhooks/doppeldown', (req, res) => {
  const signature = req.headers['x-doppeldown-signature'];
  const rawBody = JSON.stringify(req.body);

  if (!verifyWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process the event
  handleEvent(req.body);
  res.status(200).json({ received: true });
});
```

#### Python
```python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = "your_webhook_secret"

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

@app.route("/webhooks/doppeldown", methods=["POST"])
def handle_webhook():
    signature = request.headers.get("X-DoppelDown-Signature", "")
    
    if not verify_signature(request.data, signature, WEBHOOK_SECRET):
        return jsonify({"error": "Invalid signature"}), 401
    
    event = request.json
    print(f"Received event: {event['event']}")
    
    # Process the event
    handle_event(event)
    return jsonify({"received": True}), 200
```

---

## Webhook Events

### `threat.detected`

Fired when one or more new threats are discovered during a scan.

```json
{
  "event": "threat.detected",
  "timestamp": "2026-02-05T10:30:00Z",
  "data": {
    "brand": {
      "id": "brand-uuid",
      "name": "Acme Corp",
      "domain": "acme.com"
    },
    "threats": [
      {
        "id": "threat-uuid-1",
        "type": "typosquat_domain",
        "severity": "high",
        "url": "https://acme-corp.xyz",
        "domain": "acme-corp.xyz",
        "status": "new",
        "detected_at": "2026-02-05T10:29:45Z",
        "evidence": {
          "screenshots": [
            {
              "storage_path": "threats/threat-uuid-1/screenshot-0.png",
              "captured_at": "2026-02-05T10:29:50Z"
            }
          ]
        },
        "analysis": {
          "compositeScore": 85,
          "compositeSeverity": "high",
          "domainRiskScore": 90,
          "phishingIntentScore": 75,
          "phishingIntentClass": "suspicious"
        }
      }
    ]
  }
}
```

### `scan.completed`

Fired when a scan finishes (successfully or with partial errors).

```json
{
  "event": "scan.completed",
  "timestamp": "2026-02-05T10:35:00Z",
  "data": {
    "brand": {
      "id": "brand-uuid",
      "name": "Acme Corp",
      "domain": "acme.com"
    },
    "scan_id": "scan-uuid",
    "threats": []
  }
}
```

### `threat.resolved`

Fired when a threat is marked as resolved (takedown confirmed, false positive, etc).

```json
{
  "event": "threat.resolved",
  "timestamp": "2026-02-05T12:00:00Z",
  "data": {
    "brand": {
      "id": "brand-uuid",
      "name": "Acme Corp",
      "domain": "acme.com"
    },
    "threat": {
      "id": "threat-uuid-1",
      "type": "typosquat_domain",
      "severity": "high",
      "url": "https://acme-corp.xyz",
      "status": "resolved",
      "resolved_at": "2026-02-05T12:00:00Z"
    }
  }
}
```

---

## Payload Structure

All webhook payloads follow this structure:

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event type (`threat.detected`, `scan.completed`, `threat.resolved`) |
| `timestamp` | ISO 8601 string | When the event occurred |
| `data` | object | Event-specific payload (always includes `brand`) |
| `data.brand` | object | The brand this event relates to |
| `data.threats` | array | Array of threat objects (for `threat.detected`) |
| `data.threat` | object | Single threat object (for `threat.resolved`) |
| `data.scan_id` | string | Scan UUID (for `scan.completed`) |

---

## Request Headers

Every webhook request includes:

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `User-Agent` | `DoppelDown-Webhooks/1.0` |
| `X-DoppelDown-Signature` | HMAC-SHA256 hex digest (if secret configured) |

---

## Best Practices

### Respond Quickly

Return a `200` status within **5 seconds**. Do heavy processing asynchronously:

```typescript
// ✅ Good — acknowledge immediately, process async
app.post('/webhooks/doppeldown', async (req, res) => {
  res.status(200).json({ received: true });
  
  // Process asynchronously
  setImmediate(() => processEvent(req.body));
});

// ❌ Bad — blocks the response
app.post('/webhooks/doppeldown', async (req, res) => {
  await sendSlackNotification(req.body);     // Slow!
  await updateDatabase(req.body);            // Slow!
  await triggerTakedownWorkflow(req.body);   // Slow!
  res.status(200).json({ received: true });
});
```

### Handle Duplicates

Webhooks may be delivered more than once. Use the event `timestamp` and threat `id` to deduplicate:

```typescript
const processedEvents = new Set<string>();

function handleEvent(event) {
  const key = `${event.event}:${event.timestamp}`;
  if (processedEvents.has(key)) return; // Already processed
  processedEvents.add(key);
  
  // Process event...
}
```

### Verify Signatures in Production

Always verify the `X-DoppelDown-Signature` header in production to prevent spoofed webhook calls.

### Use HTTPS

Your webhook endpoint should use HTTPS to prevent payload interception.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Not receiving webhooks | Check webhook URL in Settings → Integrations. Ensure your server is publicly accessible. |
| Signature verification fails | Ensure you're comparing against the raw request body (not re-serialized JSON). Check the secret matches exactly. |
| Duplicate events | Implement idempotency using event timestamp + entity ID. |
| Webhook endpoint returns 5xx | DoppelDown logs delivery failures. Check your server logs. |

---

## Testing Webhooks Locally

Use a tunnel service to expose your local server:

```bash
# Using ngrok
ngrok http 3000

# Set the ngrok URL as your webhook endpoint
# https://abc123.ngrok.io/webhooks/doppeldown
```

Or use a webhook inspection tool like [webhook.site](https://webhook.site) to see payloads without writing any code.

---

## Related Docs

- [Quick Start Guide](./QUICKSTART.md)
- [Full API Reference](./API.md)
- [Error Handling](./ERROR_HANDLING.md)
