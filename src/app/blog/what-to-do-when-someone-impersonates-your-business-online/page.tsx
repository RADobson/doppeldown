import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'What to Do When Someone Impersonates Your Business Online',
  description: 'Found someone impersonating your brand online? Here is your emergency response playbook — document, report, protect customers, and prevent future attacks.',
  keywords: [
    'someone impersonating my business',
    'brand impersonation what to do',
    'fake website using my brand',
    'business impersonation online',
    'brand impersonation response',
    'someone using my company name',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/what-to-do-when-someone-impersonates-your-business-online',
  },
  openGraph: {
    title: 'What to Do When Someone Impersonates Your Business Online',
    description: 'Emergency response playbook for brand impersonation — report, protect customers, and prevent future attacks.',
    url: 'https://doppeldown.com/blog/what-to-do-when-someone-impersonates-your-business-online',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What to Do When Someone Impersonates Your Business Online',
    description: 'Emergency response playbook for brand impersonation online.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What to Do When Someone Impersonates Your Business Online',
    description: 'Emergency response playbook for brand impersonation — report, protect customers, and prevent future attacks.',
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
      '@id': 'https://doppeldown.com/blog/what-to-do-when-someone-impersonates-your-business-online',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function BrandImpersonationResponsePage() {
  return (
    <BlogLayout>
      <ArticleSchema />
      <article className="prose prose-lg max-w-none">
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime="2026-02-03">February 3, 2026</time>
            <span>•</span>
            <span>11 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            What to Do When Someone Impersonates Your Business Online
          </h1>
          <p className="text-xl text-muted-foreground">
            You just discovered a fake website, social media account, or email campaign using your brand. Here&apos;s your emergency response playbook.
          </p>
        </header>

        <p>
          Brand impersonation is one of the fastest-growing threats to businesses of all sizes. In 2025, the FBI&apos;s Internet Crime Complaint Center reported over $2.7 billion in losses from business impersonation scams. And small businesses are disproportionately targeted — they often lack the resources to detect impersonation early.
        </p>
        <p>
          If you&apos;ve just discovered that someone is impersonating your business, don&apos;t panic — but act fast. Here&apos;s your step-by-step response plan.
        </p>

        <h2>Phase 1: Assess the Threat (First 30 Minutes)</h2>
        <h3>Identify what type of impersonation you&apos;re dealing with</h3>
        <ul>
          <li><strong>Fake website:</strong> A domain that mimics your site to steal customer data or money</li>
          <li><strong>Lookalike domain:</strong> A registered domain similar to yours (typosquatting, homoglyph attacks)</li>
          <li><strong>Fake social media account:</strong> An account using your brand name, logo, and content</li>
          <li><strong>Email spoofing:</strong> Emails sent from addresses that appear to be your domain</li>
          <li><strong>Marketplace fraud:</strong> Fake product listings using your brand name and images</li>
          <li><strong>Google Ads hijacking:</strong> Ads that use your brand name to redirect traffic</li>
        </ul>

        <h3>Gauge the severity</h3>
        <p>Ask yourself:</p>
        <ul>
          <li>Are customers actively being defrauded right now?</li>
          <li>Is the fake site collecting login credentials or payment information?</li>
          <li>Has anyone contacted you about suspicious communications &quot;from&quot; your company?</li>
          <li>How long has this been active? (Check domain registration date, social account creation date)</li>
        </ul>
        <p>
          If customers are actively losing money, this is a <strong>critical emergency</strong> — skip to Phase 2 immediately while documenting in parallel.
        </p>

        <h2>Phase 2: Document Everything (First Hour)</h2>
        <p>
          Evidence disappears. Phishing sites go offline and pop up elsewhere. Fake social accounts get deleted and recreated. Capture everything now.
        </p>
        <p><strong>For fake websites:</strong></p>
        <ul>
          <li>Full-page screenshots (use a tool like GoFullPage browser extension)</li>
          <li>Save the complete URL including path and parameters</li>
          <li>Save the page source (View Source in browser)</li>
          <li>WHOIS lookup — capture registrar, registration date, and registrant info</li>
          <li>IP lookup — identify the hosting provider</li>
          <li>Wayback Machine snapshot request at web.archive.org</li>
        </ul>
        <p><strong>For fake social accounts:</strong></p>
        <ul>
          <li>Screenshots of the profile, including username, bio, follower count</li>
          <li>Screenshots of posts and messages (if you can see them)</li>
          <li>Note the account creation date if visible</li>
          <li>Document any direct messages or comments from the fake account</li>
        </ul>
        <p><strong>For all types:</strong></p>
        <ul>
          <li>Timestamp everything</li>
          <li>Keep copies in multiple locations (cloud storage + local)</li>
          <li>Record any customer complaints received about the impersonation</li>
        </ul>

        <h2>Phase 3: Report and Request Takedowns (Hours 1–4)</h2>
        <p>
          File reports with multiple parties simultaneously. Don&apos;t wait for one response before filing the next.
        </p>

        <h3>For fake websites</h3>
        <ol>
          <li><strong>Google Safe Browsing:</strong> Report at safebrowsing.google.com to get the site flagged in browsers</li>
          <li><strong>Hosting provider:</strong> Look up the host via WHOIS/IP and email their abuse team</li>
          <li><strong>Domain registrar:</strong> File an abuse complaint citing phishing/impersonation</li>
          <li><strong>APWG:</strong> Report to reportphishing@apwg.org</li>
        </ol>

        <h3>For fake social accounts</h3>
        <ul>
          <li><strong>Facebook/Instagram:</strong> Use the &quot;Report&quot; function → &quot;Pretending to be someone&quot; → select &quot;A business&quot;</li>
          <li><strong>X/Twitter:</strong> Report → &quot;They&apos;re pretending to be me or someone else&quot; → provide your real account</li>
          <li><strong>LinkedIn:</strong> Report → &quot;Impersonation&quot; from the three-dot menu</li>
          <li><strong>TikTok:</strong> Long-press the account → Report → &quot;Impersonation&quot;</li>
        </ul>
        <p>
          Social media platforms typically respond to impersonation reports within 24–72 hours. Having a verified account significantly speeds up the process.
        </p>

        <h3>For email spoofing</h3>
        <ul>
          <li>If you don&apos;t have DMARC/SPF/DKIM set up, do it now (see our <Link href="/blog/dmarc-spf-dkim-explained-email-authentication-small-business">DMARC guide</Link>)</li>
          <li>Report to the email provider the spam is sent through</li>
          <li>Forward examples to reportphishing@apwg.org</li>
        </ul>

        <h2>Phase 4: Protect Your Customers (Hours 2–6)</h2>
        <p>
          While takedowns are processing, your priority shifts to damage control.
        </p>
        <ul>
          <li><strong>Email blast:</strong> Send a clear, calm communication to your customer base warning them about the impersonation. Include specific details about what the fake looks like and how to identify your real communications.</li>
          <li><strong>Social media posts:</strong> Post warnings on all your official channels with screenshots of the fake.</li>
          <li><strong>Website banner:</strong> Add a prominent alert to your homepage: &quot;We&apos;re aware of a fake website/account impersonating our brand. Our only official domain is [yourdomain.com].&quot;</li>
          <li><strong>Customer support:</strong> Brief your team with talking points and a FAQ for handling customer inquiries.</li>
          <li><strong>Password resets:</strong> If customers may have entered credentials on a fake login page, encourage them to change their passwords immediately.</li>
        </ul>

        <h2>Phase 5: Escalate if Necessary (Days 1–7)</h2>
        <h3>DMCA takedown notices</h3>
        <p>
          If the impersonator is using your copyrighted content (logos, images, copy), file a DMCA takedown notice with:
        </p>
        <ul>
          <li>The hosting provider</li>
          <li>Google (to deindex the page from search results)</li>
          <li>Cloudflare (if used as CDN/DNS)</li>
        </ul>

        <h3>Trademark complaints</h3>
        <p>
          If you have a registered trademark, you have stronger legal standing:
        </p>
        <ul>
          <li>Most social platforms have specific trademark violation report forms</li>
          <li>UDRP (Uniform Domain-Name Dispute-Resolution Policy) proceedings can force transfer of a domain — though this takes 45–60 days</li>
          <li>Google Ads has a trademark complaint form for ads misusing your brand</li>
        </ul>

        <h3>Law enforcement</h3>
        <p>
          File reports with relevant authorities, especially if financial fraud has occurred:
        </p>
        <ul>
          <li>FBI IC3 (ic3.gov) — United States</li>
          <li>Action Fraud (actionfraud.police.uk) — United Kingdom</li>
          <li>ACSC (cyber.gov.au/report) — Australia</li>
          <li>Local police — if customers in your area have been defrauded</li>
        </ul>

        <h2>Phase 6: Prevent Future Attacks</h2>
        <p>
          Once the immediate crisis is resolved, take steps to prevent it from happening again:
        </p>
        <h3>Technical protections</h3>
        <ul>
          <li><strong>DMARC/SPF/DKIM:</strong> Ensure email authentication is fully deployed with a <code>p=reject</code> policy</li>
          <li><strong>Domain monitoring:</strong> Set up automated scanning for newly registered domains similar to yours</li>
          <li><strong>Defensive domain registrations:</strong> Register common misspellings and alternative TLDs of your domain</li>
          <li><strong>SSL certificate monitoring:</strong> Watch for SSL certificates issued to domains mimicking yours (Certificate Transparency logs)</li>
        </ul>
        <h3>Brand protections</h3>
        <ul>
          <li><strong>Trademark registration:</strong> If you haven&apos;t already, register your brand name and logo as trademarks</li>
          <li><strong>Social media verification:</strong> Get verified badges on all major platforms</li>
          <li><strong>Google Search Console:</strong> Monitor for impersonation sites appearing in search results for your brand name</li>
        </ul>
        <h3>Organizational readiness</h3>
        <ul>
          <li><strong>Incident response plan:</strong> Document your response process so your team can act faster next time</li>
          <li><strong>Customer communication templates:</strong> Have pre-drafted alert messages ready to customize and send</li>
          <li><strong>Vendor relationships:</strong> Know your hosting provider and registrar abuse contacts in advance</li>
        </ul>

        <div className="not-prose my-12 p-8 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Detect Impersonation Before Your Customers Do
          </h3>
          <p className="text-muted-foreground mb-6">
            DoppelDown monitors for lookalike domains and brand impersonation around the clock. Get alerted to threats while they&apos;re still being set up — before they reach your customers.
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

        <h2>Brand Impersonation Response Checklist</h2>
        <p>Print this and keep it handy:</p>
        <ul>
          <li>☐ <strong>Assess:</strong> Identify type and severity of impersonation</li>
          <li>☐ <strong>Document:</strong> Screenshots, URLs, WHOIS, timestamps</li>
          <li>☐ <strong>Report:</strong> Google Safe Browsing, hosting provider, registrar, platform</li>
          <li>☐ <strong>Protect:</strong> Warn customers via email, social media, and website banner</li>
          <li>☐ <strong>Escalate:</strong> DMCA, trademark complaint, law enforcement if needed</li>
          <li>☐ <strong>Prevent:</strong> DMARC, domain monitoring, defensive registrations</li>
        </ul>

        <h2>How Quickly Can Impersonation Be Taken Down?</h2>
        <p>Realistic timelines based on 2026 data:</p>
        <ul>
          <li><strong>Social media impersonation:</strong> 24–72 hours (faster with verified accounts)</li>
          <li><strong>Phishing website (hosting takedown):</strong> 4–72 hours</li>
          <li><strong>Google Safe Browsing flag:</strong> 12–48 hours</li>
          <li><strong>Domain suspension (registrar):</strong> 3–7 days</li>
          <li><strong>DMCA content removal:</strong> 5–14 days</li>
          <li><strong>UDRP domain transfer:</strong> 45–60 days</li>
        </ul>
        <p>
          The key lesson: <strong>prevention is always faster than response.</strong> An automated monitoring tool that catches a lookalike domain on Day 1 of registration — before any phishing campaign launches — is worth far more than the fastest takedown after customers have already been harmed.
        </p>
      </article>
    </BlogLayout>
  )
}
