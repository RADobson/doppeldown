# DoppelDown API — SDK & Code Examples

> Copy-paste examples in **JavaScript/TypeScript**, **Python**, and **cURL** for every common operation.

---

## Table of Contents

- [Authentication Setup](#authentication-setup)
- [Brands](#brands)
  - [List Brands](#list-brands)
  - [Create Brand](#create-brand)
  - [Update Brand](#update-brand)
  - [Upload Logo](#upload-logo)
- [Scanning](#scanning)
  - [Start a Scan](#start-a-scan)
  - [Poll Scan Status](#poll-scan-status)
  - [Check Quota](#check-quota)
  - [Cancel a Scan](#cancel-a-scan)
- [Threats & Evidence](#threats--evidence)
  - [Get Evidence Screenshots](#get-evidence-screenshots)
  - [Delete a Threat](#delete-a-threat)
- [Reports](#reports)
  - [Generate Takedown Report](#generate-takedown-report)
  - [List Reports](#list-reports)
- [Notifications](#notifications)
  - [Get Notifications](#get-notifications)
  - [Mark as Read](#mark-as-read)
- [Billing](#billing)
  - [Create Checkout Session](#create-checkout-session)
- [Complete Workflows](#complete-workflows)
  - [Full Scan-to-Report Pipeline](#full-scan-to-report-pipeline)
  - [Continuous Monitoring Script](#continuous-monitoring-script)

---

## Authentication Setup

### JavaScript / TypeScript

```typescript
// doppeldown-client.ts
const BASE_URL = 'https://doppeldown.com/api';
const TOKEN = process.env.DOPPELDOWN_TOKEN!;

async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`API Error ${res.status}: ${error.error?.message || error.error}`);
  }

  return res.json();
}

// Usage: const brands = await api<Brand[]>('/brands');
```

### Python

```python
# doppeldown_client.py
import os
import requests

BASE_URL = "https://doppeldown.com/api"
TOKEN = os.environ["DOPPELDOWN_TOKEN"]

session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
})

def api(method, path, **kwargs):
    """Make an authenticated API request."""
    resp = session.request(method, f"{BASE_URL}{path}", **kwargs)
    resp.raise_for_status()
    return resp.json()

# Usage: brands = api("GET", "/brands")
```

### cURL

```bash
# Set once per session
export DOPPELDOWN_TOKEN="your_token_here"
export API="https://doppeldown.com/api"
```

---

## Brands

### List Brands

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface Brand {
  id: string;
  name: string;
  domain: string;
  keywords: string[];
  threat_count: number;
  status: 'active' | 'paused';
  created_at: string;
}

const brands = await api<Brand[]>('/brands');
console.log(`You have ${brands.length} brand(s)`);

for (const brand of brands) {
  console.log(`  ${brand.name} (${brand.domain}) — ${brand.threat_count} threats`);
}
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
brands = api("GET", "/brands")

print(f"You have {len(brands)} brand(s)")
for brand in brands:
    print(f"  {brand['name']} ({brand['domain']}) — {brand['threat_count']} threats")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -s "$API/brands" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" | jq '.'
```
</details>

---

### Create Brand

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
const newBrand = await api<Brand>('/brands', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Acme Corp',
    domain: 'acme.com',
    keywords: ['acme', 'acmecorp', 'acme-inc'],
    social_handles: {
      twitter: ['@acmecorp', '@acme'],
      instagram: ['acmecorp'],
    },
    enabled_social_platforms: ['twitter', 'instagram', 'linkedin'],
  }),
});

console.log(`Brand created: ${newBrand.id}`);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
new_brand = api("POST", "/brands", json={
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp", "acme-inc"],
    "social_handles": {
        "twitter": ["@acmecorp", "@acme"],
        "instagram": ["acmecorp"],
    },
    "enabled_social_platforms": ["twitter", "instagram", "linkedin"],
})

print(f"Brand created: {new_brand['id']}")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -X POST "$API/brands" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp", "acme-inc"],
    "social_handles": {
      "twitter": ["@acmecorp"],
      "instagram": ["acmecorp"]
    },
    "enabled_social_platforms": ["twitter", "instagram", "linkedin"]
  }'
```
</details>

---

### Update Brand

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
const updated = await api<Brand>('/brands', {
  method: 'PATCH',
  body: JSON.stringify({
    brandId: 'your-brand-uuid',
    keywords: ['acme', 'acmecorp', 'acme-inc', 'acme-corp'],
    enabled_social_platforms: ['twitter', 'instagram', 'linkedin', 'tiktok'],
  }),
});
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
updated = api("PATCH", "/brands", json={
    "brandId": "your-brand-uuid",
    "keywords": ["acme", "acmecorp", "acme-inc", "acme-corp"],
    "enabled_social_platforms": ["twitter", "instagram", "linkedin", "tiktok"],
})
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -X PATCH "$API/brands" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "your-brand-uuid",
    "keywords": ["acme", "acmecorp", "acme-inc", "acme-corp"]
  }'
```
</details>

---

### Upload Logo

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
import fs from 'fs';
import FormData from 'form-data';

const form = new FormData();
form.append('brandId', 'your-brand-uuid');
form.append('logo', fs.createReadStream('./logo.png'));

const res = await fetch(`${BASE_URL}/brands/logo`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${TOKEN}` },
  body: form,
});

const result = await res.json();
console.log(`Logo uploaded: ${result.logo_url}`);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
with open("logo.png", "rb") as f:
    resp = session.post(
        f"{BASE_URL}/brands/logo",
        data={"brandId": "your-brand-uuid"},
        files={"logo": ("logo.png", f, "image/png")},
        headers={"Content-Type": None},  # Let requests set multipart headers
    )
    result = resp.json()
    print(f"Logo uploaded: {result['logo_url']}")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -X POST "$API/brands/logo" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -F "brandId=your-brand-uuid" \
  -F "logo=@./logo.png"
```
</details>

---

## Scanning

### Start a Scan

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface ScanResponse {
  message: string;
  scanId: string;
  jobId: string;
}

// Full scan (domains + web + social)
const scan = await api<ScanResponse>('/scan', {
  method: 'POST',
  body: JSON.stringify({
    brandId: 'your-brand-uuid',
    scanType: 'full',  // Options: full, quick, domain_only, web_only, social_only
  }),
});

console.log(`Scan started: ${scan.scanId}`);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
scan = api("POST", "/scan", json={
    "brandId": "your-brand-uuid",
    "scanType": "full",
})

print(f"Scan started: {scan['scanId']}")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -X POST "$API/scan" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"brandId": "your-brand-uuid", "scanType": "full"}'
```
</details>

#### Scan Types Explained

| Type | What it checks | Speed | Best for |
|------|----------------|-------|----------|
| `full` | Domains + web pages + social media | 1–5 min | Comprehensive check |
| `quick` | Reduced domain variations | 30s–1 min | Fast check |
| `domain_only` | Only typosquatting domains | 30s–2 min | Domain monitoring |
| `web_only` | Only web search results | 30s–1 min | Brand mention monitoring |
| `social_only` | Only social media accounts | 30s–2 min | Social impersonation |

---

### Poll Scan Status

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface ScanStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  threats_found: number;
  domains_checked: number;
  pages_scanned: number;
  completed_at: string | null;
  error: string | null;
}

async function waitForScan(scanId: string, intervalMs = 5000): Promise<ScanStatus> {
  while (true) {
    const status = await api<ScanStatus>(`/scan?id=${scanId}`);
    
    console.log(`Scan ${status.status}: ${status.domains_checked} domains, ${status.threats_found} threats`);
    
    if (['completed', 'failed', 'cancelled'].includes(status.status)) {
      return status;
    }
    
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

// Usage
const result = await waitForScan('scan-uuid');
if (result.status === 'completed') {
  console.log(`Done! Found ${result.threats_found} threats.`);
}
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
import time

def wait_for_scan(scan_id, interval=5):
    """Poll until scan completes."""
    while True:
        status = api("GET", f"/scan?id={scan_id}")
        
        state = status["status"]
        print(f"Scan {state}: {status['domains_checked']} domains, {status['threats_found']} threats")
        
        if state in ("completed", "failed", "cancelled"):
            return status
        
        time.sleep(interval)

# Usage
result = wait_for_scan("scan-uuid")
if result["status"] == "completed":
    print(f"Done! Found {result['threats_found']} threats.")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
# One-liner: poll every 5 seconds until done
while true; do
  STATUS=$(curl -s "$API/scan?id=$SCAN_ID" \
    -H "Authorization: Bearer $DOPPELDOWN_TOKEN")
  echo "$STATUS" | jq '{status, threats_found, domains_checked}'
  
  echo "$STATUS" | jq -e '.status == "completed" or .status == "failed"' > /dev/null && break
  sleep 5
done
```
</details>

---

### Check Quota

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface Quota {
  limit: number | null;
  used: number;
  remaining: number | null;
  resetsAt: number | null;
  isUnlimited: boolean;
}

const quota = await api<Quota>('/scan/quota');

if (quota.isUnlimited) {
  console.log('Unlimited scans available');
} else {
  console.log(`${quota.remaining}/${quota.limit} scans remaining`);
  if (quota.resetsAt) {
    console.log(`Resets at: ${new Date(quota.resetsAt).toISOString()}`);
  }
}
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
quota = api("GET", "/scan/quota")

if quota["isUnlimited"]:
    print("Unlimited scans available")
else:
    print(f"{quota['remaining']}/{quota['limit']} scans remaining")
```
</details>

---

### Cancel a Scan

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
await api('/scan/cancel', {
  method: 'POST',
  body: JSON.stringify({ scanId: 'scan-uuid' }),
});
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
api("POST", "/scan/cancel", json={"scanId": "scan-uuid"})
```
</details>

---

## Threats & Evidence

### Get Evidence Screenshots

Evidence files are stored privately. Generate a temporary signed URL to view them:

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface SignedUrl {
  signedUrl: string;
  expiresIn: number;
  bucket: string;
  path: string;
}

// Get a signed URL for a threat's screenshot (valid 2 hours)
const evidence = await api<SignedUrl>('/evidence/sign', {
  method: 'POST',
  body: JSON.stringify({
    threatId: 'threat-uuid',
    kind: 'screenshot',    // or 'html'
    index: 0,              // 0-based index if multiple screenshots
    expiresIn: 7200,       // seconds (default: 3600)
  }),
});

console.log(`View screenshot: ${evidence.signedUrl}`);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
evidence = api("POST", "/evidence/sign", json={
    "threatId": "threat-uuid",
    "kind": "screenshot",
    "expiresIn": 7200,
})

print(f"View screenshot: {evidence['signedUrl']}")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
# POST method
curl -X POST "$API/evidence/sign" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threatId": "threat-uuid", "kind": "screenshot", "expiresIn": 7200}'

# GET method (alternative)
curl "$API/evidence/sign?threatId=threat-uuid&kind=screenshot&expiresIn=7200" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN"
```
</details>

---

### Delete a Threat

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
// ⚠️ Irreversible — deletes threat and associated evidence
await api('/threats/threat-uuid', { method: 'DELETE' });
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
api("DELETE", "/threats/threat-uuid")
```
</details>

---

## Reports

### Generate Takedown Report

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
// Generate HTML takedown report for all unresolved threats
const res = await fetch(`${BASE_URL}/reports`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    brandId: 'your-brand-uuid',
    format: 'html',           // html, text, csv, json
    ownerName: 'Acme Legal',
  }),
});

const reportId = res.headers.get('X-Report-Id');
const html = await res.text();

// Save to file
import fs from 'fs';
fs.writeFileSync(`takedown-${reportId}.html`, html);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
resp = session.post(f"{BASE_URL}/reports", json={
    "brandId": "your-brand-uuid",
    "format": "html",
    "ownerName": "Acme Legal",
})

report_id = resp.headers.get("X-Report-Id")
with open(f"takedown-{report_id}.html", "wb") as f:
    f.write(resp.content)

print(f"Report saved: takedown-{report_id}.html")
```
</details>

<details>
<summary><strong>cURL</strong></summary>

```bash
curl -X POST "$API/reports" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"brandId": "your-brand-uuid", "format": "csv"}' \
  -o takedown-report.csv
```
</details>

---

### List Reports

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
// All reports
const reports = await api<Report[]>('/reports');

// Reports for a specific brand
const brandReports = await api<Report[]>('/reports?brandId=your-brand-uuid');
```
</details>

---

## Notifications

### Get Notifications

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
interface NotificationResponse {
  notifications: Array<{
    id: string;
    type: 'threat_detected' | 'scan_completed' | 'scan_failed';
    title: string;
    message: string;
    read: boolean;
    created_at: string;
  }>;
  unread_count: number;
}

const { notifications, unread_count } = await api<NotificationResponse>('/notifications');

console.log(`${unread_count} unread notifications`);
for (const n of notifications.filter(n => !n.read)) {
  console.log(`  [${n.type}] ${n.title}`);
}
```
</details>

---

### Mark as Read

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
// Mark all as read
await api('/notifications', {
  method: 'PATCH',
  body: JSON.stringify({ mark_all_read: true }),
});

// Mark specific ones
await api('/notifications', {
  method: 'PATCH',
  body: JSON.stringify({ ids: ['notif-1', 'notif-2'] }),
});
```
</details>

---

## Billing

### Create Checkout Session

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
const checkout = await api<{ url: string }>('/stripe/checkout', {
  method: 'POST',
  body: JSON.stringify({
    plan: 'professional',  // starter, professional, enterprise
  }),
});

// Redirect user to Stripe checkout
window.location.href = checkout.url;
```
</details>

---

## Complete Workflows

### Full Scan-to-Report Pipeline

End-to-end: create a brand, scan it, and generate a report.

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
async function scanAndReport(brandName: string, domain: string) {
  // 1. Create brand
  console.log(`Creating brand: ${brandName}...`);
  const brand = await api<Brand>('/brands', {
    method: 'POST',
    body: JSON.stringify({ name: brandName, domain }),
  });

  // 2. Start scan
  console.log('Starting scan...');
  const scan = await api<ScanResponse>('/scan', {
    method: 'POST',
    body: JSON.stringify({ brandId: brand.id, scanType: 'full' }),
  });

  // 3. Wait for completion
  const result = await waitForScan(scan.scanId);

  if (result.threats_found === 0) {
    console.log('✅ No threats detected!');
    return;
  }

  console.log(`⚠️ ${result.threats_found} threats detected!`);

  // 4. Generate takedown report
  console.log('Generating report...');
  const reportRes = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brandId: brand.id,
      format: 'html',
      ownerName: brandName,
    }),
  });

  const reportId = reportRes.headers.get('X-Report-Id');
  const html = await reportRes.text();
  
  const fs = await import('fs');
  fs.writeFileSync(`report-${reportId}.html`, html);
  console.log(`📄 Report saved: report-${reportId}.html`);
}

// Run it
await scanAndReport('Acme Corp', 'acme.com');
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
import time

def scan_and_report(brand_name, domain):
    # 1. Create brand
    print(f"Creating brand: {brand_name}...")
    brand = api("POST", "/brands", json={"name": brand_name, "domain": domain})

    # 2. Start scan
    print("Starting scan...")
    scan = api("POST", "/scan", json={"brandId": brand["id"], "scanType": "full"})

    # 3. Wait for completion
    result = wait_for_scan(scan["scanId"])

    if result["threats_found"] == 0:
        print("✅ No threats detected!")
        return

    print(f"⚠️ {result['threats_found']} threats detected!")

    # 4. Generate takedown report
    print("Generating report...")
    resp = session.post(f"{BASE_URL}/reports", json={
        "brandId": brand["id"],
        "format": "html",
        "ownerName": brand_name,
    })

    report_id = resp.headers.get("X-Report-Id", "unknown")
    filename = f"report-{report_id}.html"
    with open(filename, "wb") as f:
        f.write(resp.content)
    print(f"📄 Report saved: {filename}")

# Run it
scan_and_report("Acme Corp", "acme.com")
```
</details>

---

### Continuous Monitoring Script

Run periodic scans across all brands.

<details>
<summary><strong>Python</strong></summary>

```python
import time
import sys

def monitor_all_brands(interval_hours=24):
    """Continuously scan all brands on a schedule."""
    while True:
        brands = api("GET", "/brands")
        print(f"\n{'='*60}")
        print(f"Scanning {len(brands)} brand(s)...")
        print(f"{'='*60}")
        
        for brand in brands:
            try:
                print(f"\n🔍 Scanning {brand['name']} ({brand['domain']})...")
                
                scan = api("POST", "/scan", json={
                    "brandId": brand["id"],
                    "scanType": "full",
                })
                
                result = wait_for_scan(scan["scanId"])
                
                if result["threats_found"] > 0:
                    print(f"  ⚠️  {result['threats_found']} threats found!")
                else:
                    print(f"  ✅  Clean — no threats")
                    
            except Exception as e:
                if "409" in str(e):
                    print(f"  ⏭️  Scan already running, skipping")
                elif "429" in str(e):
                    print(f"  ⏸️  Quota exceeded, waiting")
                else:
                    print(f"  ❌  Error: {e}")
        
        print(f"\n💤 Next scan in {interval_hours} hours...")
        time.sleep(interval_hours * 3600)

if __name__ == "__main__":
    monitor_all_brands(interval_hours=24)
```
</details>

---

## Related Docs

- [Quick Start Guide](./QUICKSTART.md) — Get started in 5 minutes
- [Full API Reference](./API.md) — Complete endpoint documentation
- [Webhook Integration](./WEBHOOKS.md) — Real-time event notifications
- [Error Handling](./ERROR_HANDLING.md) — Error codes and resilience patterns
