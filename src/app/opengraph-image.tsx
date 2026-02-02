import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DoppelDown - AI Brand Protection for SMBs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            D
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            DoppelDown
          </span>
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#a5b4fc',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Brand protection that doesn&apos;t cost $15K/year
        </div>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '40px',
            fontSize: '18px',
            color: '#94a3b8',
          }}
        >
          <span>🔍 Detect Threats</span>
          <span>📸 Collect Evidence</span>
          <span>⚡ Take Action</span>
        </div>
        <div
          style={{
            marginTop: '40px',
            padding: '12px 32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          Start Free — No Credit Card Required
        </div>
      </div>
    ),
    { ...size }
  )
}
