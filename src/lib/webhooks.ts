import { Threat, Brand } from '../types'

interface WebhookPayload {
  event: 'threat.detected' | 'scan.completed' | 'threat.resolved'
  timestamp: string
  data: {
    brand?: Brand
    threat?: Threat
    threats?: Threat[]
    scan_id?: string
  }
}

export async function sendWebhook(
  webhookUrl: string,
  payload: WebhookPayload,
  webhookSecret?: string
): Promise<boolean> {
  if (!webhookUrl) return false

  try {
    const body = JSON.stringify(payload)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'DoppelDown-Webhooks/1.0',
    }

    // Add signature if secret is provided
    if (webhookSecret) {
      const signature = await generateSignature(body, webhookSecret)
      headers['X-DoppelDown-Signature'] = signature
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body,
    })

    return response.ok
  } catch (error) {
    console.error('Webhook delivery failed:', error)
    return false
  }
}

export async function sendThreatDetectedWebhook(
  webhookUrl: string,
  brand: Brand,
  threats: Threat[],
  webhookSecret?: string
): Promise<boolean> {
  return sendWebhook(
    webhookUrl,
    {
      event: 'threat.detected',
      timestamp: new Date().toISOString(),
      data: {
        brand,
        threats,
      },
    },
    webhookSecret
  )
}

export async function sendScanCompletedWebhook(
  webhookUrl: string,
  brand: Brand,
  scanId: string,
  threatsFound: number,
  webhookSecret?: string
): Promise<boolean> {
  return sendWebhook(
    webhookUrl,
    {
      event: 'scan.completed',
      timestamp: new Date().toISOString(),
      data: {
        brand,
        scan_id: scanId,
        threats: [] // Can be populated if needed
      },
    },
    webhookSecret
  )
}

export async function sendThreatResolvedWebhook(
  webhookUrl: string,
  brand: Brand,
  threat: Threat,
  webhookSecret?: string
): Promise<boolean> {
  return sendWebhook(
    webhookUrl,
    {
      event: 'threat.resolved',
      timestamp: new Date().toISOString(),
      data: {
        brand,
        threat,
      },
    },
    webhookSecret
  )
}

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, data)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
