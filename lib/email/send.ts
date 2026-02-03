import { Resend } from 'resend';
import { ReactElement } from 'react';
import { render } from '@react-email/render';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'DoppelDown <noreply@doppeldown.com>';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'support@doppeldown.com';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email would have been sent:', {
        to: options.to,
        subject: options.subject,
      });
      
      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          messageId: `dev-${Date.now()}`,
        };
      }
      
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Render React email to HTML
    const html = await render(options.react, {
      pretty: true,
    });

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: options.from || FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html,
      replyTo: options.replyTo || REPLY_TO_EMAIL,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(
  to: string,
  userName: string,
  dashboardUrl?: string
) {
  const { WelcomeEmail } = await import('@/lib/email-templates');
  
  return sendEmail({
    to,
    subject: 'Welcome to DoppelDown — Your brand protection starts now',
    react: WelcomeEmail({ userName, dashboardUrl }),
  });
}

/**
 * Send a threat alert email
 */
export async function sendThreatAlertEmail(
  to: string,
  props: {
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
) {
  const { ThreatAlertEmail } = await import('@/lib/email-templates');
  
  return sendEmail({
    to,
    subject: `🚨 Threat Alert: ${props.severity.toUpperCase()} priority threat detected for ${props.brandName}`,
    react: ThreatAlertEmail(props),
  });
}

/**
 * Send a weekly report email
 */
export async function sendWeeklyReportEmail(
  to: string,
  props: {
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
) {
  const { WeeklyReportEmail } = await import('@/lib/email-templates');
  
  return sendEmail({
    to,
    subject: `Weekly Brand Protection Report for ${props.brandName} — ${props.weekRange}`,
    react: WeeklyReportEmail(props),
  });
}

/**
 * Send a trial ending reminder email
 */
export async function sendTrialEndingEmail(
  to: string,
  props: {
    userName?: string;
    daysRemaining: number;
    trialEndDate: string;
    planName: string;
    planPrice: string;
    threatsDetected: number;
    dashboardUrl?: string;
    upgradeUrl?: string;
  }
) {
  const { TrialEndingEmail } = await import('@/lib/email-templates');
  
  const subject = props.daysRemaining === 1
    ? 'Your DoppelDown trial ends tomorrow — Upgrade now'
    : `Your DoppelDown trial ends in ${props.daysRemaining} days`;
  
  return sendEmail({
    to,
    subject,
    react: TrialEndingEmail(props),
  });
}

/**
 * Send an invoice email
 */
export async function sendInvoiceEmail(
  to: string,
  props: {
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
) {
  const { InvoiceEmail } = await import('@/lib/email-templates');
  
  const subject = props.status === 'paid'
    ? `Receipt for Invoice ${props.invoiceNumber}`
    : `Invoice ${props.invoiceNumber} — Payment Required`;
  
  return sendEmail({
    to,
    subject,
    react: InvoiceEmail(props),
  });
}

// Re-export for convenience
export { resend };
export default sendEmail;
