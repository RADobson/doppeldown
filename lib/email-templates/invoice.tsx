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

interface InvoiceEmailProps {
  userName?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  planName: string;
  billingPeriod: string;
  amount: string;
  subtotal: string;
  tax: string;
  taxRate: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'failed';
  dashboardUrl?: string;
  invoicePdfUrl?: string;
}

const statusConfig = {
  paid: { color: colors.success, label: 'PAID', bgColor: `${colors.success}20` },
  pending: { color: colors.warning, label: 'PENDING', bgColor: `${colors.warning}20` },
  failed: { color: colors.danger, label: 'PAYMENT FAILED', bgColor: `${colors.danger}20` },
};

export const InvoiceEmail: React.FC<InvoiceEmailProps> = ({
  userName = 'there',
  invoiceNumber,
  invoiceDate,
  dueDate,
  planName,
  billingPeriod,
  amount,
  subtotal,
  tax,
  taxRate,
  paymentMethod,
  status,
  dashboardUrl = 'https://doppeldown.com/dashboard/billing',
  invoicePdfUrl,
}) => {
  const statusStyle = statusConfig[status];

  return (
    <EmailLayout preview={`Invoice ${invoiceNumber} from DoppelDown — ${status === 'paid' ? 'Thank you for your payment' : 'Payment required'}`}>
      <Section>
        {/* Status Badge */}
        <Section style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <Text style={{
            display: 'inline-block',
            backgroundColor: statusStyle.bgColor,
            color: statusStyle.color,
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            border: `1px solid ${statusStyle.color}40`,
            margin: 0,
          }}>
            {status === 'paid' && '✓ '}
            {statusStyle.label}
          </Text>
        </Section>

        <Heading style={{
          color: colors.text,
          fontSize: '24px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          lineHeight: 1.3,
          textAlign: 'center',
        }}>
          {status === 'paid' ? 'Thank You for Your Payment' : 'Payment Required'}
        </Heading>

        <Text style={{
          color: colors.textMuted,
          fontSize: '15px',
          lineHeight: 1.6,
          margin: '0 0 24px 0',
          textAlign: 'center',
        }}>
          Hi {userName}, here&apos;s your invoice for DoppelDown brand protection services.
        </Text>

        {/* Invoice Details Card */}
        <Section style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: '8px',
          padding: '24px',
          margin: '24px 0',
          border: `1px solid ${colors.border}`,
        }}>
          {/* Invoice Header */}
          <Row style={{ marginBottom: '24px' }}>
            <Column>
              <Text style={{
                color: colors.text,
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 4px 0',
              }}>
                DoppelDown
              </Text>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                margin: 0,
              }}>
                Brand Protection Services
              </Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                margin: '0 0 4px 0',
              }}>
                Invoice #{invoiceNumber}
              </Text>
              <Text style={{
                color: colors.textMuted,
                fontSize: '12px',
                margin: 0,
              }}>
                {invoiceDate}
              </Text>
            </Column>
          </Row>

          <Hr style={{
            borderColor: colors.border,
            margin: '16px 0',
          }} />

          {/* Line Items */}
          <Section>
            <Row style={{ marginBottom: '12px' }}>
              <Column>
                <Text style={{
                  color: colors.text,
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: '0 0 4px 0',
                }}>
                  {planName}
                </Text>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '12px',
                  margin: 0,
                }}>
                  Billing period: {billingPeriod}
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{
                  color: colors.text,
                  fontSize: '14px',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  {subtotal}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{
            borderColor: colors.border,
            margin: '16px 0',
          }} />

          {/* Totals */}
          <Section>
            <Row style={{ marginBottom: '8px' }}>
              <Column>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '13px',
                  margin: 0,
                }}>
                  Subtotal
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '13px',
                  margin: 0,
                }}>
                  {subtotal}
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: '12px' }}>
              <Column>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '13px',
                  margin: 0,
                }}>
                  Tax ({taxRate})
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '13px',
                  margin: 0,
                }}>
                  {tax}
                </Text>
              </Column>
            </Row>

            <Row>
              <Column>
                <Text style={{
                  color: colors.text,
                  fontSize: '16px',
                  fontWeight: 700,
                  margin: 0,
                }}>
                  Total
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={{
                  color: colors.text,
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: 0,
                }}>
                  {amount}
                </Text>
              </Column>
            </Row>
          </Section>

          {status === 'paid' && (
            <>
              <Hr style={{
                borderColor: colors.border,
                margin: '16px 0',
              }} />
              <Section>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '12px',
                  margin: '0 0 4px 0',
                }}>
                  Paid via {paymentMethod}
                </Text>
                <Text style={{
                  color: colors.success,
                  fontSize: '12px',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  Payment confirmed on {invoiceDate}
                </Text>
              </Section>
            </>
          )}

          {status === 'pending' && (
            <>
              <Hr style={{
                borderColor: colors.border,
                margin: '16px 0',
              }} />
              <Section>
                <Text style={{
                  color: colors.warning,
                  fontSize: '12px',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  Payment due by {dueDate}
                </Text>
              </Section>
            </>
          )}

          {status === 'failed' && (
            <>
              <Hr style={{
                borderColor: colors.border,
                margin: '16px 0',
              }} />
              <Section style={{
                backgroundColor: `${colors.danger}10`,
                borderRadius: '6px',
                padding: '12px',
                marginTop: '12px',
              }}>
                <Text style={{
                  color: colors.danger,
                  fontSize: '13px',
                  fontWeight: 600,
                  margin: '0 0 4px 0',
                }}>
                  Payment Failed
                </Text>
                <Text style={{
                  color: colors.textMuted,
                  fontSize: '12px',
                  margin: 0,
                }}>
                  We couldn&apos;t process your {paymentMethod}. Please update your payment method to avoid service interruption.
                </Text>
              </Section>
            </>
          )}
        </Section>

        <Hr style={{
          borderColor: colors.border,
          margin: '32px 0',
        }} />

        {/* CTA Buttons */}
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          {status === 'paid' && invoicePdfUrl && (
            <Button
              href={invoicePdfUrl}
              style={{
                backgroundColor: colors.surfaceElevated,
                color: colors.text,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                display: 'inline-block',
                border: `1px solid ${colors.border}`,
                marginRight: '12px',
              }}
            >
              Download PDF
            </Button>
          )}

          {status === 'pending' && (
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
              Pay Invoice
            </Button>
          )}

          {status === 'failed' && (
            <Button
              href={`${dashboardUrl}/payment-method`}
              style={{
                backgroundColor: colors.danger,
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                display: 'inline-block',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              }}
            >
              Update Payment Method
            </Button>
          )}

          <Button
            href={dashboardUrl}
            style={{
              backgroundColor: 'transparent',
              color: colors.textMuted,
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-block',
              marginLeft: '12px',
            }}
          >
            View Billing History
          </Button>
        </Section>

        {/* Questions */}
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
            Questions about your invoice?
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
              contact our billing team
            </a>
            . We&apos;re happy to help.
          </Text>
        </Section>

        <Text style={{
          color: colors.textMuted,
          fontSize: '14px',
          lineHeight: 1.6,
          margin: '24px 0 0 0',
        }}>
          Thank you for choosing DoppelDown,
          <br />
          <span style={{ color: colors.text, fontWeight: 600 }}>The DoppelDown Team</span>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default InvoiceEmail;
