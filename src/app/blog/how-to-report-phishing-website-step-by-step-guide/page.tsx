import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
  description: 'Learn exactly how to report a phishing website to Google, browsers, hosting providers, and law enforcement. Complete step-by-step guide with screenshots and templates.',
  keywords: [
    'how to report a phishing website',
    'report phishing site',
    'report fake website',
    'phishing website takedown',
    'report scam website',
    'how to take down a phishing site',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-to-report-phishing-website-step-by-step-guide',
  },
  openGraph: {
    title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    description: 'Learn exactly how to report a phishing website to Google, browsers, hosting providers, and law enforcement.',
    url: 'https://doppeldown.com/blog/how-to-report-phishing-website-step-by-step-guide',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    description: 'Complete guide to reporting phishing websites and getting them taken down.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    description: 'Learn exactly how to report a phishing website to Google, browsers, hosting providers, and law enforcement.',
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
      '@id': 'https://doppeldown.com/blog/how-to-report-phishing-website-step-by-step-guide',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function ReportPhishingGuidePage() {
  return (
    <BlogLayout>
      <ArticleSchema />
      <article className="prose prose-lg max-w-none">
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime="2026-02-03">February 3, 2026</time>
            <span>•</span>
            <span>10 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How to Report a Phishing Website: Step-by-Step Guide (2026)
          </h1>
          <p className="text-xl text-muted-foreground">
            Found a fake website impersonating your business or trying to steal customer data? Here&apos;s exactly how to report it and get it taken down — fast.
          </p>
        </header>

        <p>
          Discovering that someone has created a phishing website impersonating your brand is alarming. Every hour that fake site stays online, more of your customers could fall victim to fraud, and your brand reputation takes another hit.
        </p>
        <p>
          The good news: there are clear, well-established channels for reporting phishing websites, and most can be taken down within 24–72 hours if you follow the right steps. This guide walks you through exactly what to do.
        </p>

        <h2>Step 1: Document Everything First</h2>
        <p>
          Before you report anything, collect evidence. You&apos;ll need it for every report you file, and phishing sites can disappear quickly — only to reappear elsewhere.
        </p>
        <p><strong>What to capture:</strong></p>
        <ul>
          <li><strong>Full URL</strong> — copy the exact URL, including any path or query parameters</li>
          <li><strong>Screenshots</strong> — capture the entire page, especially any logos, forms, or content that mimics your brand</li>
          <li><strong>WHOIS data</strong> — look up the domain registration at whois.domaintools.com or who.is</li>
          <li><strong>IP address</strong> — use nslookup or dig to find the hosting IP</li>
          <li><strong>Hosting provider</strong> — tools like HostingChecker.com can identify where the site is hosted</li>
          <li><strong>Page source</strong> — save the HTML source code (Ctrl+U in most browsers)</li>
          <li><strong>Timestamps</strong> — note when you discovered the site and when you captured evidence</li>
        </ul>
        <p>
          Store everything in a dedicated folder. If this escalates to legal action, timestamped evidence is essential.
        </p>

        <h2>Step 2: Report to Google Safe Browsing</h2>
        <p>
          Google Safe Browsing protects over 4 billion devices. Getting a phishing URL flagged here means Chrome, Firefox, Safari, and Android will all warn users before they visit the site.
        </p>
        <p><strong>How to report:</strong></p>
        <ol>
          <li>Visit <strong>safebrowsing.google.com/safebrowsing/report_phish/</strong></li>
          <li>Enter the phishing URL</li>
          <li>Add any additional details (e.g., &quot;this site impersonates [your brand] and collects login credentials&quot;)</li>
          <li>Submit the report</li>
        </ol>
        <p>
          Google typically reviews these within 24–48 hours. Once flagged, users across all major browsers will see a red warning screen.
        </p>

        <h2>Step 3: Report to the Anti-Phishing Working Group (APWG)</h2>
        <p>
          The APWG is an international coalition of law enforcement, governments, and industry that tracks phishing activity globally. Reports go into a shared database used by security vendors worldwide.
        </p>
        <p><strong>How to report:</strong></p>
        <ul>
          <li>Forward phishing emails to <strong>reportphishing@apwg.org</strong></li>
          <li>For phishing URLs, use their reporting form at <strong>apwg.org/report-phishing/</strong></li>
        </ul>
        <p>
          This doesn&apos;t directly take down the site, but it ensures the URL gets added to threat intelligence feeds used by email providers, browsers, and security tools.
        </p>

        <h2>Step 4: Report to the Hosting Provider</h2>
        <p>
          This is often the fastest path to takedown. Most hosting providers have abuse policies that allow them to suspend sites within hours.
        </p>
        <p><strong>How to find and contact the host:</strong></p>
        <ol>
          <li>Look up the IP address using <strong>nslookup</strong> or an online tool</li>
          <li>Check the IP against a WHOIS database to find the hosting company</li>
          <li>Find the host&apos;s abuse contact (usually abuse@[host].com or listed on their website)</li>
          <li>Send an abuse report including: the phishing URL, evidence (screenshots), your contact information, and a clear statement that this site is conducting phishing/brand impersonation</li>
        </ol>
        <p>
          Major providers like AWS, Cloudflare, GoDaddy, and DigitalOcean all have dedicated abuse teams. Response times vary, but most act within 24 hours for clear-cut phishing.
        </p>

        <h2>Step 5: Report to the Domain Registrar</h2>
        <p>
          Even if the hosting provider doesn&apos;t act, the domain registrar can suspend the domain name itself.
        </p>
        <p><strong>How to report:</strong></p>
        <ol>
          <li>Look up the registrar via WHOIS (look for &quot;Registrar&quot; field)</li>
          <li>Find the registrar&apos;s abuse contact (check their website or WHOIS data)</li>
          <li>File a complaint citing their abuse policy and ICANN&apos;s Anti-Abuse Policy</li>
          <li>If the domain uses your trademark, mention UDRP (Uniform Domain-Name Dispute-Resolution Policy)</li>
        </ol>
        <p>
          Registrar takedowns can take longer (3–7 days) but they&apos;re more permanent — the domain itself gets suspended, not just the hosting.
        </p>

        <h2>Step 6: Report to Browser Vendors</h2>
        <p>
          In addition to Google Safe Browsing, you can report directly to specific browser vendors:
        </p>
        <ul>
          <li><strong>Microsoft (Edge/Defender):</strong> microsoft.com/en-us/wdsi/support/report-unsafe-site-guest</li>
          <li><strong>Mozilla (Firefox):</strong> Use the built-in &quot;Report Deceptive Site&quot; option in the browser menu</li>
          <li><strong>Apple (Safari):</strong> Reports through Google Safe Browsing (see Step 2)</li>
        </ul>

        <h2>Step 7: Report to Law Enforcement (When Appropriate)</h2>
        <p>
          For serious cases — especially if customers have already been defrauded — file reports with:
        </p>
        <ul>
          <li><strong>FBI&apos;s Internet Crime Complaint Center (IC3):</strong> ic3.gov (US)</li>
          <li><strong>Action Fraud:</strong> actionfraud.police.uk (UK)</li>
          <li><strong>ACSC:</strong> cyber.gov.au/report (Australia)</li>
          <li><strong>Your local police:</strong> especially if financial losses are involved</li>
        </ul>
        <p>
          Law enforcement reports rarely result in immediate takedowns, but they create a paper trail that&apos;s valuable for insurance claims, legal action, and pattern analysis.
        </p>

        <h2>Step 8: Notify Your Customers</h2>
        <p>
          Don&apos;t wait for the takedown to warn your customers. The faster you communicate, the fewer victims there will be.
        </p>
        <ul>
          <li>Send an email alert to your customer base</li>
          <li>Post a warning on your social media accounts</li>
          <li>Add a banner to your legitimate website</li>
          <li>Brief your customer support team so they can handle inquiries</li>
        </ul>

        <h2>How Long Does a Phishing Takedown Take?</h2>
        <p>Typical timelines in 2026:</p>
        <ul>
          <li><strong>Google Safe Browsing flagging:</strong> 12–48 hours</li>
          <li><strong>Hosting provider suspension:</strong> 4–72 hours</li>
          <li><strong>Registrar domain suspension:</strong> 3–7 days</li>
          <li><strong>DMCA takedown:</strong> 5–14 days</li>
          <li><strong>UDRP domain dispute:</strong> 45–60 days</li>
        </ul>
        <p>
          The key is to file reports in parallel, not sequentially. Report to Google Safe Browsing, the hosting provider, and the registrar all at once.
        </p>

        <h2>Prevention: Don&apos;t Wait for Phishing to Happen</h2>
        <p>
          Reporting phishing is reactive. The real solution is proactive monitoring — detecting lookalike domains and brand impersonation attempts <em>before</em> they go live and trick your customers.
        </p>
        <p>
          That&apos;s exactly what brand monitoring tools do: they continuously scan for newly registered domains that resemble yours, flagging potential threats so you can act early.
        </p>

        <div className="not-prose my-12 p-8 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Stop Phishing Before It Starts
          </h3>
          <p className="text-muted-foreground mb-6">
            DoppelDown monitors for lookalike domains and brand impersonation 24/7, alerting you to threats before they reach your customers. Plans start free.
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

        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>Document first</strong> — screenshots, WHOIS data, and timestamps before anything else</li>
          <li><strong>Report in parallel</strong> — Google, hosting provider, and registrar simultaneously</li>
          <li><strong>Notify customers</strong> — don&apos;t wait for the takedown</li>
          <li><strong>Monitor proactively</strong> — automated domain monitoring catches threats early</li>
          <li><strong>Keep records</strong> — you may need them for legal action or insurance</li>
        </ul>
      </article>
    </BlogLayout>
  )
}
