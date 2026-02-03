import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './layout';

interface WelcomeEmailProps {
  userName?: string;
  dashboardUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName = 'there',
  dashboardUrl = 'https://doppeldown.com/dashboard',
}) => {
  return (
    <EmailLayout preview="Welcome to DoppelDown — Your brand protection starts now">
      <Section>
        <Heading style={{
          color: colors.text,
          fontSize: '28px',
          fontWeight: 700,
          margin: '0 0 24px 0',
          lineHeight: 1.2,
        }}>
          Welcome to{' '}
          <span style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            DoppelDown
          </span>
        </Heading>

        <Text style={{
          color: colors.textMuted,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 16px 0',
        }}>
          Hi {userName},
        </Text>

        <Text style={{
          color: colors.textMuted,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
        }}>
          Thanks for signing up! Your brand protection journey starts now. DoppelDown will automatically scan for fake domains, phishing sites, and social media impersonators that could damage your reputation.
        </Text>

        {/* Feature Highlights */}
        <Section style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: '8px',
          padding: '20px',
          margin: '24px 0',
          border: `1px solid ${colors.border}`,
        }}>
          <Text style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: 600,
            margin: '0 0 16px 0',
          }}>
            What&apos;s included in your account:
          </Text>

          {[
            { icon: '🔍', text: 'Automated brand monitoring across domains & social' },
            { icon: '⚡', text: 'AI-powered threat detection with instant alerts' },
            { icon: '📊', text: 'Weekly protection reports delivered to your inbox' },
            { icon: '🛡️', text: 'Evidence collection for takedown requests' },
          ].map((feature, index) => (
            <Text
              key={index}
              style={{
                color: colors.textMuted,
                fontSize: '14px',
                margin: '8px 0',
                lineHeight: 1.5,
              }}
            >
              <span style={{ marginRight: '8px' }}>{feature.icon}</span>
              {feature.text}
            </Text>
          ))}
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '24px 0',
        }}>
          Ready to set up your first brand watch? It only takes 2 minutes.
        </Text>

        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button
            href={dashboardUrl}
            style={{
              backgroundColor: colors.primary,
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              display: 'inline-block',
              boxShadow: `0 4px 14px ${colors.primaryGlow}`,
            }}
          >
            Go to Dashboard
          </Button>
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
        }}>
          Need help getting started? Reply to this email or check out our{' '}
          <a
            href="https://doppeldown.com/docs"
            style={{ color: colors.primary, textDecoration: 'none' }}
          >
            documentation
          </a>
          .
        </Text>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '16px 0 0 0',
        }}>
          Stay secure,
          <br />
          <span style={{ color: colors.text, fontWeight: 600 }}>The DoppelDown Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default WelcomeEmail;
