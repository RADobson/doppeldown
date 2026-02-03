import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'Phishing Attack Statistics 2026: What SMBs Need to Know',
  description: 'The latest phishing attack statistics for 2026. Learn how often SMBs are targeted, the average cost of a phishing breach, emerging attack trends, and how to protect your small business.',
  keywords: [
    'phishing statistics 2026',
    'phishing attack statistics',
    'smb phishing attacks',
    'phishing cost small business',
    'phishing trends 2026',
    'brand phishing statistics',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog/phishing-attack-statistics-2026-what-smbs-need-to-know',
  },
  openGraph: {
    title: 'Phishing Attack Statistics 2026: What SMBs Need to Know',
    description: 'The latest phishing attack statistics for 2026. How often SMBs are targeted, the cost of breaches, and how to protect your business.',
    url: 'https://doppeldown.com/blog/phishing-attack-statistics-2026-what-smbs-need-to-know',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-02-03T00:00:00Z',
    authors: ['DoppelDown Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phishing Attack Statistics 2026: What SMBs Need to Know',
    description: 'The latest phishing attack statistics for 2026. How often SMBs are targeted, the cost of breaches, and how to protect your business.',
  },
}

function ArticleSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Phishing Attack Statistics 2026: What SMBs Need to Know',
    description: 'The latest phishing attack statistics for 2026. Learn how often SMBs are targeted, the average cost of a phishing breach, emerging attack trends, and how to protect your small business.',
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
      '@id': 'https://doppeldown.com/blog/phishing-attack-statistics-2026-what-smbs-need-to-know',
    },
    keywords: ['phishing statistics 2026', 'phishing attack statistics', 'smb phishing attacks', 'phishing cost small business', 'phishing trends 2026', 'brand phishing statistics'],
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
            Phishing Attack Statistics 2026: What SMBs Need to Know
          </h1>
          <p className="text-lg text-landing-muted">
            By DoppelDown Team
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-landing-muted leading-relaxed space-y-6">
          <p>
            Phishing remains the most common cyberattack vector in 2026 — and small to mid-sized businesses are bearing the brunt of it. While headlines focus on breaches at major corporations, the reality is that SMBs face a disproportionate share of phishing attacks relative to their resources. They&apos;re easier to target, slower to detect attacks, and less equipped to recover.
          </p>
          <p>
            Understanding the current landscape isn&apos;t just academic. The numbers tell a story about where the threats are, how they&apos;re evolving, and what your business needs to prioritise to stay protected. Here are the phishing statistics that matter most in 2026.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Scale of Phishing in 2026</h2>
          <p>
            Phishing isn&apos;t shrinking — it&apos;s accelerating. Here&apos;s where things stand:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">3.4 billion phishing emails</strong> are sent globally every day, according to Valimail&apos;s email authentication research. That&apos;s roughly 1.2% of all email traffic.</li>
            <li><strong className="text-landing-foreground">Phishing accounts for 36% of all data breaches</strong>, making it the single most common initial attack vector, per Verizon&apos;s Data Breach Investigations Report.</li>
            <li><strong className="text-landing-foreground">The number of unique phishing sites detected</strong> has grown 65% since 2023, driven by the availability of AI-powered phishing kits and automated domain registration tools.</li>
            <li><strong className="text-landing-foreground">Over 300,000 new phishing URLs</strong> are detected every month by Google Safe Browsing — and those are just the ones that get flagged.</li>
          </ul>
          <p>
            The sheer volume means that even businesses with solid email filters will see phishing attempts slip through. The question isn&apos;t whether your brand will be used in a phishing attack — it&apos;s when you&apos;ll find out about it.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">SMBs Are the Primary Target</h2>
          <p>
            There&apos;s a persistent misconception that phishing attacks predominantly target large enterprises. The data tells a different story:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">61% of SMBs experienced a phishing attack</strong> in the past 12 months, according to the Hiscox Cyber Readiness Report.</li>
            <li><strong className="text-landing-foreground">Businesses with fewer than 250 employees receive the highest rate of targeted phishing emails</strong> — 1 in every 323 emails, compared to 1 in 823 for larger organisations (Symantec).</li>
            <li><strong className="text-landing-foreground">46% of all cyberattacks target businesses with fewer than 1,000 employees</strong> (Verizon DBIR).</li>
            <li><strong className="text-landing-foreground">Only 14% of SMBs rate their ability to mitigate cyber threats as &quot;highly effective&quot;</strong> (Accenture).</li>
          </ul>
          <p>
            Why are SMBs targeted disproportionately? Three reasons: they hold valuable data (customer records, payment information, credentials), they typically lack dedicated security teams, and they&apos;re less likely to have the monitoring tools that would <Link href="/blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks" className="text-primary-400 hover:text-primary-300 underline">catch phishing attacks early</Link>.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">The Financial Impact</h2>
          <p>
            The cost of a successful phishing attack goes far beyond the immediate fraud. Here&apos;s what the numbers look like:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">The average cost of a phishing attack for an SMB is $120,000</strong> — encompassing direct financial loss, remediation, downtime, and customer churn (Proofpoint).</li>
            <li><strong className="text-landing-foreground">Business Email Compromise (BEC) attacks</strong> — a targeted form of phishing — caused $2.9 billion in reported losses in 2025 in the US alone (FBI IC3).</li>
            <li><strong className="text-landing-foreground">60% of small businesses that suffer a significant cyber attack go out of business within six months</strong> (National Cyber Security Alliance).</li>
            <li><strong className="text-landing-foreground">The average time to identify and contain a phishing breach is 295 days</strong> (IBM Cost of a Data Breach Report) — nearly 10 months of exposure before the problem is resolved.</li>
          </ul>
          <p>
            For context, <Link href="/blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it" className="text-primary-400 hover:text-primary-300 underline">the true cost of brand impersonation</Link> extends beyond direct financial loss to include customer trust erosion, legal liability, regulatory fines, and long-term reputation damage. The $120,000 average likely understates the real impact.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Brand Impersonation: The Growing Phishing Vector</h2>
          <p>
            An increasingly dominant phishing tactic in 2026 is brand impersonation — where attackers register <Link href="/blog/what-is-typosquatting-complete-guide-2026" className="text-primary-400 hover:text-primary-300 underline">lookalike domains</Link> and create convincing replicas of legitimate business communications.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Brand impersonation accounts for 51% of all phishing attacks</strong> — surpassing generic phishing for the first time (Cloudflare).</li>
            <li><strong className="text-landing-foreground">83% of phishing sites now use HTTPS</strong>, making the &quot;look for the padlock&quot; advice essentially useless (APWG).</li>
            <li><strong className="text-landing-foreground">The median time from domain registration to first phishing email is under 48 hours</strong> — attackers move fast once they&apos;ve secured a lookalike domain.</li>
            <li><strong className="text-landing-foreground">71% of brand impersonation domains use combosquatting</strong> (appending words like &quot;-login&quot;, &quot;-support&quot;, or &quot;-billing&quot; to a brand name), making them appear like legitimate service subdomains (Georgia Tech).</li>
          </ul>
          <p>
            This trend is particularly dangerous because the phishing happens entirely outside your infrastructure. The attacker registers a domain, hosts a fake site, and sends emails — all without touching your systems. Your first indication is usually a confused customer asking why they received a suspicious invoice from &quot;your company.&quot;
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">AI-Powered Phishing: The 2026 Accelerant</h2>
          <p>
            The emergence of generative AI has fundamentally changed the phishing landscape:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">AI-generated phishing emails have a 60% higher click-through rate</strong> than traditionally crafted ones (SlashNext) — they&apos;re grammatically flawless, contextually relevant, and harder to distinguish from legitimate communications.</li>
            <li><strong className="text-landing-foreground">The cost of launching a phishing campaign has dropped by approximately 95%</strong> since 2022, thanks to AI tools that automate email generation, website cloning, and even victim targeting.</li>
            <li><strong className="text-landing-foreground">AI-powered voice phishing (vishing)</strong> is emerging as a new threat, with tools capable of cloning a CEO&apos;s voice from publicly available recordings and using it in real-time calls.</li>
            <li><strong className="text-landing-foreground">Automated phishing-as-a-service platforms</strong> now offer complete attack infrastructure — domains, hosting, email templates, and credential harvesting — for as little as $50/month on dark web marketplaces.</li>
          </ul>
          <p>
            The democratisation of phishing tools means that attacks are no longer limited to sophisticated threat actors. Anyone with minimal technical skill can now launch convincing, targeted campaigns at scale.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Industry-Specific Phishing Trends</h2>
          <p>
            Not all industries face equal risk. Here&apos;s where phishing attacks concentrate in 2026:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Financial services:</strong> 27% of all phishing attacks target banks, fintech, and payment processors — the highest of any sector</li>
            <li><strong className="text-landing-foreground">E-commerce and retail:</strong> 19% — driven by fake order confirmations, delivery notifications, and payment pages</li>
            <li><strong className="text-landing-foreground">SaaS and technology:</strong> 16% — login page impersonation for credential harvesting is the primary vector</li>
            <li><strong className="text-landing-foreground">Healthcare:</strong> 12% — patient portal phishing and insurance fraud</li>
            <li><strong className="text-landing-foreground">Professional services:</strong> 9% — invoice fraud and client impersonation targeting law firms, accountancies, and consultancies</li>
          </ul>
          <p>
            If your business operates in any of these sectors, you&apos;re facing above-average phishing risk. But even businesses outside these categories are targeted — any brand with customers, partners, or an online presence is fair game.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">What These Numbers Mean for Your Business</h2>
          <p>
            The statistics paint a clear picture: phishing is a volume game, SMBs are in the crosshairs, and the attacks are getting cheaper, faster, and more convincing. Here&apos;s what that translates to in practical terms:
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">1. Email Filtering Isn&apos;t Enough</h3>
          <p>
            Modern email security catches most phishing — but &quot;most&quot; isn&apos;t good enough when billions of phishing emails are sent daily. Even a 99.9% filter rate means thousands of malicious emails get through. And brand impersonation phishing that targets your customers happens entirely outside your email infrastructure.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">2. You Need External Visibility</h3>
          <p>
            The biggest gap in most SMB security postures isn&apos;t their firewall or endpoint protection — it&apos;s visibility into what&apos;s happening outside their perimeter. Lookalike domains, fake websites, and impersonation emails all exist on infrastructure you don&apos;t control. You need <Link href="/blog/how-to-check-if-someone-registered-domain-similar-to-yours" className="text-primary-400 hover:text-primary-300 underline">tools that monitor the external domain landscape</Link> to catch these threats.
          </p>

          <h3 className="text-xl font-semibold text-landing-foreground mt-8 mb-3">3. Speed of Detection Determines Impact</h3>
          <p>
            With a median time of under 48 hours from domain registration to first phishing email, every hour of detection delay increases the number of potential victims. Automated monitoring that alerts you in real time can be the difference between catching a threat before it launches and discovering it after your customers have been defrauded.
          </p>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">How DoppelDown Helps SMBs Fight Back</h2>
          <p>
            <Link href="/" className="text-primary-400 hover:text-primary-300 underline">DoppelDown</Link> exists because the statistics above shouldn&apos;t be a death sentence for small businesses. Enterprise companies have dedicated brand protection teams and six-figure security budgets. SMBs deserve the same level of protection at a price they can actually afford.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-landing-foreground">Real-time domain monitoring</strong> that catches lookalike registrations before they&apos;re weaponised</li>
            <li><strong className="text-landing-foreground">Intelligent risk scoring</strong> that separates genuine threats from benign registrations, so you don&apos;t waste time on false alarms</li>
            <li><strong className="text-landing-foreground">Instant alerts</strong> that give you the head start needed to act before phishing campaigns reach your customers</li>
            <li><strong className="text-landing-foreground">Affordable pricing</strong> designed for SMBs — because brand protection shouldn&apos;t require an enterprise budget. See our <Link href="/pricing" className="text-primary-400 hover:text-primary-300 underline">pricing plans</Link></li>
          </ul>

          <h2 className="text-2xl font-bold text-landing-foreground mt-12 mb-4">Don&apos;t Become a Statistic</h2>
          <p>
            The numbers are stark, but they&apos;re not inevitable. The businesses that avoid becoming phishing statistics share one trait: they don&apos;t wait to be attacked. They invest in visibility, monitor their brand presence across the domain landscape, and catch threats before they reach customers.
          </p>
          <p>
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 underline">Start monitoring your brand with DoppelDown today</Link> — it&apos;s free, requires no credit card, and takes less than five minutes. Because in 2026, the cost of not knowing is too high.
          </p>

          <div className="border-t border-landing-border mt-12 pt-8">
            <p className="text-landing-muted italic">
              Phishing attacks exploit the gap between brand trust and brand monitoring. DoppelDown closes that gap — giving SMBs the same domain visibility that enterprises take for granted, at a fraction of the cost.
            </p>
          </div>
        </div>
      </article>
    </BlogLayout>
  )
}
