import {
  Button,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './layout';

interface ThreatAlertEmailProps {
  userName?: string;
  brandName: string;
  threatType: 'domain' | 'phishing' | 'social' | 'trademark';
  threatUrl: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  similarityScore: number;
  threatId: string;
  dashboardUrl?: string;
}

const severityConfig = {
  critical: { color: colors.danger, label: 'CRITICAL', glow: 'rgba(239, 68, 68, 0.5)' },
  high: { color: '#f97316', label: 'HIGH', glow: 'rgba(249, 115, 22, 0.5)' },
  medium: { color: colors.warning, label: 'MEDIUM', glow: 'rgba(245, 158, 11, 0.5)' },
  low: { color: colors.primary, label: 'LOW', glow: 'rgba(59, 130, 246, 0.5)' },
};

const threatTypeLabels = {
  domain: 'Suspicious Domain',
  phishing: 'Phishing Site',
  social: 'Social Media Impersonator',
  trademark: 'Trademark Violation',
};

export const ThreatAlertEmail: React.FC<ThreatAlertEmailProps> = ({
  userName = 'there',
  brandName,
  threatType,
  threatUrl,
  severity,
  detectedAt,
  similarityScore,
  threatId,
  dashboardUrl = 'https://doppeldown.com/dashboard/threats',
}) => {
  const severityStyle = severityConfig[severity];

  return (
    <EmailLayout preview={`🚨 Threat Alert: ${threatTypeLabels[threatType]} detected for ${brandName}`}>
      <Section>
        {/* Alert Badge */}
        <Section style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <Text style={{
            display: 'inline-block',
            backgroundColor: `${severityStyle.color}20`,
            color: severityStyle.color,
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            border: `1px solid ${severityStyle.color}40`,
            margin: 0,
          }}>
            🚨 {severityStyle.label} PRIORITY THREAT
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
          New Threat Detected for{' '}
          <span style={{ color: colors.primary }}>{brandName}</span>
        </Heading>

        <Text style={{
          color: colors.textMuted,
          fontSize: '15px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
          textAlign: 'center',
        }}>
          Hi {userName}, our AI has identified a potential impersonation attempt targeting your brand. Immediate action may be required.
        </Text>

        {/* Threat Details Card */}
        <Section style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: '8px',
          padding: '24px',
          margin: '24px 0',
          border: `1px solid ${severityStyle.color}40`,
          boxShadow: `0 0 20px ${severityStyle.glow}20`,
        }}>
          <Row>
            <Text style={{
              color: colors.textMuted,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 8px 0',
            }}>
              Threat Type
            </Text>
            <Text style={{
              color: colors.text,
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 16px 0',
            }}>
              {threatTypeLabels[threatType]}
            </Text>
          </Row>

          <Row>
            <Text style={{
              color: colors.textMuted,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '16px 0 8px 0',
            }}>
              Detected URL / Handle
            </Text>
            <Text style={{
              color: colors.danger,
              fontSize: '14px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              margin: '0 0 16px 0',
              backgroundColor: `${colors.danger}10`,
              padding: '8px 12px',
              borderRadius: '4px',
            }}>
              {threatUrl}
            </Text>
          </Row>

          <Row style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '16px 0 8px 0',
              }}>
                Brand Similarity
              </Text>
              <Text style={{
                color: similarityScore > 80 ? colors.danger : similarityScore > 60 ? colors.warning : colors.success,
                fontSize: '24px',
                fontWeight: 700,
                margin: 0,
              }}>
                {similarityScore}%
              </Text>
            </div>

            <div style={{ flex: 1 }}>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '16px 0 8px 0',
              }}>
                Detected At
              </Text>
              <Text style={{
                color: colors.text,
                fontSize: '14px',
                fontWeight: 500,
                margin: 0,
              }}>
                {detectedAt}
              </Text>
            </div>
          </Row>

          <Text style={{
            color: colors.textMuted,
            fontSize: '12px',
            margin: '16px 0 0 0',
          }}>
            Threat ID: <span style={{ fontFamily: 'monospace' }}>{threatId}</span>
          </Text>
        </Section>

        {/* Risk Assessment */}
        <Section style={{
          backgroundColor: `${severityStyle.color}10`,
          borderRadius: '8px',
          padding: '16px 20px',
          margin: '24px 0',
          borderLeft: `4px solid ${severityStyle.color}`,
        }}>
          <Text style={{
            color: colors.text,
            fontSize: '14px',
            fontWeight: 600,
            margin: '0 0 8px 0',
          }}>
            Risk Assessment
          </Text>
          <Text style={{
            color: colors.textMuted,
            fontSize: '14px',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {severity === 'critical' && 'This threat poses immediate risk to your customers and brand reputation. Customers may be actively targeted.'}
            {severity === 'high' && 'This threat has significant potential to confuse customers and damage your brand. Review recommended.'}
            {severity === 'medium' && 'This threat shows moderate similarity to your brand. Monitor for escalation.'}
            {severity === 'low' && 'This threat has been flagged for your awareness. Low immediate risk detected.'}
          </Text>
        </Section>

        <Hr style={{
          borderColor: colors.border,
          margin: '32px 0',
        }} />

        {/* CTA Buttons */}
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button
            href={`${dashboardUrl}/${threatId}`}
            style={{
              backgroundColor: severityStyle.color,
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              display: 'inline-block',
              boxShadow: `0 4px 14px ${severityStyle.glow}`,
            }}
          >
            View Threat Details
          </Button>
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
          textAlign: 'center',
        }}>
          You can also initiate a takedown request or mark this as a false positive from your dashboard.
        </Text>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
        }}>
          Stay vigilant,
          <br />
          <span style={{ color: colors.text, fontWeight: 600 }}>The DoppelDown Security Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default ThreatAlertEmail;
