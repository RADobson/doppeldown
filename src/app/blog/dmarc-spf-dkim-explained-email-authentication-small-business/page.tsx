import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
  description: 'A plain-English guide to DMARC, SPF, and DKIM email authentication. Learn how these protocols protect your brand from email spoofing and phishing attacks.',
  keywords: [
    'DMARC for small business',
    'SPF DKIM DMARC explained',
    'email authentication guide',
    'prevent email spoofing',
    'DMARC setup guide',
    'email security for small business',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/dmarc-spf-dkim-explained-email-authentication-small-business',
  },
  openGraph: {
    title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    description: 'A plain-English guide to email authentication protocols that protect your brand from spoofing.',
    url: 'https://doppeldown.com/blog/dmarc-spf-dkim-explained-email-authentication-small-business',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DMARC, SPF, and DKIM Explained for Small Businesses',
    description: 'Plain-English guide to email authentication that protects your brand.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    description: 'A plain-English guide to DMARC, SPF, and DKIM email authentication protocols.',
    datePublished: '2026-02-03T00:00:00Z',
    dateModified: '2026-02-03T00:00:00Z',
    author: {
      '@type': 'Organization',
      name: 'DoppelDown Team',
      url: 'https://doppeldown.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DoppelDown',
      url: 'https://doppeldown.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://doppeldown.com/blog/dmarc-spf-dkim-explained-email-authentication-small-business',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function DmarcSpfDkimGuidePage() {
  return (
    <BlogLayout>
      <ArticleSchema />
      <article className="prose prose-lg max-w-none">
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime="2026-02-03">February 3, 2026</time>
            <span>•</span>
            <span>12 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses
          </h1>
          <p className="text-xl text-muted-foreground">
            Email spoofing lets attackers send emails that look like they come from your domain. DMARC, SPF, and DKIM stop that — here&apos;s how they work and how to set them up.
          </p>
        </header>

        <p>
          Imagine a customer receives an email that appears to come from <em>billing@yourbusiness.com</em> asking them to update their payment details. The email looks legitimate — it uses your logo, your company name, and your domain. But it&apos;s a phishing email sent by an attacker, and the link goes to a fake payment page.
        </p>
        <p>
          This is <strong>email spoofing</strong>, and it&apos;s one of the most common ways cybercriminals exploit business brands. The good news: three email authentication standards — SPF, DKIM, and DMARC — can prevent most spoofing attacks. And they&apos;re free to implement.
        </p>

        <h2>The Three Protocols: A Simple Analogy</h2>
        <p>Think of sending an email like sending a physical letter:</p>
        <ul>
          <li><strong>SPF</strong> (Sender Policy Framework) is like publishing a list of authorized post offices that can send mail on your behalf. If a letter claims to be from your company but was sent from an unauthorized post office, it gets flagged.</li>
          <li><strong>DKIM</strong> (DomainKeys Identified Mail) is like sealing your letter with a tamper-proof wax seal. If anyone modifies the letter in transit, the seal breaks and the recipient knows something is wrong.</li>
          <li><strong>DMARC</strong> (Domain-based Message Authentication, Reporting, and Conformance) is the policy that tells mail carriers what to do when a letter fails SPF or DKIM checks — deliver it anyway, quarantine it, or reject it outright.</li>
        </ul>
        <p>Together, they form a layered defense against email impersonation.</p>

        <h2>SPF: Who Can Send Email From Your Domain?</h2>
        <h3>What it does</h3>
        <p>
          SPF lets you publish a DNS record listing which mail servers are authorized to send email for your domain. When a receiving mail server gets an email claiming to be from yourbusiness.com, it checks your SPF record to see if the sending server is on the approved list.
        </p>
        <h3>How to set it up</h3>
        <p>Add a TXT record to your domain&apos;s DNS with a value like:</p>
        <pre><code>v=spf1 include:_spf.google.com include:sendgrid.net -all</code></pre>
        <p>This example says: &quot;Only Google Workspace and SendGrid are allowed to send email from our domain. Reject everything else.&quot;</p>
        <h3>Common mistakes</h3>
        <ul>
          <li><strong>Using ~all instead of -all:</strong> The tilde (~) means &quot;soft fail&quot; — it flags unauthorized senders but still delivers the email. Use <code>-all</code> (hard fail) for real protection.</li>
          <li><strong>Forgetting third-party services:</strong> If you use Mailchimp, HubSpot, or any service that sends email from your domain, include their servers in your SPF record.</li>
          <li><strong>Too many DNS lookups:</strong> SPF allows a maximum of 10 DNS lookups. If you have many &quot;include&quot; statements, you might exceed this limit and break authentication.</li>
        </ul>

        <h2>DKIM: Was This Email Tampered With?</h2>
        <h3>What it does</h3>
        <p>
          DKIM adds a cryptographic signature to your outgoing emails. The sending server signs the email with a private key, and the receiving server verifies the signature using a public key published in your DNS.
        </p>
        <p>
          If anyone modifies the email in transit — changing the body, subject line, or attachments — the signature verification fails.
        </p>
        <h3>How to set it up</h3>
        <p>
          Most email providers (Google Workspace, Microsoft 365, etc.) handle DKIM signing automatically. You typically just need to:
        </p>
        <ol>
          <li>Enable DKIM in your email provider&apos;s admin panel</li>
          <li>Add the CNAME or TXT record they provide to your DNS</li>
          <li>Wait for DNS propagation (can take up to 48 hours)</li>
        </ol>
        <h3>Common mistakes</h3>
        <ul>
          <li><strong>Not rotating keys:</strong> Use 2048-bit keys minimum, and rotate them annually.</li>
          <li><strong>Multiple DKIM records:</strong> If you use multiple services that sign with DKIM, each needs its own selector. Make sure they don&apos;t conflict.</li>
        </ul>

        <h2>DMARC: What Happens When Authentication Fails?</h2>
        <h3>What it does</h3>
        <p>
          DMARC builds on SPF and DKIM by adding a policy layer. It tells receiving mail servers: &quot;Here&apos;s what to do with emails from my domain that fail authentication.&quot;
        </p>
        <p>DMARC policies:</p>
        <ul>
          <li><strong>p=none:</strong> Monitor mode — don&apos;t take action, just send reports. Start here.</li>
          <li><strong>p=quarantine:</strong> Send failing emails to spam/junk folders.</li>
          <li><strong>p=reject:</strong> Block failing emails entirely. This is the goal.</li>
        </ul>
        <h3>How to set it up</h3>
        <p>Add a TXT record for <code>_dmarc.yourbusiness.com</code>:</p>
        <pre><code>v=DMARC1; p=none; rua=mailto:dmarc-reports@yourbusiness.com; ruf=mailto:dmarc-forensics@yourbusiness.com; pct=100</code></pre>
        <h3>The DMARC rollout path</h3>
        <ol>
          <li><strong>Week 1–4:</strong> Set <code>p=none</code> and monitor reports. Identify any legitimate senders that are failing authentication.</li>
          <li><strong>Week 5–8:</strong> Fix any SPF/DKIM issues for legitimate senders. Move to <code>p=quarantine</code>.</li>
          <li><strong>Week 9+:</strong> Once you&apos;re confident all legitimate email passes, move to <code>p=reject</code>.</li>
        </ol>
        <p>
          <strong>Don&apos;t skip straight to p=reject.</strong> If you have misconfigured services, you&apos;ll block your own legitimate emails.
        </p>

        <h2>How Email Authentication Protects Your Brand</h2>
        <p>Without DMARC, SPF, and DKIM:</p>
        <ul>
          <li>Anyone can send emails pretending to be you</li>
          <li>Phishing emails from &quot;your domain&quot; land in customer inboxes</li>
          <li>Your domain reputation degrades, causing legitimate emails to hit spam</li>
          <li>Customers lose trust in your communications</li>
        </ul>
        <p>With proper email authentication:</p>
        <ul>
          <li>Spoofed emails are blocked before they reach inboxes</li>
          <li>Your domain reputation improves</li>
          <li>Deliverability of legitimate emails increases</li>
          <li>You get visibility into who is sending email using your domain</li>
        </ul>

        <h2>The Bigger Picture: Email + Domain Protection</h2>
        <p>
          DMARC, SPF, and DKIM protect against <em>email</em> spoofing — attackers sending emails that appear to come from your exact domain. But attackers also use <strong>lookalike domains</strong> to send phishing emails.
        </p>
        <p>
          For example, if your domain is <code>acmecorp.com</code>, an attacker might register <code>acme-corp.com</code> or <code>acmecorps.com</code> and send phishing emails from those domains. DMARC can&apos;t protect against this because those are <em>different domains</em>.
        </p>
        <p>
          That&apos;s why comprehensive brand protection requires both email authentication (DMARC/SPF/DKIM) <em>and</em> domain monitoring to catch lookalike domains before they&apos;re used in attacks.
        </p>

        <div className="not-prose my-12 p-8 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Complete Your Brand Protection
          </h3>
          <p className="text-muted-foreground mb-6">
            DMARC protects your exact domain. DoppelDown protects against lookalike domains — monitoring for typosquats, homoglyphs, and brand impersonation 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="https://app.doppeldown.com/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Free Monitoring →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <h2>Quick Setup Checklist</h2>
        <ul>
          <li>☐ Publish an SPF record with all authorized senders and <code>-all</code></li>
          <li>☐ Enable DKIM signing for all email services</li>
          <li>☐ Add a DMARC record starting with <code>p=none</code></li>
          <li>☐ Monitor DMARC reports for 4 weeks</li>
          <li>☐ Fix any authentication failures for legitimate senders</li>
          <li>☐ Escalate to <code>p=quarantine</code>, then <code>p=reject</code></li>
          <li>☐ Set up domain monitoring for lookalike domains</li>
        </ul>

        <h2>Free Tools to Help</h2>
        <ul>
          <li><strong>MXToolbox:</strong> Check your SPF, DKIM, and DMARC records</li>
          <li><strong>DMARC Analyzer:</strong> Parse and understand DMARC reports</li>
          <li><strong>Google Postmaster Tools:</strong> Monitor your domain&apos;s email reputation with Gmail</li>
          <li><strong>Mail-tester.com:</strong> Send a test email and get a deliverability score</li>
        </ul>
      </article>
    </BlogLayout>
  )
}
