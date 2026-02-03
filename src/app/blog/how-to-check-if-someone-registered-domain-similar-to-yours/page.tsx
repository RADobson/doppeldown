import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How to Check if Someone Registered a Domain Similar to Yours',
  description: 'Learn how to find lookalike domains targeting your brand. Step-by-step guide to checking for similar domain registrations, typosquats, and homoglyph attacks — plus tools to automate the process.',
  keywords: [
    'check similar domain names',
    'find lookalike domains',
    'someone registered domain similar to mine',
    'domain name monitoring',
    'detect typosquatting domains',
    'brand domain protection',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-to-check-if-someone-registered-domain-similar-to-yours',
  },
  openGraph: {
    title: 'How to Check if Someone Registered a Domain Similar to Yours',
    description: 'Learn how to find lookalike domains targeting your brand. Step-by-step guide to checking for similar domain registrations and tools to automate the process.',
    url: 'https://doppeldown.com/blog/how-to-check-if-someone-registered-domain-similar-to-yours',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Check if Someone Registered a Domain Similar to Yours',
    description: 'Learn how to find lookalike domains targeting your brand. Step-by-step guide to checking for similar domain registrations.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'How to Check if Someone Registered a Domain Similar to Yours',
    description: 'Learn how to find lookalike domains targeting your brand. Step-by-step guide to checking for similar domain registrations, typosquats, and homoglyph attacks — plus tools to automate the process.',
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
      '@id': 'https://doppeldown.com/blog/how-to-check-if-someone-registered-domain-similar-to-yours',
    },
    keywords: ['check similar domain names', 'find lookalike domains', 'someone registered domain similar to mine', 'domain name monitoring', 'detect typosquatting domains', 'brand domain protection'],
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
              Domain Security
            </span>
            <time className="text-sm text-landing-muted" dateTime="2026-02-03">
              February 3, 2026
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-landing-foreground leading-tight mb-4">
            How to Check if Someone Registered a Domain Similar to Yours
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            You own your domain. You&apos;ve built your brand around it. But how do you know if someone else has quietly registered a domain that looks almost identical — and is using it to intercept your customers, send phishing emails, or clone your website?
          </p>
          <p>
            The uncomfortable truth is that most businesses have no idea how many lookalike domains exist in the shadow of their brand. Attackers register them daily, and the registration process is cheap, fast, and largely anonymous. By the time you discover a lookalike domain through a customer complaint or a suspicious email report, the damage is usually already done.
          </p>
          <p>
            This guide walks you through exactly how to check for domains similar to yours — from quick manual techniques to automated monitoring that catches threats in real time.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Why Lookalike Domains Are Dangerous</h2>
          <p>
            Before diving into the how, it&apos;s worth understanding the scale of the problem. Lookalike domains — also known as <Link href="/blog/what-is-typosquatting-complete-guide-2026" className="text-primary-400 hover:text-primary-300 underline">typosquats</Link>, homoglyph domains, or doppelgänger domains — are registered for a variety of malicious purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Phishing:</strong> Sending emails from a domain like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourband.com</code> (missing the &quot;r&quot;) to trick recipients into sharing credentials or making payments</li>
            <li><strong className="text-landing-foreground">Website cloning:</strong> Hosting a near-identical copy of your site to harvest customer data or redirect purchases</li>
            <li><strong className="text-landing-foreground">Traffic theft:</strong> Capturing visitors who mistype your URL and monetising them through ads or affiliate redirects</li>
            <li><strong className="text-landing-foreground">Reputation damage:</strong> Hosting offensive or fraudulent content on a domain that looks like yours</li>
            <li><strong className="text-landing-foreground">Supply chain attacks:</strong> Impersonating your company in communications with your partners, vendors, or employees</li>
          </ul>
          <p>
            Research shows that the average brand has between 50 and 200+ lookalike domains registered against it at any given time. For well-known brands, that number can climb into the thousands. And you don&apos;t need to be a household name to be targeted — <Link href="/blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it" className="text-primary-400 hover:text-primary-300 underline">SMBs are increasingly the primary targets</Link> because attackers know they lack the resources to fight back.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Method 1: Manual WHOIS Lookups</h2>
          <p>
            The simplest starting point is a WHOIS lookup. WHOIS databases contain registration information for domain names, including when a domain was registered, who registered it (if not privacy-protected), and which registrar was used.
          </p>
          <p>
            <strong className="text-landing-foreground">How to do it:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Brainstorm variations of your domain — common typos, missing letters, swapped characters, different TLDs (<code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.net</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.co</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.org</code>)</li>
            <li>Search each variation using a WHOIS tool (like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">whois.domaintools.com</code> or your terminal&apos;s <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">whois</code> command)</li>
            <li>Check if the domain is registered and, if so, when it was created and by whom</li>
          </ol>
          <p>
            <strong className="text-landing-foreground">Limitations:</strong> This approach is painfully slow and incomplete. A typical brand name has hundreds — sometimes thousands — of possible misspellings and variations. Checking them one at a time is impractical, and you&apos;ll inevitably miss the creative variations attackers actually use. Plus, WHOIS data increasingly shows &quot;REDACTED FOR PRIVACY&quot; thanks to GDPR-era registration policies, limiting its usefulness.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Method 2: Certificate Transparency Logs</h2>
          <p>
            Certificate Transparency (CT) logs are public records of every SSL/TLS certificate issued by a trusted Certificate Authority. Since most modern websites — including phishing sites — use HTTPS, CT logs are a surprisingly effective way to discover lookalike domains.
          </p>
          <p>
            <strong className="text-landing-foreground">How to do it:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visit a CT log search tool like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">crt.sh</code></li>
            <li>Search for <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">%.yourbrand%</code> (using wildcards) to find certificates issued for domains containing your brand name</li>
            <li>Review the results for suspicious domains you don&apos;t own</li>
          </ol>
          <p>
            <strong className="text-landing-foreground">Why it works:</strong> When an attacker registers a lookalike domain and sets up a website (especially a phishing page), they almost always provision an SSL certificate to make the site appear legitimate. That certificate issuance gets logged in CT logs — often within minutes of the domain going active. This makes CT logs one of the fastest public signals that a lookalike domain has moved from &quot;parked&quot; to &quot;weaponised.&quot;
          </p>
          <p>
            <strong className="text-landing-foreground">Limitations:</strong> CT logs only capture domains with SSL certificates. They won&apos;t reveal parked domains, domains used only for email-based attacks, or domains that haven&apos;t yet been activated. You also need to check regularly — by the time you manually look, an attack may already be in progress.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Method 3: DNS Enumeration and Passive DNS</h2>
          <p>
            Passive DNS databases record historical DNS resolution data — essentially logging which domains resolved to which IP addresses over time. Tools like SecurityTrails, VirusTotal, and Farsight DNSDB allow you to search for domains similar to yours.
          </p>
          <p>
            This approach can reveal lookalike domains that share hosting infrastructure with known malicious sites, or that were recently activated and pointed at web servers. It&apos;s more technical than WHOIS or CT log searches, but it provides deeper visibility into the infrastructure behind a suspicious domain.
          </p>
          <p>
            <strong className="text-landing-foreground">Limitations:</strong> Passive DNS requires technical expertise to use effectively. The data can be overwhelming, and interpreting whether a similar domain is malicious or benign requires context that raw DNS records don&apos;t provide.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Method 4: Google Dorking</h2>
          <p>
            A quick and surprisingly effective technique is to use Google&apos;s advanced search operators to find websites impersonating your brand.
          </p>
          <p>
            <strong className="text-landing-foreground">Try searches like:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">intitle:&quot;Your Brand Name&quot; -site:yourdomain.com</code> — finds pages using your brand name that aren&apos;t on your site</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">&quot;Your Brand Name&quot; login -site:yourdomain.com</code> — specifically targets fake login pages</li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">site:yourbrand.net OR site:yourbrand.co OR site:yourbrand.org</code> — checks whether TLD variants have active websites</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Limitations:</strong> Google only indexes a fraction of the web, and newly created phishing sites may not appear in search results for hours or days. This method catches established threats but misses new ones — exactly the window when they&apos;re most dangerous.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Method 5: Automated Domain Monitoring</h2>
          <p>
            The methods above are useful for spot checks, but they share a fundamental flaw: they&apos;re reactive. By the time you manually discover a lookalike domain, it may have been active for days or weeks — long enough to launch a <Link href="/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks" className="text-primary-400 hover:text-primary-300 underline">phishing campaign</Link>, defraud customers, or damage your reputation.
          </p>
          <p>
            Automated domain monitoring solves this by continuously scanning new domain registrations and matching them against your brand in real time. Instead of you searching for threats, the threats come to you — as alerts, the moment they appear.
          </p>
          <p>
            <strong className="text-landing-foreground">What good automated monitoring looks like:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Real-time scanning:</strong> New registrations detected within hours, not days</li>
            <li><strong className="text-landing-foreground">Comprehensive variation coverage:</strong> Not just typos — homoglyphs, TLD variations, combosquats, and character substitutions</li>
            <li><strong className="text-landing-foreground">Risk assessment:</strong> Distinguishing between a parked domain and one actively hosting phishing content or sending email</li>
            <li><strong className="text-landing-foreground">Actionable alerts:</strong> Clear notifications with enough context to decide whether to act immediately or monitor further</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How DoppelDown Makes This Effortless</h2>
          <p>
            <Link href="/" className="text-primary-400 hover:text-primary-300 underline">DoppelDown</Link> automates the entire lookalike domain detection process. Instead of cobbling together WHOIS lookups, CT log searches, and Google dorks, you enter your domain once and DoppelDown handles the rest:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Continuous monitoring</strong> across all major TLDs and registration feeds</li>
            <li><strong className="text-landing-foreground">Detection of all variation types</strong> — typosquats, homoglyphs, combosquats, TLD swaps, and more</li>
            <li><strong className="text-landing-foreground">Intelligent risk scoring</strong> that analyses DNS, hosting, email configuration, and active content to separate real threats from dormant registrations</li>
            <li><strong className="text-landing-foreground">Instant alerts</strong> so you can respond before an attack reaches your customers</li>
          </ul>
          <p>
            The manual methods described in this guide work — but they don&apos;t scale, and they don&apos;t run while you sleep. DoppelDown does.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Start Checking Today</h2>
          <p>
            Every day you&apos;re not monitoring for lookalike domains is a day an attacker could be using one against you. The good news: getting started takes less than five minutes.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Sign up for DoppelDown free</Link> — no credit card required — and see exactly how many domains similar to yours already exist. You might be surprised by what you find. And you&apos;ll definitely be glad you looked.
          </p>
          <p>
            Want to understand the broader landscape first? Read our guide on <Link href="/blog/how-to-protect-your-brand-from-domain-squatting-and-phishing-2026" className="text-primary-400 hover:text-primary-300 underline">how to protect your brand from domain squatting and phishing in 2026</Link> or explore <Link href="/pricing" className="text-primary-400 hover:text-primary-300 underline">DoppelDown&apos;s pricing plans</Link> for teams and growing businesses.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Lookalike domains thrive on invisibility. DoppelDown makes them visible — continuously scanning the domain landscape so you can protect your brand before your customers are put at risk.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
