import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'How to Monitor Your Brand Online: A Guide for Small Businesses | DoppelDown',
  description: 'Learn how to set up effective online brand monitoring for your small business. Step-by-step guide covering domain monitoring, social media scanning, and phishing detection.',
  keywords: ['brand monitoring', 'online brand monitoring', 'brand monitoring tools', 'monitor brand online', 'brand monitoring for small business', 'digital brand protection'],
  alternates: {
    canonical: 'https://doppeldown.com/blog/how-to-monitor-your-brand-online-guide-for-small-businesses',
  },
  openGraph: {
    title: 'How to Monitor Your Brand Online: A Guide for Small Businesses',
    description: 'Step-by-step guide to setting up online brand monitoring for your SMB.',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00.000Z',
    authors: ['DoppelDown Team'],
    url: 'https://doppeldown.com/blog/how-to-monitor-your-brand-online-guide-for-small-businesses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Monitor Your Brand Online: A Guide for Small Businesses',
    description: 'Step-by-step guide to setting up online brand monitoring for your SMB.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Monitor Your Brand Online: A Guide for Small Businesses',
    description: 'Learn how to set up effective online brand monitoring for your small business.',
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
      '@id': 'https://doppeldown.com/blog/how-to-monitor-your-brand-online-guide-for-small-businesses',
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
            <span className="bg-primary-600/20 text-primary-400 px-2 py-0.5 rounded">Brand Monitoring</span>
            <span>•</span>
            <time dateTime="2026-02-03">February 3, 2026</time>
            <span>•</span>
            <span>9 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-landing-foreground mb-4">
            How to Monitor Your Brand Online: A Guide for Small Businesses
          </h1>
          <p className="text-xl text-landing-muted">
            Your brand is your most valuable asset. But in 2026, threats to your brand don&apos;t just come from competitors — they come from cybercriminals who impersonate your business, register lookalike domains, and trick your customers with phishing sites.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Why Brand Monitoring Matters for SMBs</h2>
          <p className="text-landing-muted mb-4">
            Most small business owners think brand protection is something only Fortune 500 companies need to worry about. The reality is quite different. According to the FBI&apos;s IC3, small businesses are now the primary target for brand impersonation attacks, with losses averaging $120,000 per incident in 2025.
          </p>
          <p className="text-landing-muted mb-4">
            Brand monitoring is the practice of systematically tracking how your brand appears across the internet — including domain registrations, social media accounts, websites, and search results. When done right, it gives you early warning of threats so you can act before damage is done.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The 5 Pillars of Online Brand Monitoring</h2>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">1. Domain Monitoring</h3>
          <p className="text-landing-muted mb-4">
            Domain monitoring is the foundation of brand protection. Cybercriminals routinely register domains that look similar to legitimate businesses — using typos (gooogle.com), different TLDs (yourbrand.xyz), or added words (yourbrand-login.com).
          </p>
          <p className="text-landing-muted mb-2"><strong className="text-landing-foreground">What to watch for:</strong></p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Exact-match domains on different TLDs (.net, .org, .io, .xyz)</li>
            <li>Typosquatting variants (common misspellings of your brand)</li>
            <li>Homoglyph attacks (using characters that look similar: rn vs m)</li>
            <li>Brand + keyword combinations (yourbrand-login.com, yourbrand-support.com)</li>
            <li>Newly registered domains (NRDs) containing your brand name</li>
          </ul>
          <p className="text-landing-muted mb-2"><strong className="text-landing-foreground">DIY approach:</strong> Manually check domain registrars weekly. Time-consuming and easy to miss.</p>
          <p className="text-landing-muted mb-4"><strong className="text-landing-foreground">Better approach:</strong> Use a tool like <Link href="/" className="text-primary-400 hover:text-primary-300">DoppelDown</Link> that automatically monitors domain registrations and alerts you to new threats.</p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">2. Social Media Scanning</h3>
          <p className="text-landing-muted mb-4">
            Fake social media accounts are one of the most common forms of brand impersonation. Scammers create accounts that mimic your brand to steal customer data, run fake promotions, or damage your reputation.
          </p>
          <p className="text-landing-muted mb-2"><strong className="text-landing-foreground">What to watch for:</strong></p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Accounts using your brand name or logo on platforms you don&apos;t use</li>
            <li>Accounts with slight name variations (underscore additions, number substitutions)</li>
            <li>Accounts impersonating your employees or executives</li>
            <li>Fake customer service accounts</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">3. Website Clone Detection</h3>
          <p className="text-landing-muted mb-4">
            Website cloning has become disturbingly easy. Tools exist that can create a pixel-perfect copy of your website in minutes. These clones are used in phishing attacks to steal login credentials, payment information, and personal data from your customers.
          </p>
          <p className="text-landing-muted mb-4">
            Modern brand monitoring tools use visual similarity analysis and content fingerprinting to detect when someone has copied your website, even if they&apos;ve made minor modifications.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">4. Search Result Monitoring</h3>
          <p className="text-landing-muted mb-4">
            When someone searches for your brand name, what do they find? Ideally, your legitimate website and social profiles dominate the first page. But scammers sometimes use SEO techniques to rank phishing pages or fake storefronts alongside — or even above — your real site.
          </p>
          <p className="text-landing-muted mb-4">
            Regular search monitoring helps you identify and address these threats before they impact your customers.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">5. Dark Web Monitoring</h3>
          <p className="text-landing-muted mb-4">
            This is more advanced but increasingly important. Dark web forums and marketplaces are where stolen credentials, phishing kits, and brand impersonation tools are traded. Monitoring these spaces can give you early warning that an attack is being planned.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Setting Up Brand Monitoring: A Step-by-Step Guide</h2>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 1: Inventory Your Brand Assets</h3>
          <p className="text-landing-muted mb-2">Before you can monitor your brand, you need to know what you&apos;re protecting. Create a list of:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Your primary domain(s) and all TLD variations you own</li>
            <li>Your official social media accounts (all platforms)</li>
            <li>Your brand name, taglines, and key product names</li>
            <li>Your logo and visual brand elements</li>
            <li>Key employee names (especially executives)</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 2: Set Up Automated Domain Monitoring</h3>
          <p className="text-landing-muted mb-2">Manual domain checking is not sustainable. Set up automated monitoring that:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Scans newly registered domains daily for brand matches</li>
            <li>Checks existing suspicious domains for active content</li>
            <li>Alerts you immediately when high-risk threats are detected</li>
            <li>Prioritises threats by severity (not all suspicious domains are equal)</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 3: Configure Alert Thresholds</h3>
          <p className="text-landing-muted mb-2">Not every alert needs immediate action. Configure your monitoring to differentiate between:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Critical:</strong> Active phishing site mimicking your login page</li>
            <li><strong className="text-landing-foreground">High:</strong> New domain with your exact brand name + suspicious content</li>
            <li><strong className="text-landing-foreground">Medium:</strong> New domain registration with partial brand match</li>
            <li><strong className="text-landing-foreground">Low:</strong> Dormant domain with similar name but no content</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 4: Establish a Response Playbook</h3>
          <p className="text-landing-muted mb-2">When a threat is detected, you need to act quickly. Have a documented response plan:</p>
          <ol className="list-decimal pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Verify</strong> the threat is genuine (not a false positive)</li>
            <li><strong className="text-landing-foreground">Document</strong> everything (screenshots, timestamps, evidence)</li>
            <li><strong className="text-landing-foreground">Report</strong> to the relevant registrar, hosting provider, or platform</li>
            <li><strong className="text-landing-foreground">Block</strong> the threat domain in your email security systems</li>
            <li><strong className="text-landing-foreground">Notify</strong> affected customers if data may have been compromised</li>
          </ol>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Step 5: Review and Refine Monthly</h3>
          <p className="text-landing-muted mb-2">Brand monitoring is not set-and-forget. Review your alerts monthly to:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li>Tune alert thresholds to reduce false positives</li>
            <li>Add new keywords or brand terms to monitor</li>
            <li>Update your response playbook based on new threat patterns</li>
            <li>Assess the effectiveness of your takedown requests</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Brand Monitoring Tools: Free vs Paid</h2>
          <p className="text-landing-muted mb-4">
            Enterprise-grade brand protection tools like BrandShield, Red Points, and Bolster start at $15,000/year and can cost $250,000+. For most small businesses, that&apos;s simply not feasible.
          </p>
          <p className="text-landing-muted mb-2"><Link href="/" className="text-primary-400 hover:text-primary-300">DoppelDown</Link> was built specifically for this gap. We offer:</p>
          <ul className="list-disc pl-6 space-y-1 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Free tier:</strong> Monitor 1 brand with basic domain scanning</li>
            <li><strong className="text-landing-foreground">Starter ($49/mo):</strong> Up to 5 brands, daily scans, email alerts</li>
            <li><strong className="text-landing-foreground">Pro ($99/mo):</strong> Up to 20 brands, real-time monitoring, API access</li>
            <li><strong className="text-landing-foreground">Enterprise ($249/mo):</strong> Unlimited brands, NRD monitoring, dark web scanning</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Common Brand Monitoring Mistakes to Avoid</h2>
          <ol className="list-decimal pl-6 space-y-2 text-landing-muted mb-4">
            <li><strong className="text-landing-foreground">Only monitoring your exact domain:</strong> You need to monitor variations, misspellings, and related terms</li>
            <li><strong className="text-landing-foreground">Ignoring social media:</strong> Domain monitoring alone misses a huge attack surface</li>
            <li><strong className="text-landing-foreground">Not acting on alerts:</strong> Monitoring without response is like having a fire alarm but no fire extinguisher</li>
            <li><strong className="text-landing-foreground">Waiting for customers to report issues:</strong> By then, damage is already done</li>
            <li><strong className="text-landing-foreground">Thinking you&apos;re too small to be targeted:</strong> Small businesses are targeted precisely because they lack protection</li>
          </ol>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Get Started Today</h2>
          <p className="text-landing-muted mb-4">
            Brand monitoring doesn&apos;t have to be complicated or expensive. Start with the basics — automated domain monitoring and social media scanning — and build from there as your needs grow.
          </p>
          <p className="text-landing-muted mb-4">
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 font-semibold">Sign up for DoppelDown free</Link> and start monitoring your brand in minutes. No credit card required.
          </p>
        </div>

        {/* CTA Box */}
        <div className="mt-12 p-6 bg-landing-elevated rounded-lg border border-landing-border">
          <h3 className="text-lg font-semibold text-landing-foreground mb-2">Ready to protect your brand?</h3>
          <p className="text-landing-muted mb-4">
            DoppelDown monitors your brand 24/7 and alerts you to threats before they reach your customers.
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
