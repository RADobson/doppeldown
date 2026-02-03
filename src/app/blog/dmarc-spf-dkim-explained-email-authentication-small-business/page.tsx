import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
  description: 'Plain-English guide to DMARC, SPF, and DKIM for small businesses. Learn what these email authentication protocols do, why they matter for brand protection, and how to set them up correctly.',
  keywords: [
    'DMARC for small business',
    'SPF DKIM DMARC explained',
    'email authentication guide',
    'email spoofing protection',
    'DMARC setup guide',
    'SPF record explained',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/dmarc-spf-dkim-explained-email-authentication-small-business',
  },
  openGraph: {
    title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    description: 'Plain-English guide to DMARC, SPF, and DKIM for small businesses. Learn what these protocols do and how to set them up correctly.',
    url: 'https://doppeldown.com/blog/dmarc-spf-dkim-explained-email-authentication-small-business',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    description: 'Plain-English guide to DMARC, SPF, and DKIM for small businesses.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    description: 'Plain-English guide to DMARC, SPF, and DKIM for small businesses. Learn what these email authentication protocols do, why they matter for brand protection, and how to set them up correctly.',
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
    keywords: ['DMARC for small business', 'SPF DKIM DMARC explained', 'email authentication guide', 'email spoofing protection', 'DMARC setup guide'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function BlogPost() {
  return (
    <BlogLayout>
      <ArticleSchema />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-landing-muted hover:text-landing-foreground text-sm mb-8 transition-colors"
        >
          <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-primary-400 bg-primary-600/10 px-2.5 py-1 rounded-full">
              Email Security
            </span>
            <time className="text-sm text-landing-muted" dateTime="2026-02-03">
              February 3, 2026
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-landing-foreground leading-tight mb-4">
            DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            Your customers trust emails that appear to come from your business. But without proper email authentication, anyone can send emails that look like they came from you. Cybercriminals know this, and they exploit it relentlessly.
          </p>
          <p>
            SPF, DKIM, and DMARC are three protocols that work together to prevent email spoofing and protect your brand from being impersonated in phishing campaigns. This guide explains what each protocol does, why they matter for small businesses, and exactly how to implement them — no computer science degree required.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Problem: Email Was Not Built for Security</h2>
          <p>
            Email was invented in 1971, long before security was a major concern. The protocol was designed to be open and decentralized, which worked great for connectivity but created a massive vulnerability: there is no built-in way to verify that an email actually came from the address in the &quot;From&quot; field.
          </p>
          <p>
            This is why phishing works so well. An attacker can set up a mail server and send emails claiming to be from <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">support@yourcompany.com</code>. Without authentication protocols, receiving email servers have no reliable way to know these messages are fake.
          </p>
          <p>
            SPF, DKIM, and DMARC fix this by adding cryptographic verification to email. Together, they create a system where receiving servers can confidently identify legitimate emails from your domain and reject imposters.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">SPF: The First Line of Defense</h2>
          <p>
            <strong className="text-landing-foreground">SPF (Sender Policy Framework)</strong> is the simplest of the three protocols. It is a DNS record that lists which mail servers are authorized to send email on behalf of your domain.
          </p>
          <p>
            Think of SPF like a guest list for a party. Your DNS record says: &quot;These specific servers are allowed to send email as me.&quot; When an email claims to be from your domain, receiving servers check if it came from a server on your list. If not, it fails SPF authentication.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">How SPF Works</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>You create an SPF record in your DNS settings listing authorized mail servers</li>
            <li>A receiving server gets an email claiming to be from your domain</li>
            <li>The server looks up your SPF record</li>
            <li>It checks if the sending server&apos;s IP address is in your authorized list</li>
            <li>If yes, SPF passes. If no, SPF fails.</li>
          </ol>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Setting Up SPF</h3>
          <p>
            SPF records are TXT records in your DNS. Here is a basic example:
          </p>
          <pre className="bg-landing-elevated p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-primary-400">v=spf1 include:_spf.google.com include:sendgrid.net -all</code>
          </pre>
          <p>
            Let us break this down:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">v=spf1</code> — The SPF version</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">include:_spf.google.com</code> — Authorizes Google&apos;s mail servers (for Gmail/Google Workspace)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">include:sendgrid.net</code> — Authorizes SendGrid (if you use them for transactional emails)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">-all</code> — Fail any emails not from authorized servers (the strictest policy)</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Common SPF mechanisms:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">ip4:192.168.1.1</code> — Authorize a specific IP address</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">ip4:192.168.1.0/24</code> — Authorize an IP range</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">a</code> — Authorize the domain&apos;s A record</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">mx</code> — Authorize the domain&apos;s mail servers</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">include:example.com</code> — Include another domain&apos;s SPF record</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">SPF qualifiers:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">+</code> (pass) — Allow (default if no qualifier specified)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">-</code> (fail) — Hard fail, reject the email</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">~</code> (softfail) — Mark as suspicious but accept</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">?</code> (neutral) — No policy, accept</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">DKIM: Cryptographic Proof of Authenticity</h2>
          <p>
            <strong className="text-landing-foreground">DKIM (DomainKeys Identified Mail)</strong> adds a cryptographic signature to your emails. This signature proves two things: the email was not altered in transit, and it was sent by someone with access to your domain&apos;s private key.
          </p>
          <p>
            Think of DKIM like a wax seal on a letter. The seal proves the letter has not been opened or modified, and the unique design proves it came from the sender who owns that seal.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">How DKIM Works</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Your mail server adds a DKIM signature to every outgoing email (in the email headers)</li>
            <li>This signature is created using a private key that only your servers possess</li>
            <li>The receiving server sees the DKIM signature and looks up your public key in DNS</li>
            <li>It uses the public key to verify the signature</li>
            <li>If verification succeeds, the email is authentic and unmodified</li>
          </ol>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Setting Up DKIM</h3>
          <p>
            DKIM setup varies depending on your email provider:
          </p>
          <p>
            <strong className="text-landing-foreground">Google Workspace:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to Admin console &gt; Apps &gt; Google Workspace &gt; Gmail &gt; Authenticate email</li>
            <li>Click &quot;Generate new record&quot;</li>
            <li>Choose 2048-bit key length</li>
            <li>Copy the DNS TXT record provided</li>
            <li>Add it to your DNS with the selector prefix (usually <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">google._domainkey</code>)</li>
            <li>Return to Google Admin and click &quot;Start authentication&quot;</li>
          </ol>
          <p>
            <strong className="text-landing-foreground">Microsoft 365:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to Microsoft Defender portal &gt; Email &amp; collaboration &gt; DKIM</li>
            <li>Select your domain</li>
            <li>Click &quot;Create DKIM keys&quot;</li>
            <li>Add the provided CNAME records to your DNS</li>
            <li>Return to Defender and enable DKIM signing</li>
          </ol>
          <p>
            <strong className="text-landing-foreground">Other providers:</strong> Most email services (SendGrid, Mailgun, AWS SES) provide DKIM setup in their dashboards. Look for &quot;Domain Authentication&quot; or &quot;DKIM&quot; in your settings.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">DMARC: The Enforcement Layer</h2>
          <p>
            <strong className="text-landing-foreground">DMARC (Domain-based Message Authentication, Reporting, and Conformance)</strong> ties SPF and DKIM together and tells receiving servers what to do when authentication fails. It also provides reports so you can monitor authentication activity.
          </p>
          <p>
            If SPF and DKIM are security guards checking IDs, DMARC is the security policy that tells them when to refuse entry and how to report incidents.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">How DMARC Works</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>You publish a DMARC policy in your DNS</li>
            <li>Receiving servers check SPF and DKIM for incoming emails</li>
            <li>If both fail (or if DKIM alignment fails), the server consults your DMARC policy</li>
            <li>Your policy tells it to either monitor, quarantine, or reject the email</li>
            <li>The server sends you reports about authentication results</li>
          </ol>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">DMARC Policy Options</h3>
          <p>
            DMARC policies have three levels:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=none</code> — Monitor only. Collect data but take no action. Good for initial setup and testing.</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=quarantine</code> — Suspicious emails go to spam/junk folders. Good intermediate step before full rejection.</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code> — Block fraudulent emails entirely. The strongest protection.</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Setting Up DMARC</h3>
          <p>
            A basic DMARC record is a TXT record at <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">_dmarc.yourdomain.com</code>:
          </p>
          <pre className="bg-landing-elevated p-4 rounded-lg overflow-x-auto text-sm">
            <code className="text-primary-400">v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; sp=none; adkim=r; aspf=r;</code>
          </pre>
          <p>
            Breaking down the tags:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">v=DMARC1</code> — DMARC version</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=none</code> — Policy (none/quarantine/reject)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">rua=mailto:...</code> — Where to send aggregate reports (daily summaries)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">ruf=mailto:...</code> — Where to send forensic reports (individual failure details)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">sp=none</code> — Policy for subdomains</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">adkim=r</code> — DKIM alignment (r=relaxed, s=strict)</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">aspf=r</code> — SPF alignment (r=relaxed, s=strict)</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">The Gradual Rollout Strategy</h3>
          <p>
            Do not jump straight to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code>. You might accidentally block legitimate emails. Follow this progression:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Week 1-2:</strong> Set <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=none</code> and review daily reports. Identify all legitimate sending sources you might have missed.</li>
            <li><strong>Week 3-4:</strong> Update SPF to include any missing legitimate services. Ensure all mail is DKIM-signed.</li>
            <li><strong>Month 2:</strong> Move to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=quarantine</code> at 10% (add <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">pct=10</code> to your record). Monitor for any complaints about missing emails.</li>
            <li><strong>Month 3:</strong> Increase to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">pct=50</code>, then <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">pct=100</code>.</li>
            <li><strong>Month 4+:</strong> Move to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code> once confident no legitimate email is failing authentication.</li>
          </ol>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Common Setup Mistakes to Avoid</h2>
          <p>
            Even with the best intentions, businesses often make these errors:
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">1. Multiple SPF Records</h3>
          <p>
            You can only have one SPF record per domain. If you need to authorize multiple services, combine them into a single record:
          </p>
          <p>
            <strong>Wrong:</strong> Two separate TXT records<br/>
            <strong>Right:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">v=spf1 include:_spf.google.com include:sendgrid.net -all</code>
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">2. Exceeding SPF Lookup Limits</h3>
          <p>
            SPF has a hard limit of 10 DNS lookups. Each <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">include</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">a</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">mx</code>, or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">ptr</code> mechanism counts toward this limit. Exceed it and SPF will permerror (permanent error), causing failures.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">3. Not Monitoring DMARC Reports</h3>
          <p>
            Setting <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=none</code> and forgetting about it provides no protection. You must review reports to identify configuration issues and detect spoofing attempts.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">4. Missing Third-Party Senders</h3>
          <p>
            Marketing platforms, support ticketing systems, HR tools, and CRMs often send email on your behalf. If they are not in your SPF or using DKIM with your domain, their emails will fail authentication.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">5. Alignment Failures</h3>
          <p>
            DMARC requires alignment between the &quot;From&quot; header domain and the SPF/DKIM domains. If you send email from <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">mail@newsletter.yourdomain.com</code> but your SPF only covers <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourdomain.com</code>, you need relaxed alignment (the default) or a specific SPF record for the subdomain.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Why Email Authentication Matters for Brand Protection</h2>
          <p>
            Implementing SPF, DKIM, and DMARC is not just about deliverability — it is a critical brand protection measure:
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Prevents Direct Domain Spoofing</h3>
          <p>
            With <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code> DMARC policy, attackers cannot send emails that appear to come directly from your domain. This eliminates the most convincing form of phishing: exact domain spoofing.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Provides Visibility Through Reporting</h3>
          <p>
            DMARC reports show you who is sending email claiming to be from your domain. This visibility helps identify compromised accounts, unauthorized services, and ongoing spoofing campaigns.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Builds Trust with Customers</h3>
          <p>
            When customers see the BIMI (Brand Indicators for Message Identification) avatar or simply know your emails are authenticated, trust increases. Many email clients now show authentication status to users.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Email Authentication + Domain Monitoring: Complete Protection</h2>
          <p>
            Email authentication protects against direct domain spoofing, but it does not stop lookalike domain attacks. Attackers can still register <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourcornpany.com</code> or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourcompany-support.com</code> and send emails from those domains. DMARC only protects your exact domain.
          </p>
          <p>
            This is where <strong className="text-landing-foreground">DoppelDown</strong> complements your email security. While you lock down your domain with SPF, DKIM, and DMARC, DoppelDown continuously monitors for lookalike domains that could be used to impersonate your brand.
          </p>
          <p>
            Our platform detects typosquats, homoglyph attacks, and combosquats the moment they are registered — often before they are used in phishing campaigns. You get immediate alerts with risk scoring, automated evidence collection, and streamlined takedown workflows.
          </p>
          <p>
            Together, email authentication and domain monitoring provide comprehensive protection: DMARC prevents spoofing of your actual domain, while DoppelDown catches the lookalike domains that bypass DMARC entirely.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start protecting your brand with DoppelDown today</Link> — it is free to start, requires no credit card, and complements your email authentication setup perfectly. Do not let attackers hide in the gaps between your defenses.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              SPF, DKIM, and DMARC form the foundation of email security for small businesses. They are not optional extras — they are essential protections that every business should implement. Set them up correctly, monitor your reports, and pair them with domain monitoring for complete brand protection.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
