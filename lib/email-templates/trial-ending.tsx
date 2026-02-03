import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './layout';

interface TrialEndingEmailProps {
  userName?: string;
  daysRemaining: number; // 3 or 1
  trialEndDate: string;
  planName: string;
  planPrice: string;
  threatsDetected: number;
  dashboardUrl?: string;
  upgradeUrl?: string;
}

export const TrialEndingEmail: React.FC<TrialEndingEmailProps> = ({
  userName = 'there',
  daysRemaining,
  trialEndDate,
  planName,
  planPrice,
  threatsDetected,
  dashboardUrl = 'https://doppeldown.com/dashboard',
  upgradeUrl = 'https://doppeldown.com/pricing',
}) => {
  const isFinalDay = daysRemaining === 1;
  const urgencyColor = isFinalDay ? colors.danger : colors.warning;
  const urgencyGlow = isFinalDay ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)';

  return (
    <EmailLayout preview={`${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left on your DoppelDown trial`}>
      <Section>
        {/* Urgency Badge */}
        <Section style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <Text style={{
            display: 'inline-block',
            backgroundColor: `${urgencyColor}20`,
            color: urgencyColor,
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            border: `1px solid ${urgencyColor}40`,
            margin: 0,
          }}>
            ⏰ {daysRemaining} DAY{daysRemaining > 1 ? 'S' : ''} LEFT
          </Text>
        </Section>

        <Heading style={{
          color: colors.text,
          fontSize: '24px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          lineHeight: 1.3,
          textAlign: 'center',
        }}>
          Your Trial {isFinalDay ? 'Ends Tomorrow' : 'Ends Soon'}
        </Heading>

        <Text style={{
          color: colors.textMuted,
          fontSize: '15px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
          textAlign: 'center',
        }}>
          Hi {userName}, your free trial of DoppelDown expires on{' '}
          <span style={{ color: colors.text, fontWeight: 600 }}>{trialEndDate}</span>.
          Don&apos;t lose your brand protection — upgrade now to stay secure.
        </Text>

        {/* Trial Stats */}
        <Section style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: '8px',
          padding: '24px',
          margin: '24px 0',
          border: `1px solid ${colors.border}`,
        }}>
          <Text style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: 600,
            margin: '0 0 16px 0',
            textAlign: 'center',
          }}>
            Your Trial at a Glance
          </Text>

          <Section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: colors.surface,
              borderRadius: '8px',
            }}>
              <Text style={{
                color: threatsDetected > 0 ? colors.danger : colors.success,
                fontSize: '32px',
                fontWeight: 700,
                margin: '0 0 4px 0',
              }}>
                {threatsDetected}
              </Text>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                margin: 0,
              }}>
                Threats Detected
              </Text>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: colors.surface,
              borderRadius: '8px',
            }}>
              <Text style={{
                color: colors.primary,
                fontSize: '32px',
                fontWeight: 700,
                margin: '0 0 4px 0',
              }}>
                24/7
              </Text>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                margin: 0,
              }}>
                Monitoring Active
              </Text>
            </div>
          </Section>

          {threatsDetected > 0 && (
            <Text style={{
              color: colors.textMuted,
              fontSize: '13px',
              textAlign: 'center',
              margin: '16px 0 0 0',
              fontStyle: 'italic',
            }}>
              Without an active subscription, these threats will no longer be monitored.
            </Text>
          )}
        </Section>

        {/* Recommended Plan */}
        <Section style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: '8px',
          padding: '24px',
          margin: '24px 0',
          border: `2px solid ${colors.primary}`,
          boxShadow: `0 0 20px ${colors.primaryGlow}30`,
          position: 'relative',
        }}>
          <Text style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: colors.primary,
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            Recommended
          </Text>

          <Text style={{
            color: colors.text,
            fontSize: '20px',
            fontWeight: 700,
            margin: '8px 0 4px 0',
            textAlign: 'center',
          }}>
            {planName}
          </Text>

          <Text style={{
            color: colors.textMuted,
            fontSize: '14px',
            margin: '0 0 16px 0',
            textAlign: 'center',
          }}>
            {planPrice} — Cancel anytime
          </Text>

          <Section style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '16px',
          }}>
            {[
              'Unlimited brand monitors',
              'AI-powered threat detection',
              'Instant email alerts',
              'Weekly protection reports',
              'Evidence collection tools',
              'Priority support',
            ].map((feature, index) => (
              <Text
                key={index}
                style={{
                  color: colors.textMuted,
                  fontSize: '14px',
                  margin: '8px 0',
                }}
              >
                <span style={{ color: colors.success, marginRight: '8px' }}>✓</span>
                {feature}
              </Text>
            ))}
          </Section>
        </Section>

        <Hr style={{
          borderColor: colors.border,
          margin: '32px 0',
        }} />

        {/* CTA Buttons */}
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button
            href={upgradeUrl}
            style={{
              backgroundColor: urgencyColor,
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              display: 'inline-block',
              boxShadow: `0 4px 14px ${urgencyGlow}`,
              marginBottom: '12px',
            }}
          >
            Upgrade Now
          </Button>

          <Text style={{
            color: colors.textMuted,
            fontSize: '13px',
            margin: '8px 0 0 0',
          }}>
            or{' '}
            <a
              href={dashboardUrl}
              style={{ color: colors.primary, textDecoration: 'none' }}
            >
              review your account
            </a>
          </Text>
        </Section>

        {/* FAQ / Help */}
        <Section style={{
          backgroundColor: `${colors.primary}10`,
          borderRadius: '8px',
          padding: '20px',
          margin: '24px 0',
          borderLeft: `4px solid ${colors.primary}`,
        }}>
          <Text style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: 600,
            margin: '0 0 8px 0',
          }}>
            Questions?
          </Text>
          <Text style={{
            color: colors.textMuted,
            fontSize: '13px',
            lineHeight: 1.5,
            margin: 0,
          }}>
            Reply to this email or{' '}
            <a
              href="https://doppeldown.com/contact"
              style={{ color: colors.primary, textDecoration: 'none' }}
            >
              contact our team
            </a>
            . We&apos;re here to help you choose the right protection plan.
          </Text>
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
        }}>
          Thanks for trying DoppelDown,
          <br />
          <span style={{ color: colors.text, fontWeight: 600 }}>The DoppelDown Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default TrialEndingEmail;
