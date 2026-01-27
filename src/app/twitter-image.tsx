import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DoppelDown - Take Down Brand Impostors'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111827',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          doppel<span style={{ color: '#2563eb' }}>_</span>down
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#9ca3af',
            marginTop: 24,
          }}
        >
          Take Down Brand Impostors
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
