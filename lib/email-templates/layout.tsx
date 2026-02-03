import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview: string;
}

// Brand colors matching the DoppelDown cyber aesthetic
const colors = {
  background: '#0a0a0f',
  surface: '#111827',
  surfaceElevated: '#1f2937',
  primary: '#3b82f6',
  primaryGlow: 'rgba(59, 130, 246, 0.5)',
  accent: '#8b5cf6',
  text: '#f9fafb',
  textMuted: '#9ca3af',
  border: '#374151',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const EmailLayout: React.FC<EmailLayoutProps> = ({ children, preview }) => {
  return (
    <Html>
      <Head>
        <style>
          {`
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 12px !important;
              }
              .content {
                padding: 24px 16px !important;
              }
              .logo-text {
                font-size: 20px !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{
        backgroundColor: colors.background,
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}>
        <Container className="container" style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '24px',
        }}>
          {/* Header with Logo */}
          <Section style={{
            textAlign: 'center',
            padding: '24px 0',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <Link href="https://doppeldown.com" style={{
              textDecoration: 'none',
            }}>
              <Text className="logo-text" style={{
                fontSize: '24px',
                fontWeight: 700,
                color: colors.text,
                margin: 0,
                letterSpacing: '-0.025em',
              }}>
                doppel<span style={{ color: colors.primary }}>_</span>down
              </Text>
            </Link>
          </Section>

          {/* Main Content */}
          <Section className="content" style={{
            backgroundColor: colors.surface,
            borderRadius: '12px',
            padding: '32px 24px',
            marginTop: '24px',
            border: `1px solid ${colors.border}`,
          }}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={{
            textAlign: 'center',
            padding: '32px 24px',
            borderTop: `1px solid ${colors.border}`,
            marginTop: '24px',
          }}>
            <Text style={{
              color: colors.textMuted,
              fontSize: '14px',
              margin: '0 0 8px 0',
            }}>
              © {new Date().getFullYear()} DoppelDown. All rights reserved.
            </Text>
            <Text style={{
              color: colors.textMuted,
              fontSize: '12px',
              margin: '0 0 16px 0',
            }}>
              Brand Protection & Phishing Detection
            </Text>
            <Link
              href="https://doppeldown.com/unsubscribe"
              style={{
                color: colors.textMuted,
                fontSize: '12px',
                textDecoration: 'underline',
              }}
            >
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export { colors };
