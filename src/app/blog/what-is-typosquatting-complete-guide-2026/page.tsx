import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'What is Typosquatting? The Complete Guide for Business Owners (2026)',
  description: 'Learn what typosquatting is, the different types of typosquatting attacks, real-world examples, and how to protect your business from domain squatting threats in 2026.',
  keywords: [
    'what is typosquatting',
    'typosquatting examples',
    'typosquatting protection',
    'domain squatting',
    'typosquatting definition',
    'how to prevent typosquatting',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/what-is-typosquatting-complete-guide-2026',
  },
  openGraph: {
    title: 'What is Typosquatting? The Complete Guide for Business Owners (2026)',
    description: 'Learn what typosquatting is, the different types of attacks, real-world examples, and how to protect your business from domain squatting.',
    url: 'https://doppeldown.com/blog/what-is-typosquatting-complete-guide-2026',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is Typosquatting? The Complete Guide for Business Owners (2026)',
    description: 'Learn what typosquatting is, the different types of attacks, real-world examples, and how to protect your business.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What is Typosquatting? The Complete Guide for Business Owners (2026)',
    description: 'Learn what typosquatting is, the different types of typosquatting attacks, real-world examples, and how to protect your business from domain squatting threats in 2026.',
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
      '@id': 'https://doppeldown.com/blog/what-is-typosquatting-complete-guide-2026',
    },
    keywords: ['what is typosquatting', 'typosquatting examples', 'typosquatting protection', 'domain squatting', 'typosquatting definition', 'how to prevent typosquatting'],
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
            What is Typosquatting? The Complete Guide for Business Owners (2026)
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            You&apos;ve spent years building your brand. Your customers know your name, trust your website, and type your URL from memory. But what happens when they mistype a single letter — and land on someone else&apos;s site instead of yours?
          </p>
          <p>
            That&apos;s typosquatting. It&apos;s one of the oldest tricks in the domain fraud playbook, and in 2026 it&apos;s more dangerous than ever. This guide explains exactly what typosquatting is, the different forms it takes, real-world examples of the damage it causes, and — most importantly — what you can do to protect your business.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Typosquatting Defined: What It Is and How It Works</h2>
          <p>
            Typosquatting — sometimes called URL hijacking or domain mimicry — is the practice of registering domain names that are slight misspellings or variations of a legitimate brand&apos;s domain. The goal is to intercept traffic from users who make typing errors, click on deceptive links, or glance at a URL without noticing the subtle difference.
          </p>
          <p>
            For example, if your business operates at <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com</code>, a typosquatter might register <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewdigets.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.co</code>, or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewigets.com</code>. Each of these looks plausible at a glance, and any of them could fool a hurried customer.
          </p>
          <p>
            What makes typosquatting particularly insidious is its simplicity. There&apos;s no hacking involved. No sophisticated malware. No breaking into your servers. The attacker simply registers a domain, sets up a website or email server, and waits for your traffic — or your customers — to come to them.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The 5 Types of Typosquatting Attacks</h2>
          <p>
            Not all typosquatting looks the same. Attackers use a range of techniques to create domains that are just different enough to be separate registrations, but similar enough to fool human eyes. Understanding these categories is the first step to defending against them.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">1. Character Omission</h3>
          <p>
            The simplest form of typosquatting: dropping a single letter from the domain name. This exploits the most common type of typing error — accidentally skipping a key.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">gogle.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">google.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">amazn.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">amazon.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewigets.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com</code></li>
          </ul>
          <p>
            Character omission is devastatingly effective because the brain autocompletes familiar words. Most people won&apos;t notice a missing letter in a URL they type regularly.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">2. Character Swap (Transposition)</h3>
          <p>
            This technique swaps two adjacent characters — mimicking the natural errors people make when typing quickly.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">gogole.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">google.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">faecbook.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">facebook.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewdigets.com</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com</code></li>
          </ul>
          <p>
            Transposition attacks are especially effective on mobile keyboards where fat-finger errors are common. A study by researchers at Georgia Tech found that character transposition accounts for roughly 20% of all typosquatting registrations.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">3. Homoglyph Attacks</h3>
          <p>
            This is where typosquatting gets truly devious. Homoglyph attacks use characters that look visually identical (or nearly identical) to the real ones, but are technically different Unicode characters.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Replacing the Latin letter &quot;a&quot; with the Cyrillic &quot;а&quot; (they look identical but are different code points)</li>
            <li>Swapping a lowercase &quot;l&quot; (L) with a &quot;1&quot; (one) or uppercase &quot;I&quot; (i)</li>
            <li>Using &quot;rn&quot; to mimic &quot;m&quot; — <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acrnewidgets.com</code> looks remarkably like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com</code> in certain fonts</li>
            <li>Using accented characters like &quot;ė&quot; or &quot;ę&quot; in place of &quot;e&quot; in internationalised domain names (IDN)</li>
          </ul>
          <p>
            Homoglyph attacks are nearly impossible to detect by eye, which makes them the weapon of choice for targeted phishing campaigns. Modern browsers have introduced IDN display policies to combat this, but the protection is inconsistent across browsers and platforms.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">4. TLD Variation</h3>
          <p>
            Instead of misspelling the brand name itself, TLD variation targets the domain extension. With over 1,500 top-level domains now available, the attack surface is enormous.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.co</code> instead of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.net</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.shop</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.io</code></li>
            <li>Country-code TLDs: <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.com.au</code> or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets.co.uk</code> when you only own the <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.com</code></li>
          </ul>
          <p>
            TLD variation is particularly dangerous because the brand name is spelled correctly — only the extension differs. Customers who remember your name but not your exact TLD are vulnerable, and many won&apos;t think twice about a <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.net</code> or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.co</code> version of your domain.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">5. Combosquatting</h3>
          <p>
            Combosquatting appends or prepends common words to your brand name, creating domains that look like official subpages or services.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets-login.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets-support.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets-billing.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">secure-acmewidgets.com</code></li>
            <li><code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">my-acmewidgets.com</code></li>
          </ul>
          <p>
            Research from Georgia Tech found that combosquatting is actually more prevalent than traditional typosquatting, and it&apos;s growing faster. The reason is simple: combosquatting domains look intentional rather than accidental. A customer receiving an email from <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">acmewidgets-billing.com</code> might reasonably assume it&apos;s a legitimate subdomain or dedicated service, not a fraud.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Real-World Typosquatting Examples</h2>
          <p>
            Typosquatting isn&apos;t theoretical — it&apos;s happening at scale, to businesses of every size.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">The Google &quot;Goggle&quot; Case</h3>
          <p>
            One of the earliest high-profile cases involved <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">goggle.com</code>, which at various points has served malware, displayed ads monetising Google&apos;s traffic, and redirected visitors to scam sites. Google eventually acquired the domain, but not before millions of users were exposed.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Microsoft &amp; Microsoftt.com</h3>
          <p>
            Researchers have documented hundreds of typosquatting domains targeting Microsoft properties, including variations of <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">microsoftt.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">microsof.com</code>, and <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">micosoft.com</code>. Many of these have been used in credential-harvesting phishing campaigns targeting enterprise users.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Small Business, Real Consequences</h3>
          <p>
            It&apos;s not just the tech giants. In 2025, a regional accounting firm discovered that someone had registered a combosquat of their domain with &quot;-portal&quot; appended and was using it to send fake invoice emails to their clients. By the time the firm found out — through a confused client phone call — three customers had already wired payments to fraudulent accounts. The total loss exceeded $120,000, and the reputational damage took months to repair.
          </p>
          <p>
            This pattern repeats across industries. E-commerce shops lose sales to cloned storefronts. SaaS companies have their login pages replicated for credential theft. Professional services firms see their client communications hijacked. The common thread: the businesses targeted had no monitoring in place to catch the lookalike domains early.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Business Impact of Typosquatting</h2>
          <p>
            The consequences of typosquatting extend far beyond the immediate fraud. Here&apos;s what&apos;s really at stake:
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Direct Financial Loss</h3>
          <p>
            When customers are tricked into making payments, sharing credit card details, or entering credentials on a typosquatted site, the financial impact hits both the customer and your business. Chargebacks, fraud claims, and remediation costs add up quickly. For small businesses, a single successful campaign can mean five- or six-figure losses.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Eroded Customer Trust</h3>
          <p>
            Customers who get scammed through a domain that looks like yours don&apos;t always blame the attacker. They blame you. &quot;Why didn&apos;t you protect your brand?&quot; &quot;How could you let this happen?&quot; Trust is one of the hardest things to rebuild, and typosquatting can shatter it overnight.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">SEO and Traffic Diversion</h3>
          <p>
            Typosquatted domains can siphon organic traffic away from your legitimate site. If a squatter sets up a convincing-looking website, search engines may even index it — creating confusion in search results and diluting your brand authority.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Legal and Compliance Exposure</h3>
          <p>
            Depending on your industry, a typosquatting attack that leads to customer data exposure could trigger regulatory obligations. Financial services, healthcare, and any business handling personal data may face notification requirements, audits, and potential fines — even when the breach occurred on someone else&apos;s infrastructure.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Operational Disruption</h3>
          <p>
            Responding to a typosquatting incident consumes time and resources. Your team ends up firefighting — dealing with customer complaints, filing takedown requests, coordinating with legal counsel, and communicating with affected parties — instead of running the business.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How to Protect Your Business from Typosquatting</h2>
          <p>
            The good news is that typosquatting protection doesn&apos;t require an enterprise security budget. Here&apos;s a practical, layered approach that works for businesses of any size.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Register Defensive Domains</h3>
          <p>
            Start by registering the most obvious misspellings and TLD variations of your brand domain. Focus on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Common single-character omissions</li>
            <li>Adjacent-key substitutions (based on your keyboard layout)</li>
            <li>Key TLD variants: <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.net</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.co</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.org</code>, and your country-code TLD</li>
            <li>Common combosquats: <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand-login</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand-app</code></li>
          </ul>
          <p>
            You can&apos;t register every possible variation (there are thousands), but covering the top 10–20 most likely typos dramatically reduces your exposure.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Set Up Continuous Domain Monitoring</h3>
          <p>
            Defensive registration is a start, but it&apos;s not enough. New domains are registered every second, and attackers will always find variations you haven&apos;t covered. Continuous monitoring scans new domain registrations in real time, alerting you when anything resembling your brand appears.
          </p>
          <p>
            <strong className="text-landing-foreground">What to look for in a monitoring tool:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Real-time detection of new registrations matching your brand pattern</li>
            <li>Coverage of all five typosquatting types (omission, swap, homoglyph, TLD, combosquat)</li>
            <li>Risk scoring that prioritises active threats over parked domains</li>
            <li>Alerting that&apos;s fast enough to act before a campaign scales</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Implement Email Authentication (DMARC, SPF, DKIM)</h3>
          <p>
            Typosquatted domains are frequently used as email-sending platforms. Implementing DMARC with a <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code> policy on your legitimate domain prevents attackers from directly spoofing your exact domain. While it won&apos;t stop emails from lookalike domains, it eliminates one major attack vector and gives you reporting data on spoofing attempts.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Establish a Takedown Process</h3>
          <p>
            When you discover a typosquatted domain, speed matters. Have a documented process ready:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Document the evidence</strong> — Screenshots, WHOIS records, DNS configurations, and any phishing content hosted on the domain</li>
            <li><strong className="text-landing-foreground">Report to the registrar</strong> — Most registrars have abuse reporting processes and are obligated to act on legitimate complaints</li>
            <li><strong className="text-landing-foreground">Report to the hosting provider</strong> — If the domain hosts active content, the hosting provider can often remove it faster than the registrar can suspend the domain</li>
            <li><strong className="text-landing-foreground">Submit to Google Safe Browsing</strong> — Flag the domain so browsers warn users before visiting</li>
            <li><strong className="text-landing-foreground">Consider UDRP</strong> — For persistent or commercially motivated squatting, the Uniform Domain-Name Dispute-Resolution Policy provides formal arbitration</li>
          </ol>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">Educate Your Customers</h3>
          <p>
            Publish a page on your website listing your official domains and communication channels. Include security guidance in your customer onboarding. When customers know what to expect from your legitimate communications, they&apos;re far more likely to spot — and report — fakes.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How DoppelDown Protects Against Typosquatting</h2>
          <p>
            Manual typosquatting protection doesn&apos;t scale. Searching WHOIS databases by hand, periodically Googling variations of your domain, and hoping customers report suspicious sites — it&apos;s reactive, slow, and riddled with blind spots.
          </p>
          <p>
            <strong className="text-landing-foreground">DoppelDown</strong> was built to solve exactly this problem. Here&apos;s how it works:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Automated domain monitoring:</strong> DoppelDown continuously scans new domain registrations across all major TLDs, detecting typosquats, homoglyphs, TLD variations, and combosquats the moment they appear</li>
            <li><strong className="text-landing-foreground">Intelligent risk scoring:</strong> Not every lookalike domain is an active threat. DoppelDown analyses DNS configurations, website content, email setup, and hosting patterns to prioritise the domains that pose real danger</li>
            <li><strong className="text-landing-foreground">Instant alerts:</strong> Get notified immediately when a high-risk domain is detected — not days or weeks after it&apos;s been registered</li>
            <li><strong className="text-landing-foreground">Takedown support:</strong> DoppelDown streamlines the takedown process with documented evidence collection and direct reporting workflows</li>
          </ul>
          <p>
            Whether you&apos;re a solo founder protecting a single brand or a growing business with multiple product lines, DoppelDown gives you the visibility that typosquatters count on you not having.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Don&apos;t Wait for the Typo That Costs You Everything</h2>
          <p>
            Typosquatting is one of those threats that feels abstract — until it happens to you. And when it does, the damage is immediate, personal, and expensive. A single convincing typosquatted domain can redirect your customers to phishing pages, capture their credentials, steal their money, and destroy their trust in your brand.
          </p>
          <p>
            The businesses that avoid this fate aren&apos;t the ones with the biggest security budgets. They&apos;re the ones with visibility. They know what domains exist in the shadow of their brand, and they act before those domains become weapons.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start monitoring your brand with DoppelDown today</Link> — it&apos;s free, requires no credit card, and takes less than five minutes to set up. Find out what&apos;s lurking in the typos before your customers do.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Typosquatting exploits the gap between human perception and digital precision. DoppelDown closes that gap — monitoring the thousands of domain variations you can&apos;t track manually, so you can focus on running your business.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
