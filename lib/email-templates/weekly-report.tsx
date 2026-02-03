import {
  Button,
  Heading,
  Hr,
  Row,
  Section,
  Text,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, colors } from './layout';

interface WeeklyReportEmailProps {
  userName?: string;
  weekRange: string;
  brandName: string;
  stats: {
    newThreats: number;
    resolvedThreats: number;
    activeMonitors: number;
    scansPerformed: number;
  };
  threatBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topThreats: Array<{
    type: string;
    url: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    detectedAt: string;
  }>;
  dashboardUrl?: string;
}

const severityColors = {
  critical: colors.danger,
  high: '#f97316',
  medium: colors.warning,
  low: colors.primary,
};

const severityLabels = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

export const WeeklyReportEmail: React.FC<WeeklyReportEmailProps> = ({
  userName = 'there',
  weekRange,
  brandName,
  stats,
  threatBreakdown,
  topThreats,
  dashboardUrl = 'https://doppeldown.com/dashboard',
}) => {
  const totalThreats = stats.newThreats;

  return (
    <EmailLayout preview={`Weekly Brand Protection Report for ${brandName} — ${weekRange}`}>
      <Section>
        <Heading style={{
          color: colors.text,
          fontSize: '26px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          lineHeight: 1.2,
        }}>
          Weekly Protection Report
        </Heading>

        <Text style={{
          color: colors.textMuted,
          fontSize: '15px',
          margin: '0 0 24px 0',
        }}>
          {weekRange} • {brandName}
        </Text>

        <Text style={{
          color: colors.textMuted,
          fontSize: '15px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
        }}>
          Hi {userName}, here&apos;s your weekly summary of brand protection activity. Your automated monitors scanned {stats.scansPerformed.toLocaleString()} times to keep your brand safe.
        </Text>

        {/* Stats Grid */}
        <Section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          margin: '24px 0',
        }}>
          {[
            { label: 'New Threats', value: stats.newThreats, color: stats.newThreats > 0 ? colors.danger : colors.success },
            { label: 'Resolved', value: stats.resolvedThreats, color: colors.success },
            { label: 'Active Monitors', value: stats.activeMonitors, color: colors.primary },
            { label: 'Scans Performed', value: stats.scansPerformed.toLocaleString(), color: colors.accent },
          ].map((stat, index) => (
            <Section
              key={index}
              style={{
                backgroundColor: colors.surfaceElevated,
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                border: `1px solid ${colors.border}`,
              }}
            >
              <Text style={{
                color: stat.color,
                fontSize: '28px',
                fontWeight: 700,
                margin: '0 0 4px 0',
              }}>
                {stat.value}
              </Text>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
              }}>
                {stat.label}
              </Text>
            </Section>
          ))}
        </Section>

        {/* Threat Breakdown */}
        {totalThreats > 0 && (
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
              Threat Severity Breakdown
            </Text>

            <Section>
              {Object.entries(threatBreakdown).map(([severity, count]) => (
                <Row key={severity} style={{ marginBottom: '12px' }}>
                  <Column style={{ width: '80px' }}>
                    <Text style={{
                      color: severityColors[severity as keyof typeof severityColors],
                      fontSize: '11px',
                      fontWeight: 700,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {severityLabels[severity as keyof typeof severityLabels]}
                    </Text>
                  </Column>
                  <Column style={{ flex: 1 }}>
                    <div style={{
                      backgroundColor: colors.surface,
                      borderRadius: '4px',
                      height: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        backgroundColor: severityColors[severity as keyof typeof severityColors],
                        height: '100%',
                        width: `${totalThreats > 0 ? (count / totalThreats) * 100 : 0}%`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </Column>
                  <Column style={{ width: '40px', textAlign: 'right' }}>
                    <Text style={{
                      color: colors.text,
                      fontSize: '14px',
                      fontWeight: 600,
                      margin: 0,
                    }}>
                      {count}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Section>
        )}

        {/* Top Threats */}
        {topThreats.length > 0 && (
          <>
            <Hr style={{
              borderColor: colors.border,
              margin: '32px 0',
            }} />

            <Heading style={{
              color: colors.text,
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 16px 0',
            }}>
              Top Threats This Week
            </Heading>

            {topThreats.slice(0, 3).map((threat, index) => (
              <Section
                key={index}
                style={{
                  backgroundColor: colors.surfaceElevated,
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: `1px solid ${colors.border}`,
                  borderLeft: `4px solid ${severityColors[threat.severity]}`,
                }}
              >
                <Row>
                  <Column>
                    <Text style={{
                      color: colors.text,
                      fontSize: '14px',
                      fontWeight: 600,
                      margin: '0 0 4px 0',
                    }}>
                      {threat.type}
                    </Text>
                    <Text style={{
                      color: colors.textMuted,
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      margin: '0 0 8px 0',
                      wordBreak: 'break-all',
                    }}>
                      {threat.url}
                    </Text>
                    <Text style={{
                      color: colors.textMuted,
                      fontSize: '11px',
                      margin: 0,
                    }}>
                      Detected {threat.detectedAt}
                    </Text>
                  </Column>
                  <Column style={{ width: 'auto', textAlign: 'right' }}>
                    <Text style={{
                      display: 'inline-block',
                      backgroundColor: `${severityColors[threat.severity]}20`,
                      color: severityColors[threat.severity],
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      margin: 0,
                      textTransform: 'uppercase',
                    }}>
                      {severityLabels[threat.severity]}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </>
        )}

        {/* All Clear State */}
        {totalThreats === 0 && (
          <Section style={{
            backgroundColor: `${colors.success}10`,
            borderRadius: '8px',
            padding: '24px',
            margin: '24px 0',
            border: `1px solid ${colors.success}40`,
            textAlign: 'center',
          }}>
            <Text style={{
              fontSize: '40px',
              margin: '0 0 8px 0',
            }}>
              🛡️
            </Text>
            <Text style={{
              color: colors.success,
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 8px 0',
            }}>
              All Clear This Week!
            </Text>
            <Text style={{
              color: colors.textMuted,
              fontSize: '14px',
              margin: 0,
            }}>
              No new threats detected. Your brand is safe and protected.
            </Text>
          </Section>
        )}

        <Hr style={{
          borderColor: colors.border,
          margin: '32px 0',
        }} />

        {/* CTA */}
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
            View Full Report
          </Button>
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
          textAlign: 'center',
        }}>
          You&apos;re receiving this because you have weekly reports enabled for {brandName}.
          <br />
          <a
            href={`${dashboardUrl}/settings/notifications`}
            style={{ color: colors.primary, textDecoration: 'none' }}
          >
            Manage notification preferences
          </a>
        </Text>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
        }}>
          Stay protected,
          <br />
          <span style={{ color: colors.text, fontWeight: 600 }}>The DoppelDown Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default WeeklyReportEmail;
