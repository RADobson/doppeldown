import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How Cybercriminals Clone Websites: What Business Owners Need to Know | DoppelDown',
  description: 'Learn how website cloning attacks work, why they target small businesses, and how to detect and prevent website impersonation attacks.',
  keywords: ['website cloning', 'website impersonation', 'phishing website', 'fake website detection', 'website clone attack', 'brand impersonation attack', 'how to detect fake websites'],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-cybercriminals-clone-websites-what-businesses-need-to-know',
  },
  openGraph: {
    title: 'How Cybercriminals Clone Websites: What Business Owners Need to Know',
    description: 'The complete guide to website cloning attacks and how to protect your business.',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00.000Z',
    authors: ['DoppelDown Team'],
    url: 'https://doppeldown.com/blog/how-cybercriminals-clone-websites-what-businesses-need-to-know',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Cybercriminals Clone Websites: What Business Owners Need to Know',
    description: 'The complete guide to website cloning attacks and how to protect your business.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How Cybercriminals Clone Websites: What Business Owners Need to Know',
    description: 'Learn how website cloning attacks work, why they target small businesses, and how to detect and prevent website impersonation attacks.',
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
      '@id': 'https://doppeldown.com/blog/how-cybercriminals-clone-websites-what-businesses-need-to-know',
    },
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
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-landing-muted mb-3">
            <span className="bg-primary-600/20 text-primary-400 px-2 py-0.5 rounded">Threat Intelligence</span>
            <span>•</span>
            <time dateTime="2026-02-03">February 3, 2026</time>
            <span>•</span>
            <span>8 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-landing-foreground mb-4">
            How Cybercriminals Clone Websites: What Business Owners Need to Know
          </h1>
          <p className="text-xl text-landing-muted">
            In 2026, creating a pixel-perfect copy of any website takes less than 60 seconds. Cybercriminals use these clones to steal customer credentials, payment information, and personal data — all while your customers think they&apos;re on your real site.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Anatomy of a Website Cloning Attack</h2>
          <p className="text-landing-muted mb-2">Website cloning is deceptively simple. Here&apos;s the typical attack chain:</p>
          <ol className="list-decimal pl-6 space-y-2 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Target selection:</strong> The attacker identifies your business as a target, often because you have customers who trust your brand and enter sensitive information on your site</li>
            <li><strong className="text-landing-foreground">Domain registration:</strong> They register a domain that looks similar to yours — a typo variant, different TLD, or your brand name with added words</li>
            <li><strong className="text-landing-foreground">Website cloning:</strong> Using freely available tools, they download a complete copy of your website — HTML, CSS, images, and all</li>
            <li><strong className="text-landing-foreground">Credential harvesting:</strong> They modify the login forms and payment pages to send data to their own servers instead of yours</li>
            <li><strong className="text-landing-foreground">Traffic generation:</strong> They drive traffic to the fake site through phishing emails, social media, or even paid ads</li>
            <li><strong className="text-landing-foreground">Profit:</strong> Stolen credentials are used for account takeover, sold on dark web markets, or used for financial fraud</li>
          </ol>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Why Small Businesses Are Prime Targets</h2>
          <p className="text-landing-muted mb-2">You might think cybercriminals only target large companies. The data says otherwise:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">43% of cyberattacks</strong> target small businesses (Verizon DBIR 2025)</li>
            <li><strong className="text-landing-foreground">SMBs are 3x more likely</strong> to be targeted by phishing than large enterprises (FBI IC3)</li>
            <li><strong className="text-landing-foreground">60% of SMBs</strong> that experience a significant cyberattack go out of business within 6 months</li>
          </ul>
          <p className="text-landing-muted mb-2">The reasons are straightforward:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Less security infrastructure:</strong> No dedicated security team, no brand monitoring tools</li>
            <li><strong className="text-landing-foreground">Slower detection:</strong> Without monitoring, cloned sites can operate for weeks or months</li>
            <li><strong className="text-landing-foreground">Customer trust:</strong> SMB customers are less likely to verify URLs carefully</li>
            <li><strong className="text-landing-foreground">Lower defences:</strong> Many SMBs lack DMARC, SPF, and other email authentication</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Tools Attackers Use</h2>
          <p className="text-landing-muted mb-4">We&apos;re not going to provide a tutorial, but it&apos;s important to understand how easy this has become:</p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Website Copiers</h3>
          <p className="text-landing-muted mb-4">
            Tools like HTTrack, wget, and numerous browser extensions can download a complete copy of any public website in seconds. These are legitimate tools with legitimate uses — but in the wrong hands, they enable instant website cloning.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Phishing Kits</h3>
          <p className="text-landing-muted mb-4">
            Pre-packaged phishing kits are sold on dark web forums for as little as $50. These kits include website templates for popular brands, credential harvesting scripts, and even hosting setup instructions. Some include &quot;phishing-as-a-service&quot; platforms where the attacker doesn&apos;t need any technical skills at all.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">AI-Powered Attacks</h3>
          <p className="text-landing-muted mb-4">
            In 2026, AI tools can generate convincing phishing pages from scratch, customise them for specific targets, and even generate realistic-sounding customer communications. The barrier to entry has never been lower.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How to Detect Cloned Websites</h2>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Automated Monitoring (Recommended)</h3>
          <p className="text-landing-muted mb-2">The most effective approach is automated monitoring that continuously scans for:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Visual similarity:</strong> Comparing screenshots of suspicious sites against your real site</li>
            <li><strong className="text-landing-foreground">Content fingerprinting:</strong> Detecting pages that contain your brand&apos;s specific text, images, or code</li>
            <li><strong className="text-landing-foreground">Domain similarity:</strong> Flagging newly registered domains that match your brand patterns</li>
            <li><strong className="text-landing-foreground">Certificate monitoring:</strong> Tracking SSL certificates issued for domains similar to yours</li>
          </ul>
          <p className="text-landing-muted mb-4">
            <Link href="/" className="text-primary-400 hover:text-primary-300">DoppelDown</Link> automates all of these detection methods, starting from our free tier.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Manual Checks You Can Do Today</h3>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Google your brand name regularly:</strong> Look for unfamiliar URLs in search results</li>
            <li><strong className="text-landing-foreground">Check for SSL certificates:</strong> Use crt.sh to search for certificates issued to domains containing your brand name</li>
            <li><strong className="text-landing-foreground">Monitor your email:</strong> If customers report &quot;strange emails from your company,&quot; investigate immediately</li>
            <li><strong className="text-landing-foreground">Set up Google Alerts:</strong> Basic but free — alerts you when your brand is mentioned on new pages</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">What to Do When You Find a Clone</h2>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 1: Document Everything</h3>
          <p className="text-landing-muted mb-2">Before the site disappears, capture evidence:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Full-page screenshots with timestamps</li>
            <li>WHOIS records for the domain</li>
            <li>Source code of the cloned pages</li>
            <li>Any phishing emails that link to the site</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 2: Report to Hosting Provider</h3>
          <p className="text-landing-muted mb-4">
            Identify where the site is hosted (using tools like dig or nslookup) and file an abuse report with the hosting provider. Most reputable hosts have abuse reporting processes and will take down phishing sites quickly.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 3: Report to Domain Registrar</h3>
          <p className="text-landing-muted mb-4">
            File a complaint with the domain registrar (identified via WHOIS). Most registrars have terms of service that prohibit phishing and will suspend the domain.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 4: Report to Google Safe Browsing</h3>
          <p className="text-landing-muted mb-4">
            Submit the URL to Google Safe Browsing (safebrowsing.google.com/safebrowsing/report_phish). This triggers warnings in Chrome, Firefox, and Safari when users try to visit the site.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 5: Notify Your Customers</h3>
          <p className="text-landing-muted mb-4">
            If customers may have been affected, notify them promptly. Transparency builds trust — customers will appreciate the warning and the fact that you&apos;re actively protecting them.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Prevention: Hardening Your Brand Against Cloning</h2>
          <ul className="list-disc pl-6 space-y-2 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Register defensive domains:</strong> Own common TLD variants and misspellings of your brand</li>
            <li><strong className="text-landing-foreground">Implement DMARC, SPF, and DKIM:</strong> These email authentication protocols prevent attackers from sending emails that appear to come from your domain</li>
            <li><strong className="text-landing-foreground">Use Content Security Policy headers:</strong> While this doesn&apos;t prevent cloning, it makes it harder for attackers to modify your site&apos;s behaviour</li>
            <li><strong className="text-landing-foreground">Monitor continuously:</strong> Automated brand monitoring catches clones early, before they cause significant damage</li>
            <li><strong className="text-landing-foreground">Educate your customers:</strong> Teach customers how to verify they&apos;re on your real site (check the URL, look for HTTPS)</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Bottom Line</h2>
          <p className="text-landing-muted mb-4">
            Website cloning attacks are cheap, easy to execute, and devastating when they succeed. The good news is that detection and prevention have also become more accessible. You don&apos;t need a six-figure security budget to protect your brand — you just need the right tools and a proactive approach.
          </p>
          <p className="text-landing-muted mb-4">
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 font-semibold">Get started with DoppelDown</Link> and start detecting website clones and domain threats automatically. Free tier available — no credit card required.
          </p>
        </div>

        {/* CTA Box */}
        <div className="mt-12 p-6 bg-landing-elevated rounded-lg border border-landing-border">
          <h3 className="text-lg font-semibold text-landing-foreground mb-2">Detect website clones automatically</h3>
          <p className="text-landing-muted mb-4">
            DoppelDown&apos;s AI-powered monitoring catches website clones and phishing sites before they impact your customers.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Start Free Trial →
          </Link>
        </div>
      </article>
    </BlogLayout>
  )
}
