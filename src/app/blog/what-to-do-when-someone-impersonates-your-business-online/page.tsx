import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'What to Do When Someone Impersonates Your Business Online',
  description: 'Emergency response playbook for brand impersonation attacks. Learn how to document evidence, report to platforms, file DMCA takedowns, contact registrars, notify customers, and set up monitoring to prevent future attacks.',
  keywords: [
    'someone impersonating my business',
    'brand impersonation what to do',
    'fake website using my brand',
    'business impersonation response',
    'fake website takedown',
    'brand protection emergency',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/what-to-do-when-someone-impersonates-your-business-online',
  },
  openGraph: {
    title: 'What to Do When Someone Impersonates Your Business Online',
    description: 'Emergency response playbook for brand impersonation attacks. Learn how to document evidence, report to platforms, file DMCA takedowns, and notify customers.',
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
    description: 'Emergency response playbook for brand impersonation attacks.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What to Do When Someone Impersonates Your Business Online',
    description: 'Emergency response playbook for brand impersonation attacks. Learn how to document evidence, report to platforms, file DMCA takedowns, contact registrars, notify customers, and set up monitoring to prevent future attacks.',
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
    keywords: ['someone impersonating my business', 'brand impersonation what to do', 'fake website using my brand', 'business impersonation response', 'brand protection emergency'],
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
              Brand Protection
            </span>
            <time className="text-sm text-landing-muted" dateTime="2026-02-03">
              February 3, 2026
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-landing-foreground leading-tight mb-4">
            What to Do When Someone Impersonates Your Business Online
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            Someone is pretending to be your business online. Maybe they cloned your website. Maybe they created a fake social media account with your logo. Maybe they are sending emails that look like they came from you. Whatever the form, brand impersonation is an attack on your reputation, your customers, and your revenue.
          </p>
          <p>
            Your response in the first 24 hours matters. Move quickly and methodically, and you can often shut down impersonators before they do serious damage. Move slowly or miss a step, and the attack can spread, confuse your customers, and cause lasting harm.
          </p>
          <p>
            This guide is your emergency response playbook. Follow these steps in order to contain the threat, gather evidence, initiate takedowns, protect your customers, and prevent future attacks.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Phase 1: Immediate Assessment (First Hour)</h2>
          <p>
            Before you start firing off takedown requests, you need to understand the scope of the attack. Panic leads to mistakes, and mistakes waste precious time.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 1: Document the Impersonation</h3>
          <p>
            Open an incident folder on your computer or cloud storage. Name it clearly with the date and nature of the attack (e.g., &quot;2026-02-03 Website Impersonation Incident&quot;).
          </p>
          <p>
            <strong className="text-landing-foreground">Capture everything:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full-page screenshots of the impersonating website or profile</li>
            <li>The exact URL or username being used</li>
            <li>Any emails, messages, or ads promoting the fake presence</li>
            <li> WHOIS data for fake domains (use who.is or lookup.icann.org)</li>
            <li>IP addresses (ping the domain or use online lookup tools)</li>
            <li>Date and time you discovered the impersonation</li>
            <li>How you discovered it (customer report, monitoring tool, etc.)</li>
          </ul>
          <p>
            Use tools like the Wayback Machine to see if the fake site has been active for a while. Check for variations — attackers often register multiple similar domains at once.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 2: Assess the Threat Level</h3>
          <p>
            Not all impersonation is equally dangerous. Rate the threat to prioritise your response:
          </p>
          <p>
            <strong className="text-landing-foreground">Critical (Immediate action required):</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Active phishing (collecting credentials or payments)</li>
            <li>Customer data being harvested</li>
            <li>Financial transactions being processed</li>
            <li>Malware being distributed</li>
            <li>Active promotion through ads or large-scale email campaigns</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">High (Same-day action required):</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convincing website clone without active phishing yet</li>
            <li>Fake social media accounts with significant followers</li>
            <li>Impersonation targeting your customers directly</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Medium (Action within 24-48 hours):</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Parked domains or placeholder pages</li>
            <li>Low-engagement fake social accounts</li>
            <li>Typosquats not yet actively used</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 3: Check for Related Attacks</h3>
          <p>
            Attackers rarely stop at one domain or account. Search for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Similar domain variations (try common typos, different TLDs, hyphenated versions)</li>
            <li>Related social media accounts (search your brand name on all major platforms)</li>
            <li>Lookalike accounts on LinkedIn pretending to be your employees</li>
            <li>Fake mobile apps in app stores</li>
            <li>Domain registrations with common suffixes like &quot;-official&quot;, &quot;-support&quot;, &quot;-help&quot;</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Phase 2: Immediate Containment (Hours 1-4)</h2>
          <p>
            Now that you know what you are dealing with, it is time to start shutting it down.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 4: Report to Browser Safe Browsing</h3>
          <p>
            This is the fastest way to protect users. When a site is flagged by Google Safe Browsing or Microsoft SmartScreen, browsers will display warning pages before users can access the malicious site.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google Safe Browsing:</strong> safebrowsing.google.com/safebrowsing/report_phish/</li>
            <li><strong>Microsoft SmartScreen:</strong> microsoft.com/wdsi/support/report-unsafe-site</li>
          </ul>
          <p>
            Reports typically take effect within 2-4 hours. This does not take down the site, but it neutralises the threat by warning visitors.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 5: Contact the Domain Registrar</h3>
          <p>
            Domain registrars are legally obligated to investigate abuse reports. Find the registrar through a WHOIS lookup, then locate their abuse reporting process (usually at [registrar].com/abuse or in their support center).
          </p>
          <p>
            <strong className="text-landing-foreground">Your abuse report should include:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your business name and trademark registration numbers (if applicable)</li>
            <li>The infringing domain name</li>
            <li>Clear explanation of the impersonation or phishing activity</li>
            <li>Screenshots showing the violation</li>
            <li>Your contact information</li>
            <li>A formal request for suspension under their Acceptable Use Policy</li>
          </ul>
          <p>
            For phishing and trademark infringement, most registrars will suspend domains within 24-48 hours of a valid abuse report.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 6: Contact the Hosting Provider</h3>
          <p>
            If registrar action is slow or you want parallel tracks, go directly to the hosting provider. Use tools like SecurityTrails, IPinfo, or BuiltWith to identify who hosts the fake site.
          </p>
          <p>
            <strong className="text-landing-foreground">Major hosting provider abuse contacts:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cloudflare: cloudflare.com/abuse</li>
            <li>Amazon AWS: aws.amazon.com/premiumsupport/knowledge-center/report-abuse/</li>
            <li>Google Cloud: support.google.com/code/contact/cloud_platform_report</li>
            <li>GoDaddy: godaddy.com/help/report-abuse-27154</li>
            <li>Namecheap: namecheap.com/support/knowledgebase/article.aspx/9196/5/how-to-report-abuse</li>
            <li>DigitalOcean: digitalocean.com/legal</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 7: File DMCA or Trademark Complaints</h3>
          <p>
            If the impersonation uses your copyrighted content (logo images, website text, product photos), file a DMCA takedown notice. If it uses your trademarked name or logo, file a trademark complaint.
          </p>
          <p>
            <strong className="text-landing-foreground">For DMCA:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most hosting providers and platforms have DMCA forms</li>
            <li>Include the exact URLs of infringing content</li>
            <li>State that you have a good faith belief the use is not authorised</li>
            <li>Include your contact information and electronic signature</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">For trademark infringement:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most platforms have brand protection/trademark report forms</li>
            <li>Provide your trademark registration numbers</li>
            <li>Explain how the use creates confusion with your brand</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 8: Report Social Media Impersonation</h3>
          <p>
            If the impersonation extends to social platforms, report through each platform&apos;s brand protection channels:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Facebook/Instagram:</strong> facebook.com/help/contact/357439354283890 (for business impersonation)</li>
            <li><strong>LinkedIn:</strong> linkedin.com/help/linkedin/ask/TS-RPP</li>
            <li><strong>X/Twitter:</strong> help.twitter.com/forms/impersonation</li>
            <li><strong>TikTok:</strong> tiktok.com/legal/report/feedback</li>
            <li><strong>YouTube:</strong> support.google.com/youtube/answer/2801947</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Phase 3: Customer Protection (Hours 4-24)</h2>
          <p>
            While takedown efforts are underway, protect the customers who might encounter the impersonation.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 9: Issue a Customer Alert</h3>
          <p>
            Transparency builds trust. Proactively communicate the threat:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send an email to your customer list describing the impersonation</li>
            <li>Post warnings on your official social media accounts</li>
            <li>Add a banner to your website if the threat is significant</li>
            <li>Update your support team so they can answer customer questions</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Your alert should include:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Description of the impersonation (fake website URL, social accounts, etc.)</li>
            <li>Your official website and social media handles</li>
            <li>How customers can verify legitimate communications from you</li>
            <li>What to do if they interacted with the fake site (change passwords, contact banks, etc.)</li>
            <li>Your official customer service contact for questions</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 10: Activate Your Incident Response Team</h3>
          <p>
            If you have a team, brief them immediately:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Customer support:</strong> Prepare responses for inquiries about the fake site</li>
            <li><strong>Social media team:</strong> Monitor for mentions and respond to confused customers</li>
            <li><strong>Legal:</strong> Prepare for potential escalations or customer claims</li>
            <li><strong>IT/Security:</strong> Check if any internal systems were compromised (if the impersonation involved stolen content)</li>
            <li><strong>Leadership:</strong> Keep executives informed of status and potential business impact</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 11: Report to Relevant Authorities</h3>
          <p>
            Depending on the severity, report to appropriate authorities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>United States:</strong> FBI IC3 (ic3.gov) for significant fraud; FTC (reportfraud.ftc.gov) for consumer protection</li>
            <li><strong>United Kingdom:</strong> Action Fraud (actionfraud.police.uk)</li>
            <li><strong>Australia:</strong> ReportCyber (cyber.gov.au/acsc/report)</li>
            <li><strong>EU:</strong> National cybercrime units via Europol links</li>
          </ul>
          <p>
            Include all the evidence you collected in Phase 1. Law enforcement moves slowly, but a report creates a record if the issue escalates.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Phase 4: Recovery and Hardening (Day 2-7)</h2>
          <p>
            Once the immediate threat is contained, focus on preventing recurrence.
          </p>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 12: Verify Complete Takedown</h3>
          <p>
            Confirm the impersonation is fully removed:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Check that the domain returns an error or parked page</li>
            <li>Verify social media accounts are suspended</li>
            <li>Confirm fake apps are removed from app stores</li>
            <li>Check for any new variations the attacker might have registered</li>
            <li>Monitor for DNS changes that might indicate the attacker is moving hosts</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 13: Conduct a Post-Incident Review</h3>
          <p>
            Document what happened and how you responded:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Timeline of the attack and your response</li>
            <li>How the impersonation was discovered</li>
            <li>Which takedown methods were most effective</li>
            <li>Any customer impact (complaints, reported fraud, refund requests)</li>
            <li>Lessons learned and process improvements</li>
          </ul>
          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 14: Implement Proactive Monitoring</h3>
          <p>
            The best response to impersonation is preventing it from happening again. You need continuous monitoring that alerts you to lookalike domains and accounts before they are used against you.
          </p>
          <p>
            <strong className="text-landing-foreground">DoppelDown</strong> provides automated domain monitoring that detects:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Typosquats and character-swapped domains</li>
            <li>Homoglyph attacks using lookalike Unicode characters</li>
            <li>Combosquats with appended words like &quot;-support&quot; or &quot;-official&quot;</li>
            <li>New TLD variations of your brand</li>
            <li>Active website content on suspicious domains</li>
          </ul>
          <p>
            With DoppelDown, you will know about impersonation attempts within hours of domain registration — often before the attacker has even built the fake site. Real-time alerts, risk scoring, and automated evidence collection mean you can initiate takedowns faster than ever before.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">When to Consider Legal Action</h2>
          <p>
            Most brand impersonation can be resolved through takedown requests, but some situations warrant legal action:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Significant financial losses:</strong> If customers lost money or you suffered measurable revenue impact</li>
            <li><strong>Repeat offenders:</strong> When the same attacker keeps registering new domains</li>
            <li><strong>Registrar non-compliance:</strong> If registrars refuse to act on valid abuse reports</li>
            <li><strong>Data breaches:</strong> If customer data was stolen through the impersonation</li>
            <li><strong>Defamation:</strong> If the fake site damages your reputation beyond standard impersonation</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Legal options include:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cease and desist letters:</strong> Often sufficient for clear-cut cases</li>
            <li><strong>UDRP proceedings:</strong> For domain name disputes under ICANN rules (costs $1,500-5,000)</li>
            <li><strong>Court injunctions:</strong> To force immediate takedown</li>
            <li><strong>Civil litigation:</strong> To recover damages in severe cases</li>
          </ul>
          <p>
            Consult an intellectual property attorney familiar with internet law. Many offer flat-fee packages for standard takedown situations.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Building Your Brand Protection Playbook</h2>
          <p>
            Do not wait for the next incident. Create a documented brand protection playbook now:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Assign roles:</strong> Who is responsible for monitoring, who handles takedowns, who communicates with customers?</li>
            <li><strong>Document your official presence:</strong> Maintain a list of your exact domain names, social media handles, and app store listings</li>
            <li><strong>Create templates:</strong> Pre-write abuse report templates for common registrars and platforms</li>
            <li><strong>Establish relationships:</strong> Connect with platform trust and safety teams before you need them</li>
            <li><strong>Set up monitoring:</strong> Implement automated detection that alerts you to new threats</li>
            <li><strong>Review quarterly:</strong> Update your playbook as your online presence evolves</li>
          </ol>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Prevention Is Your Strongest Defense</h2>
          <p>
            Brand impersonation is stressful, time-consuming, and damaging. Every hour you spend fighting a fake site is an hour not spent growing your business. The businesses that avoid this fate are not lucky — they are prepared.
          </p>
          <p>
            <strong className="text-landing-foreground">DoppelDown</strong> exists to make that preparation automatic. Our platform monitors the entire domain namespace for threats to your brand, alerting you to lookalike domains, suspicious registrations, and active impersonation attempts in real-time.
          </p>
          <p>
            Instead of discovering impersonation through customer complaints, you will know about it before the site even goes live. Instead of scrambling to collect evidence, you will have automated documentation ready for takedown requests. Instead of constantly watching for the next attack, you will have peace of mind knowing DoppelDown is watching for you.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start protecting your brand with DoppelDown today</Link> — it is free to start, requires no credit card, and takes less than five minutes to set up. Do not wait for the next impersonation crisis. Get ahead of it.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Brand impersonation is an attack, but it is also an opportunity — to demonstrate your commitment to customer safety, to strengthen your defenses, and to build a brand that is resilient against those who would exploit it. Respond quickly, communicate transparently, and invest in prevention. Your customers will notice the difference.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
