import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: '5 Signs Your Brand Is Being Targeted by Phishing Attacks',
  description: 'Is someone using your brand to phish your customers? Here are 5 warning signs that your brand is being targeted by phishing attacks — and what to do about it before the damage spreads.',
  keywords: [
    'phishing detection',
    'brand monitoring',
    'signs of phishing attack',
    'brand phishing indicators',
    'how to detect brand phishing',
    'phishing warning signs for businesses',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks',
  },
  openGraph: {
    title: '5 Signs Your Brand Is Being Targeted by Phishing Attacks',
    description: 'Is someone using your brand to phish your customers? Here are 5 warning signs and what to do about them.',
    url: 'https://doppeldown.com/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Signs Your Brand Is Being Targeted by Phishing Attacks',
    description: 'Is someone using your brand to phish your customers? Here are 5 warning signs and what to do about them.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '5 Signs Your Brand Is Being Targeted by Phishing Attacks',
    description: 'Is someone using your brand to phish your customers? Here are 5 warning signs that your brand is being targeted by phishing attacks — and what to do about it before the damage spreads.',
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
      '@id': 'https://doppeldown.com/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks',
    },
    keywords: ['phishing detection', 'brand monitoring', 'signs of phishing attack', 'brand phishing indicators', 'how to detect brand phishing', 'phishing warning signs for businesses'],
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
            5 Signs Your Brand Is Being Targeted by Phishing Attacks
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            Here&apos;s an uncomfortable truth: someone might be using your brand to scam people right now, and you&apos;d have no idea.
          </p>
          <p>
            Brand-targeted phishing — where attackers impersonate a legitimate business to deceive its customers — is one of the fastest-growing cybersecurity threats facing small and medium-sized businesses. And unlike a data breach or ransomware attack that hits <em>your</em> systems, brand phishing often happens entirely outside your infrastructure. The fraudulent emails, fake websites, and spoofed social accounts all exist on someone else&apos;s servers, targeting your customers while you remain blissfully unaware.
          </p>
          <p>
            The good news? Brand phishing campaigns leave fingerprints. If you know what to look for, you can catch impersonation early — often before significant damage is done. Here are five warning signs that your brand is being targeted, and what to do when you spot them.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Sign 1: Customers Are Asking About Emails You Never Sent</h2>
          <p>
            This is often the first — and most telling — indicator.
          </p>
          <p>
            It starts with a trickle. A customer replies to what they think is your email, asking about a promotion you never ran. Someone calls your support line to confirm a password reset they didn&apos;t request. A long-time client forwards you a suspicious-looking invoice with your logo on it.
          </p>
          <p>
            These aren&apos;t random events. When customers contact you about communications you didn&apos;t send, it almost always means one of two things:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Your email domain is being spoofed</strong> — Someone is sending emails that appear to come from your exact domain (e.g., <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">billing@yourbrand.com</code>), exploiting weak or missing email authentication.</li>
            <li><strong className="text-landing-foreground">A lookalike domain is in play</strong> — Someone has registered a domain similar to yours (e.g., <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand-billing.com</code> or <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbr4nd.com</code>) and is sending emails from it.</li>
          </ol>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">What to Do</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Take every report seriously.</strong> Ask customers to forward the suspicious email with full headers. The headers contain routing information that reveals the true sender.</li>
            <li><strong className="text-landing-foreground">Check your DMARC reports.</strong> If you have DMARC configured (and you should — see below), your aggregate reports will show authentication failures that indicate spoofing attempts.</li>
            <li><strong className="text-landing-foreground">Search for recently registered lookalike domains.</strong> Use a domain monitoring tool or manually check WHOIS databases for variations of your brand name.</li>
          </ul>
          <p>
            <strong className="text-landing-foreground">If you don&apos;t have DMARC set up yet:</strong> This is your wake-up call. DMARC, combined with SPF and DKIM, is the single most effective defence against email domain spoofing. At a <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code> policy, it instructs receiving email servers to block messages that fail authentication — essentially shutting down direct domain spoofing.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Sign 2: Unusual Spikes in Customer Support Tickets</h2>
          <p>
            Brand phishing campaigns don&apos;t affect one customer at a time. They&apos;re launched in waves — hundreds or thousands of phishing emails sent in a single blast, or a fake website that captures traffic over days or weeks.
          </p>
          <p>The support ticket pattern is distinctive:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Volume spike:</strong> A noticeable increase in tickets over a short period, often with a cluster of similar complaints</li>
            <li><strong className="text-landing-foreground">Unfamiliar issues:</strong> Customers reporting problems with transactions, account changes, or communications that don&apos;t correspond to anything in your systems</li>
            <li><strong className="text-landing-foreground">Emotional escalation:</strong> Higher-than-normal levels of frustration, fear, or anger — customers who believe they&apos;ve been scammed aren&apos;t just annoyed, they&apos;re distressed</li>
            <li><strong className="text-landing-foreground">Geographic clustering:</strong> If the phishing campaign targets a specific region (common with localised attacks), you may see tickets concentrated from one area</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">What to Do</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Create a tagging system</strong> for support tickets that might be phishing-related. This helps you track volume and identify patterns.</li>
            <li><strong className="text-landing-foreground">Develop a standard response template</strong> that acknowledges the customer&apos;s concern, confirms it wasn&apos;t from your business, and provides guidance on protecting themselves (changing passwords, monitoring bank statements, etc.).</li>
            <li><strong className="text-landing-foreground">Escalate internally immediately.</strong> A spike in phishing-related support tickets means there&apos;s an active campaign running. The sooner you investigate, the sooner you can initiate a takedown.</li>
            <li><strong className="text-landing-foreground">Document everything.</strong> Screenshots, forwarded emails, customer reports, and timestamps all become evidence if you need to file abuse reports or pursue legal action.</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Sign 3: Your DMARC Reports Show Authentication Failures</h2>
          <p>
            If DMARC is the smoke detector of email security, authentication failures in your DMARC reports are the smoke.
          </p>
          <p>DMARC generates two types of reports:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Aggregate reports (RUA):</strong> Daily XML summaries showing all authentication results for emails claiming to be from your domain. These reveal the volume and sources of spoofing attempts.</li>
            <li><strong className="text-landing-foreground">Forensic reports (RUF):</strong> Detailed reports on individual authentication failures, including message headers and sometimes content (though many providers limit these for privacy reasons).</li>
          </ul>
          <p>Here&apos;s what to look for in your aggregate reports:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Emails failing both SPF and DKIM</strong> from IP addresses you don&apos;t recognise — This is a strong indicator of active spoofing</li>
            <li><strong className="text-landing-foreground">High volumes of failures from specific regions or ISPs</strong> — Suggests a coordinated phishing campaign</li>
            <li><strong className="text-landing-foreground">Increasing failure rates over time</strong> — A campaign that&apos;s scaling up</li>
            <li><strong className="text-landing-foreground">Emails passing SPF but failing DKIM (or vice versa)</strong> from unknown sources — Could indicate partial spoofing or misconfiguration, but worth investigating</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">What to Do</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Review your DMARC reports weekly</strong> at minimum. Use a DMARC analysis tool to make the XML reports human-readable — raw DMARC data is notoriously hard to interpret.</li>
            <li><strong className="text-landing-foreground">Ensure your DMARC policy is set to <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=reject</code></strong> (or at least <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=quarantine</code>). A <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">p=none</code> policy monitors but doesn&apos;t protect — it&apos;s like having a security camera but no locks on the doors.</li>
            <li><strong className="text-landing-foreground">Investigate unknown senders.</strong> Cross-reference unfamiliar IP addresses against known email services and hosting providers. This can reveal where the phishing emails are being sent from.</li>
            <li><strong className="text-landing-foreground">Use the data for takedowns.</strong> DMARC reports provide concrete evidence of spoofing that you can include in abuse reports to hosting providers and registrars.</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Sign 4: You Discover Lookalike Domains Registered to Unknown Parties</h2>
          <p>
            This is the most direct evidence of brand targeting — and it often goes unnoticed until the damage is done.
          </p>
          <p>Lookalike domains come in several flavours:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Typosquats:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbarnd.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand.co</code> (when you own <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">.com</code>), <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">your-brand.com</code></li>
            <li><strong className="text-landing-foreground">Homoglyphs:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yоurbrand.com</code> (where the &quot;о&quot; is a Cyrillic character), <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbranḍ.com</code> (with a dot below the &quot;d&quot;)</li>
            <li><strong className="text-landing-foreground">Combosquats:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand-login.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand-secure.com</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrandsupport.com</code></li>
            <li><strong className="text-landing-foreground">Subdomain abuse:</strong> <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">yourbrand.malicious-host.com</code> — technically a subdomain of someone else&apos;s domain, but visually misleading, especially on mobile</li>
          </ul>
          <p>The danger escalates based on what the domain is being used for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Parked or for sale:</strong> Low immediate risk, but a domain that exists today can become a phishing site tomorrow</li>
            <li><strong className="text-landing-foreground">Redirecting to a competitor:</strong> Annoying and potentially trademark infringement, but not a direct phishing threat</li>
            <li><strong className="text-landing-foreground">Hosting a website that mimics yours:</strong> High risk — this is likely an active phishing or fraud operation</li>
            <li><strong className="text-landing-foreground">Configured with MX records (email):</strong> Very high risk — the domain is set up to send and receive email, a strong indicator of phishing or business email compromise</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">What to Do</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Run a domain similarity scan</strong> using brand monitoring tools. Look beyond obvious misspellings — modern attacks use increasingly subtle variations.</li>
            <li><strong className="text-landing-foreground">Check what the domain resolves to.</strong> Use tools like <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">dig</code>, <code className="text-primary-400 bg-landing-elevated px-1.5 py-0.5 rounded text-sm">nslookup</code>, or online DNS lookup services to see if the domain has A records (website), MX records (email), or nameserver configurations.</li>
            <li><strong className="text-landing-foreground">Screenshot everything.</strong> If the domain hosts a website mimicking yours, capture evidence before filing takedown requests. Attackers frequently take sites down and move to new domains when they detect investigation.</li>
            <li><strong className="text-landing-foreground">File abuse reports</strong> with the domain registrar and hosting provider. Include your trademark documentation, screenshots of the infringing content, and evidence that the domain is being used for phishing.</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Sign 5: Your Brand Appears in Phishing Databases and Threat Intelligence Feeds</h2>
          <p>
            Security researchers, anti-phishing organisations, and threat intelligence platforms maintain databases of known phishing campaigns. If your brand shows up in these databases, it means your brand has already been weaponised — and the security community has noticed.
          </p>
          <p>Key sources to check:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">PhishTank</strong> (phishtank.org) — A collaborative clearinghouse for phishing data. Search for your domain name to see if any reported phishing URLs reference your brand.</li>
            <li><strong className="text-landing-foreground">Google Safe Browsing</strong> (transparencyreport.google.com) — Check whether any domains associated with your brand have been flagged as dangerous.</li>
            <li><strong className="text-landing-foreground">URLhaus</strong> (urlhaus.abuse.ch) — A project tracking malicious URLs, including those used in phishing campaigns.</li>
            <li><strong className="text-landing-foreground">APWG (Anti-Phishing Working Group)</strong> — Publishes reports on phishing trends by industry and brand.</li>
            <li><strong className="text-landing-foreground">Social media monitoring</strong> — Search platforms for your brand name alongside terms like &quot;scam,&quot; &quot;fake,&quot; &quot;phishing,&quot; or &quot;fraud.&quot;</li>
          </ul>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">What to Do</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Set up alerts.</strong> Google Alerts for your brand name combined with terms like &quot;scam&quot; or &quot;phishing&quot; can provide early warning (though they&apos;re not comprehensive).</li>
            <li><strong className="text-landing-foreground">Monitor proactively, not reactively.</strong> By the time your brand appears in a phishing database, a campaign is already underway. The goal is to catch it as early as possible to limit exposure.</li>
            <li><strong className="text-landing-foreground">Notify your customers</strong> if you discover an active campaign. Transparency builds trust — customers appreciate being warned, and it reduces the likelihood they&apos;ll fall victim.</li>
            <li><strong className="text-landing-foreground">Report and contribute.</strong> When you discover phishing activity, report it to the relevant databases. This helps protect other potential victims and strengthens the collective defence.</li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Connecting the Dots: From Detection to Defence</h2>
          <p>
            Each of these five signs is valuable individually. Together, they paint a comprehensive picture of your brand&apos;s threat landscape. The pattern typically looks like this:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Lookalike domains get registered</strong> (Sign 4)</li>
            <li><strong className="text-landing-foreground">Phishing emails start going out</strong> (Signs 1 and 3)</li>
            <li><strong className="text-landing-foreground">Customers get scammed</strong> (Sign 2)</li>
            <li><strong className="text-landing-foreground">The campaign gets reported</strong> (Sign 5)</li>
          </ol>
          <p>
            The earlier you detect the chain, the less damage gets done. Catching a lookalike domain at registration — before it&apos;s used for phishing — is infinitely better than discovering an active campaign through customer complaints.
          </p>
          <p>
            But here&apos;s the challenge: monitoring all five of these signals manually is time-consuming, technically demanding, and easy to let slide when you&apos;re busy running a business. That&apos;s why automation matters.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">From Awareness to Action</h2>
          <p>
            Knowing the signs is the first step. Acting on them is what actually protects your brand and your customers.
          </p>
          <p>
            <strong className="text-landing-foreground">DoppelDown</strong> automates the detection side of this equation. We continuously monitor for lookalike domains, analyse new registrations for phishing risk, and alert you the moment something suspicious appears — so you can act before your customers are targeted, not after.
          </p>
          <p>
            No more manually searching WHOIS databases. No more waiting for customer complaints to discover a problem. No more hoping someone else catches the threat first.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start monitoring your brand with DoppelDown</Link> and find out if any of these warning signs are already flashing for your business.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Phishing attacks that exploit your brand can go undetected for weeks or months. DoppelDown brings visibility to the threats you can&apos;t see — so you can protect your customers and your reputation before the damage is done.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
