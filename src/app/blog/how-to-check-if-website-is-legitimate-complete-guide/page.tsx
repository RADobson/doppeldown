import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How to Check if a Website is Legitimate: A Complete Guide (2026)',
  description: 'Learn how to check if a website is legitimate with our step-by-step guide. Discover how to spot fake websites, verify SSL certificates, check WHOIS data, and identify red flags before you share personal information.',
  keywords: [
    'how to check if website is legitimate',
    'how to tell if a website is fake',
    'how to verify website legitimacy',
    'check if website is safe',
    'website legitimacy checker',
    'identify fake websites',
    'website trust signals',
    'spot phishing websites',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-to-check-if-website-is-legitimate-complete-guide',
  },
  openGraph: {
    title: 'How to Check if a Website is Legitimate: A Complete Guide (2026)',
    description: 'Learn how to check if a website is legitimate with our step-by-step guide. Discover how to spot fake websites and verify trust signals.',
    url: 'https://doppeldown.com/blog/how-to-check-if-website-is-legitimate-complete-guide',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Check if a Website is Legitimate: A Complete Guide (2026)',
    description: 'Learn how to check if a website is legitimate with our step-by-step guide.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Check if a Website is Legitimate: A Complete Guide (2026)',
    description: 'Learn how to check if a website is legitimate with our step-by-step guide. Discover how to spot fake websites, verify SSL certificates, check WHOIS data, and identify red flags before you share personal information.',
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
      '@id': 'https://doppeldown.com/blog/how-to-check-if-website-is-legitimate-complete-guide',
    },
    keywords: ['how to check if website is legitimate', 'how to tell if a website is fake', 'how to verify website legitimacy', 'check if website is safe', 'website legitimacy checker'],
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
              Cybersecurity
            </span>
            <time className="text-sm text-landing-muted" dateTime="2026-02-03">
              February 3, 2026
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-landing-foreground leading-tight mb-4">
            How to Check if a Website is Legitimate: A Complete Guide
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            You&apos;re about to enter your credit card details. The site looks professional — sleek design, familiar logo, even some customer testimonials. But something feels off. Is this website legitimate, or are you about to become the next victim of an online scam?
          </p>
          <p>
            In 2026, telling real websites from fake ones has never been more challenging — or more important. Cybercriminals have mastered the art of cloning legitimate sites, creating lookalike domains, and building convincing facades designed to harvest your personal information, payment details, or login credentials.
          </p>
          <p>
            This guide walks you through exactly how to check if a website is legitimate. Whether you&apos;re shopping online, logging into your bank, or verifying a business partner, these techniques will help you stay safe.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Why Website Verification Matters More Than Ever</h2>
          <p>
            The statistics paint a sobering picture. According to the Anti-Phishing Working Group, phishing attacks reached record levels in 2025, with over 5 million unique phishing sites detected. Many of these are near-perfect copies of legitimate websites — down to the fonts, colors, and layout.
          </p>
          <p>
            What makes modern fake websites so dangerous is their sophistication. Attackers can clone any website in under 60 seconds using automated tools. They use SSL certificates (the padlock icon) to appear secure. They register domains that look almost identical to the real thing. And they&apos;re constantly improving their techniques.
          </p>
          <p>
            The cost of getting it wrong? Identity theft, financial loss, compromised accounts, and malware infections. The good news: with the right knowledge, you can spot even sophisticated fakes.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 1: Inspect the URL Carefully</h2>
          <p>
            The first and most important check is the URL itself. This is where most fake websites reveal themselves — if you know what to look for.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Check the Domain Name Character by Character</h3>
          <p>
            Lookalike domains are the most common trick in the phishing playbook. Attackers register domains that are visually similar to legitimate sites, often changing just one or two characters:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Character substitution:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">amaz0n.com</code> (zero instead of &apos;o&apos;), <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">paypa1.com</code> (one instead of &apos;l&apos;)</li>
            <li><strong className="text-landing-foreground">Character omission:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">gogle.com</code> (missing &apos;o&apos;), <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">facebok.com</code> (missing &apos;o&apos;)</li>
            <li><strong className="text-landing-foreground">Character swap:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">goggle.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">googel.com</code></li>
            <li><strong className="text-landing-foreground">Homoglyph attacks:</strong> Using visually identical characters from different alphabets (Cyrillic &apos;а&apos; instead of Latin &apos;a&apos;)</li>
            <li><strong className="text-landing-foreground">TLD variation:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.co</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.com</code>, or country codes like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.tk</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.ml</code></li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Pro tip:</strong> Type the domain yourself rather than clicking links in emails or messages. Hover over links to see the actual destination before clicking.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Look for HTTPS — But Don&apos;t Trust It Blindly</h3>
          <p>
            The padlock icon and &quot;https://&quot; prefix indicate that a site uses SSL/TLS encryption. This is essential — but it does not mean a site is legitimate.
          </p>
          <p>
            Here&apos;s why: SSL certificates are free and automated. Services like Let&apos;s Encrypt issue them to anyone, instantly, with no identity verification for basic certificates. A phishing site can have the same padlock as your bank.
          </p>
          <p>
            What to look for instead: Extended Validation (EV) certificates, which display the organization name in the browser address bar. However, even these are no guarantee — they&apos;re just one data point among many.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 2: Verify the SSL Certificate Details</h2>
          <p>
            While the padlock alone isn&apos;t proof of legitimacy, the certificate details can reveal important information.
          </p>
          <p>
            <strong className="text-landing-foreground">How to check:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click the padlock icon in your browser&apos;s address bar</li>
            <li>Select &quot;Certificate is valid&quot; or &quot;Connection is secure&quot;</li>
            <li>Review the certificate details, including:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Issued to:</strong> Does the organization name match what you expect?</li>
                <li><strong>Issued by:</strong> Is it from a reputable Certificate Authority?</li>
                <li><strong>Validity period:</strong> When was it issued and when does it expire?</li>
              </ul>
            </li>
          </ol>
          <p>
            Be suspicious of certificates issued very recently (within days) for established businesses, or certificates with mismatched organization names. Legitimate businesses typically have certificates valid for months or years.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 3: Perform a WHOIS Lookup</h2>
          <p>
            WHOIS databases contain registration information for every domain on the internet. This data can reveal red flags about a website&apos;s legitimacy.
          </p>
          <p>
            <strong className="text-landing-foreground">What to check in WHOIS records:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Registration date:</strong> Recently registered domains (less than a few months old) for established brands are suspicious</li>
            <li><strong className="text-landing-foreground">Registrant information:</strong> Legitimate businesses typically list actual company information. Privacy protection is common but combined with other red flags, it&apos;s concerning</li>
            <li><strong className="text-landing-foreground">Domain history:</strong> Use tools like the Wayback Machine to see if the site has a history, or if it recently changed content dramatically</li>
            <li><strong className="text-landing-foreground">Nameservers:</strong> Check where the domain is hosted. Suspicious hosting providers or bulletproof hosting services are red flags</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">Free WHOIS lookup tools:</strong> whois.net, whois.icann.org, or use the command line with <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">whois example.com</code>
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 4: Analyze Design and Content Quality</h2>
          <p>
            Professional websites invest in quality. Fake sites often cut corners in ways that become apparent upon closer inspection.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Visual Red Flags</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Low-resolution logos or images:</strong> Blurry, pixelated, or stretched images suggest quick copying</li>
            <li><strong className="text-landing-foreground">Inconsistent branding:</strong> Wrong colors, outdated logos, or mismatched fonts</li>
            <li><strong className="text-landing-foreground">Broken layouts:</strong> Misaligned elements, overlapping text, or formatting errors</li>
            <li><strong className="text-landing-foreground">Missing pages:</strong> Navigation links that lead to 404 errors or placeholder content</li>
            <li><strong className="text-landing-foreground">Generic stock photos:</strong> Excessive use of obviously generic images without context</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Content Quality Issues</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Spelling and grammar errors:</strong> Professional sites have editorial standards. Multiple errors suggest a rushed fake</li>
            <li><strong className="text-landing-foreground">Awkward phrasing:</strong> Content that sounds like it was auto-translated or AI-generated without editing</li>
            <li><strong className="text-landing-foreground">Missing legal pages:</strong> No privacy policy, terms of service, or contact information</li>
            <li><strong className="text-landing-foreground">Suspicious urgency:</strong> Excessive pressure tactics like countdown timers, &quot;only 2 left!&quot; warnings, or threats of account closure</li>
            <li><strong className="text-landing-foreground">Unrealistic offers:</strong> Prices significantly below market rate (iPhones for $99, luxury goods at 90% off)</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 5: Verify Contact Information</h2>
          <p>
            Legitimate businesses want you to contact them. Fake sites often make this difficult or provide false information.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Physical address:</strong> Look for a real street address, not just a P.O. box. Verify it on Google Maps</li>
            <li><strong className="text-landing-foreground">Phone number:</strong> Call the number. Does someone answer professionally? Is it even a working number?</li>
            <li><strong className="text-landing-foreground">Email addresses:</strong> Professional domains use branded email (support@company.com), not generic Gmail or Yahoo addresses</li>
            <li><strong className="text-landing-foreground">Social media links:</strong> Click them. Do they lead to active, established accounts with real followers and engagement?</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 6: Check for Trust Signals and Third-Party Verification</h2>
          <p>
            While trust badges can be faked, their absence — combined with other factors — is telling.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Clickable trust seals:</strong> Real security seals (Norton, McAfee, BBB) are clickable and verify when clicked. Fake sites often display static images</li>
            <li><strong className="text-landing-foreground">Reviews and ratings:</strong> Look for reviews on independent platforms (Trustpilot, Google Reviews, Yelp), not just testimonials on the site itself</li>
            <li><strong className="text-landing-foreground">Social proof:</strong> Check if the company has an active social media presence with real engagement</li>
            <li><strong className="text-landing-foreground">Press mentions:</strong> Search for news articles or press releases about the company</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 7: Use Online Safety Tools and Databases</h2>
          <p>
            Several free tools can help verify website safety:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Google Safe Browsing:</strong> Check if Google has flagged the site as dangerous at <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">transparencyreport.google.com/safe-browsing/search</code></li>
            <li><strong className="text-landing-foreground">VirusTotal:</strong> Scans URLs against multiple security engines</li>
            <li><strong className="text-landing-foreground">URLVoid:</strong> Checks domain reputation across multiple blacklists</li>
            <li><strong className="text-landing-foreground">ScamAdviser:</strong> Provides trust scores based on multiple factors</li>
            <li><strong className="text-landing-foreground">Better Business Bureau:</strong> Verify business accreditation and complaints</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Step 8: Test the Site&apos;s Functionality</h2>
          <p>
            Before entering any sensitive information, test basic functionality:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Try the search function:</strong> Does it actually work, or is it decorative?</li>
            <li><strong className="text-landing-foreground">Test the contact form:</strong> Send a message. Do you receive a response?</li>
            <li><strong className="text-landing-foreground">Check the cart/checkout:</strong> Are there obvious errors or suspicious redirects?</li>
            <li><strong className="text-landing-foreground">Review payment options:</strong> Legitimate sites offer standard payment methods. Be wary of sites that only accept wire transfers, cryptocurrency, or gift cards</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Quick Reference Checklist</h2>
          <p>
            When you need to verify a website quickly, run through this checklist:
          </p>
          <div className="bg-landing-elevated border border-landing-border rounded-lg p-6 my-8">
            <h4 className="text-landing-foreground font-semibold mb-4">Website Legitimacy Quick Check</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>URL matches the legitimate domain exactly (check for typos and lookalikes)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>HTTPS is enabled (padlock icon present)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>Domain registration is not brand new (check WHOIS)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>No obvious spelling or grammar errors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>Professional contact information provided and verifiable</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>Reviews exist on independent third-party sites</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>Not flagged by Google Safe Browsing or similar tools</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-400 font-bold">□</span>
                <span>Payment methods are standard and secure</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How Businesses Can Automate Website Verification</h2>
          <p>
            While individuals can use the manual checks above, businesses monitoring their brand presence need automated solutions. If you&apos;re running a company, you can&apos;t manually check every website that might be impersonating you.
          </p>
          <p>
            <Link href="/" className="text-primary-400 hover:text-primary-300 underline">DoppelDown</Link> provides automated brand protection that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Continuously monitors for lookalike domains and fake websites impersonating your brand</li>
            <li>Automatically detects visual similarity to your legitimate site using AI-powered analysis</li>
            <li>Alerts you immediately when new threats are detected</li>
            <li>Provides tools to document evidence and initiate takedowns</li>
            <li>Tracks the full lifecycle of impersonation attempts from registration to resolution</li>
          </ul>
          <p>
            For businesses, the cost of a single successful impersonation attack — in lost customers, chargebacks, and reputational damage — far exceeds the investment in proactive monitoring.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">When in Doubt, Don&apos;t Proceed</h2>
          <p>
            The golden rule of website verification: if something feels wrong, trust your instincts. It&apos;s better to miss a questionable deal than to compromise your financial information or identity.
          </p>
          <p>
            When you encounter a suspicious site:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Close the browser tab</li>
            <li>Navigate directly to the known legitimate site by typing the URL yourself</li>
            <li>Contact the company through verified channels to confirm offers or communications</li>
            <li>Report the fake site to Google Safe Browsing and relevant authorities</li>
          </ol>
          <p>
            Remember: legitimate businesses won&apos;t pressure you to bypass security checks or make immediate decisions. Any site that creates artificial urgency deserves extra scrutiny.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Stay Safe Online</h2>
          <p>
            Verifying website legitimacy is an essential skill in 2026. By following the steps in this guide — from careful URL inspection to automated tool verification — you can protect yourself from the vast majority of online scams.
          </p>
          <p>
            For businesses looking to protect their customers from impersonation attacks, <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">DoppelDown offers free monitoring</Link> to help you detect and respond to fake websites before they harm your customers.
          </p>
          <p>
            Stay vigilant, verify before you trust, and never let convenience override security.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              DoppelDown helps businesses monitor for fake websites and brand impersonation across the internet. Start protecting your brand today with automated detection and rapid takedown support.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}