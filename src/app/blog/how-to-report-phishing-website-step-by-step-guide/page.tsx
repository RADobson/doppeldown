import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
  description: 'Learn exactly how to report a phishing website with our comprehensive step-by-step guide. Covering Google Safe Browsing, APWG, browser vendors, hosting providers, domain registrars, and law enforcement.',
  keywords: [
    'how to report a phishing website',
    'report phishing site',
    'report fake website',
    'phishing site takedown',
    'report phishing to Google',
    'APWG phishing report',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-to-report-phishing-website-step-by-step-guide',
  },
  openGraph: {
    title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    description: 'Learn exactly how to report a phishing website with our comprehensive step-by-step guide covering all major reporting channels.',
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
    description: 'Learn exactly how to report a phishing website with our comprehensive step-by-step guide.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    description: 'Learn exactly how to report a phishing website with our comprehensive step-by-step guide. Covering Google Safe Browsing, APWG, browser vendors, hosting providers, domain registrars, and law enforcement.',
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
    keywords: ['how to report a phishing website', 'report phishing site', 'report fake website', 'phishing site takedown', 'report phishing to Google', 'APWG phishing report'],
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
              Phishing Prevention
            </span>
            <time className="text-sm text-landing-muted" dateTime="2026-02-03">
              February 3, 2026
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-landing-foreground leading-tight mb-4">
            How to Report a Phishing Website: Step-by-Step Guide (2026)
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            You have discovered a phishing website impersonating your business. Maybe a customer alerted you. Maybe you found it yourself while monitoring your brand. Either way, every minute that site stays live is a minute your customers remain at risk.
          </p>
          <p>
            Reporting phishing websites is not just about protecting your brand — it is about protecting the people who trust you. This guide walks you through exactly how to report a phishing website, who to contact, what evidence to collect, and when to escalate to law enforcement. Follow these steps to get phishing sites taken down quickly and efficiently.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 1: Document Everything Before You Report</h2>
          <p>
            Before you start filing reports, you need evidence. Phishing sites can disappear in minutes once the attackers realise they have been discovered. Capture everything while you can.
          </p>
          <p>
            <strong className="text-landing-foreground">Screenshots:</strong> Take full-page screenshots of the phishing site showing the URL, any login forms, brand impersonation, and misleading content. Use tools like the browser&apos;s built-in screenshot feature, Full Page Screen Capture extension, or command-line tools like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">shot-scraper</code>.
          </p>
          <p>
            <strong className="text-landing-foreground">WHOIS data:</strong> Look up the domain registration details using WHOIS lookup tools like who.is, ICANN Lookup, or DomainTools. Record the registrar, registration date, name servers, and any contact information. Some registrars offer privacy protection, but you may still find useful hosting or DNS information.
          </p>
          <p>
            <strong className="text-landing-foreground">DNS and hosting information:</strong> Use tools like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">dig</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">nslookup</code>, or online services like SecurityTrails and VirusTotal to identify the hosting provider and IP addresses associated with the domain.
          </p>
          <p>
            <strong className="text-landing-foreground">Phishing emails or messages:</strong> If the phishing site was promoted via email, save the original email with full headers. On Gmail, click the three dots and select &quot;Show original.&quot; On Outlook, open the message and select File &gt; Properties &gt; Message headers. These headers contain crucial information about the sending infrastructure.
          </p>
          <p>
            Store all evidence in an organized folder with timestamps. If this escalates to law enforcement or legal action, you will need a clear chain of documentation.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 2: Report to Google Safe Browsing</h2>
          <p>
            Google Safe Browsing is the most impactful first step. When a site is flagged in Safe Browsing, Chrome, Firefox, Safari, and Edge will display warning pages to users attempting to visit it. This immediately neutralises the threat even before the site is taken down.
          </p>
          <p>
            <strong className="text-landing-foreground">How to report:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visit the Google Safe Browsing report page at <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">safebrowsing.google.com/safebrowsing/report_phish/</code></li>
            <li>Enter the phishing URL in the form</li>
            <li>Complete the CAPTCHA verification</li>
            <li>Add any additional comments describing how the site is impersonating your brand</li>
            <li>Submit the report</li>
          </ol>
          <p>
            Google typically processes phishing reports within a few hours to one business day. You will not receive a direct response, but you can check if the site has been flagged by using the Safe Browsing Site Status checker at <code className="transparency-report.google.com/safe-browsing/search</code>
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 3: Report to the Anti-Phishing Working Group (APWG)</h2>
          <p>
            The Anti-Phishing Working Group (APWG) is an international coalition of financial institutions, retailers, ISPs, and security vendors that collect and analyse phishing attack data. Reporting to APWG helps protect users across multiple browsers, email providers, and security products.
          </p>
          <p>
            <strong className="text-landing-foreground">How to report:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Forward phishing emails to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">reportphishing@apwg.org</code></li>
            <li>Or submit via their web form at <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">apwg.org/reportphishing</code></li>
            <li>Include the phishing URL and any relevant details about the attack</li>
          </ol>
          <p>
            APWG shares phishing data with member organizations including major banks, email providers, and security companies. Your report helps protect users far beyond your immediate customer base.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 4: Report to Microsoft Defender SmartScreen</h2>
          <p>
            Microsoft Edge and Internet Explorer use SmartScreen to block malicious websites. A separate report here ensures protection for users on Microsoft browsers and Windows systems.
          </p>
          <p>
            <strong className="text-landing-foreground">How to report:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visit <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">microsoft.com/wdsi/support/report-unsafe-site</code></li>
            <li>Select &quot;I believe this is a phishing site&quot;</li>
            <li>Enter the malicious URL</li>
            <li>Complete the CAPTCHA and submit</li>
          </ol>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 5: Contact the Domain Registrar</h2>
          <p>
            Domain registrars have abuse policies and are obligated to take action against domains used for phishing. This is often the fastest path to complete takedown, as suspending the domain disables the entire site.
          </p>
          <p>
            <strong className="text-landing-foreground">How to find the registrar:</strong>
          </p>
          <p>
            Use a WHOIS lookup to identify the registrar. Look for the &quot;Registrar&quot; field in the results. Common registrars include GoDaddy, Namecheap, Cloudflare, Tucows, and Google Domains.
          </p>
          <p>
            <strong className="text-landing-foreground">How to report:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Find the registrar&apos;s abuse reporting page (search &quot;[registrar name] abuse report&quot;)</li>
            <li>Submit a detailed abuse report including:
              <ul className="list-disc pl-6 mt-2">
                <li>The phishing domain name</li>
                <li>Your trademark or brand being impersonated</li>
                <li>Screenshots showing the phishing content</li>
                <li>Your contact information as the brand owner</li>
                <li>A clear statement that the site is engaged in phishing</li>
              </ul>
            </li>
          </ol>
          <p>
            Most registrars have abuse teams that respond within 24-48 hours for clear phishing cases. Include as much detail as possible to expedite the process.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 6: Contact the Hosting Provider</h2>
          <p>
            If the registrar action is slow or ineffective, go directly to the hosting provider. Hosting providers can remove malicious content or suspend the account entirely.
          </p>
          <p>
            <strong className="text-landing-foreground">How to identify the hosting provider:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">lookup.icann.org</code> to find name servers, which often indicate the hosting company</li>
            <li>Check the IP address using <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">ipinfo.io</code> or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">arin.net</code></li>
            <li>Use tools like SecurityTrails or BuiltWith to identify hosting infrastructure</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Major hosting provider abuse contacts:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cloudflare: cloudflare.com/abuse</li>
            <li>AWS: aws.amazon.com/premiumsupport/knowledge-center/report-abuse/</li>
            <li>Google Cloud: support.google.com/code/contact/cloud_platform_report</li>
            <li>Microsoft Azure: report abuse through the Microsoft Services portal</li>
            <li>GoDaddy: godaddy.com/help/report-abuse-27154</li>
            <li>DigitalOcean: digitalocean.com/legal</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 7: Report to Social Media and Advertising Platforms</h2>
          <p>
            Phishing sites are often promoted through social media ads, sponsored posts, or direct messages. Reporting to these platforms can stop the distribution channel.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Meta (Facebook/Instagram):</strong> Use the report links on any ads or posts. For business impersonation, visit facebook.com/help/contact/357439354283890</li>
            <li><strong>LinkedIn:</strong> Report through the help center at linkedin.com/help/linkedin/ask/TS-RPP</li>
            <li><strong>X/Twitter:</strong> Report via the platform&apos;s reporting tools or for business impersonation, contact twitter.com/forms/impersonation</li>
            <li><strong>TikTok:</strong> Report through the app or at tiktok.com/legal/report/feedback</li>
            <li><strong>Google Ads:</strong> Report malicious ads at support.google.com/adwords/contact/anti-malware</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 8: When to Escalate to Law Enforcement</h2>
          <p>
            Not every phishing site requires law enforcement involvement, but some situations warrant official reports:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Financial losses have occurred (yours or your customers&apos;)</li>
            <li>Customer data has been compromised</li>
            <li>The phishing is part of a larger, organized campaign</li>
            <li>You have identifying information about the attackers</li>
            <li>The phishing site is targeting vulnerable populations (elderly, healthcare patients, etc.)</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">United States:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>File a complaint with the FBI&apos;s Internet Crime Complaint Center (IC3) at ic3.gov</li>
            <li>Contact your local FBI field office for significant cases</li>
            <li>Report to the FTC at reportfraud.ftc.gov for consumer protection issues</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">United Kingdom:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Report to Action Fraud at actionfraud.police.uk</li>
            <li>For urgent matters, contact your local police force</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">European Union:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact your national cybercrime reporting center</li>
            <li>Europol provides links to national reporting mechanisms at europol.europa.eu/report-a-crime/report-cybercrime-online</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Australia:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Report to ReportCyber at cyber.gov.au/acsc/report</li>
            <li>Contact your state or territory police for significant financial losses</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 9: Notify Your Customers</h2>
          <p>
            Transparency builds trust. If your customers may have encountered the phishing site, proactively communicate with them.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send an email alert describing the phishing campaign</li>
            <li>Post warnings on your official social media accounts</li>
            <li>Update your website with a security notice if appropriate</li>
            <li>Provide clear instructions on how to identify legitimate communications from your business</li>
          </ul>
          <p>
            Include your official domains, customer service contact information, and remind customers that you will never ask for passwords or sensitive information via email.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Timeline: What to Expect After Reporting</h2>
          <p>
            Takedown speeds vary, but here is a general timeline:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>0-4 hours:</strong> Browser warnings (Google Safe Browsing, SmartScreen) typically appear</li>
            <li><strong>4-24 hours:</strong> Major registrars often suspend domains for clear phishing</li>
            <li><strong>24-48 hours:</strong> Hosting providers generally respond to abuse reports</li>
            <li><strong>1-7 days:</strong> Social media platforms remove fraudulent accounts and ads</li>
            <li><strong>1-4 weeks:</strong> Law enforcement investigations begin for serious cases</li>
          </ul>
          <p>
            Follow up on your reports if you do not see action within these timeframes. Persistence pays off.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Prevention: Stop Phishing Sites Before They Launch</h2>
          <p>
            Reporting phishing sites is reactive. The real protection comes from proactive monitoring that catches these domains the moment they are registered — before they go live, before your customers see them, before any damage is done.
          </p>
          <p>
            <strong className="text-landing-foreground">DoppelDown</strong> automates this process. Our platform continuously scans new domain registrations across all major TLDs, detecting lookalike domains, typosquats, and brand impersonation attempts in real-time. When a suspicious domain is registered, you get an immediate alert with risk scoring, evidence collection tools, and streamlined takedown workflows.
          </p>
          <p>
            Instead of discovering phishing sites through customer complaints, you will know about them within hours of registration. Instead of scrambling to collect evidence after the fact, you will have automated documentation ready for abuse reports. Instead of checking dozens of different reporting channels, you will have a centralized dashboard for managing takedowns.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start monitoring your brand with DoppelDown today</Link> — it is free to start, requires no credit card, and takes less than five minutes to set up. Do not wait for the next phishing report from a customer. See the threats before they see you.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Phishing sites rely on time — time to reach your customers, time to collect credentials, time to do damage. Every minute you save in detection and reporting is a minute your customers stay safe. Document fast, report everywhere, and consider automated monitoring to catch these threats before they launch.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
