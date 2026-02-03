import type { Metadata } from 'next'
import Link from 'next/link'
import BlogLayout from '@/components/blog/BlogLayout'

export const metadata: Metadata = {
  title: 'Blog - Brand Protection Tips & Insights',
  description: 'Expert insights on brand protection, phishing prevention, domain monitoring, and defending your business from online impersonation. Practical guides for SMBs.',
  keywords: [
    'brand protection blog',
    'phishing prevention tips',
    'domain monitoring guide',
    'brand impersonation prevention',
    'cybersecurity for small business',
  ],
  alternates: {
    canonical: 'https://doppeldown.com/blog',
  },
  openGraph: {
    title: 'Blog - Brand Protection Tips & Insights | DoppelDown',
    description: 'Expert insights on brand protection, phishing prevention, and defending your business from online impersonation.',
    url: 'https://doppeldown.com/blog',
    siteName: 'DoppelDown',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Brand Protection Tips & Insights | DoppelDown',
    description: 'Expert insights on brand protection, phishing prevention, and defending your business from online impersonation.',
  },
}

const posts = [
  {
    title: 'How to Check if a Website is Legitimate: A Complete Guide',
    slug: 'how-to-check-if-website-is-legitimate-complete-guide',
    date: '2026-02-03',
    category: 'Cybersecurity',
    excerpt: 'Learn how to check if a website is legitimate with our step-by-step guide. Discover how to spot fake websites, verify SSL certificates, check WHOIS data, and identify red flags before you share personal information.',
  },
  {
    title: 'What is Typosquatting? Examples and How to Protect Your Brand',
    slug: 'typosquatting-examples-protect-brand',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Learn what typosquatting is with real examples like amaz0n.com and gooogle.com. Discover how attackers profit from domain squatting, the legal aspects, and practical protection strategies for your business.',
  },
  {
    title: 'The True Cost of Brand Impersonation: Statistics and Case Studies (2026)',
    slug: 'brand-impersonation-statistics-case-studies-2026',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Discover brand impersonation statistics for 2026. Learn the true cost of phishing attacks, including financial losses, reputation damage, and customer trust erosion. See real case studies and calculate the ROI of brand protection.',
  },
  {
    title: 'What to Do When Someone Impersonates Your Business Online',
    slug: 'what-to-do-when-someone-impersonates-your-business-online',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Found someone impersonating your brand online? Here is your emergency response playbook — assess the threat, document evidence, file takedown reports, protect your customers, and set up prevention to stop it happening again.',
  },
  {
    title: 'DMARC, SPF, and DKIM Explained: Email Authentication for Small Businesses',
    slug: 'dmarc-spf-dkim-explained-email-authentication-small-business',
    date: '2026-02-03',
    category: 'Email Security',
    excerpt: 'Email spoofing lets attackers send emails that look like they come from your domain. DMARC, SPF, and DKIM stop that — here is how they work, a plain-English explanation, and a step-by-step setup guide for small businesses.',
  },
  {
    title: 'How to Report a Phishing Website: Step-by-Step Guide (2026)',
    slug: 'how-to-report-phishing-website-step-by-step-guide',
    date: '2026-02-03',
    category: 'Phishing Prevention',
    excerpt: 'Found a fake website impersonating your business? Here is exactly how to report it to Google Safe Browsing, hosting providers, domain registrars, and law enforcement — and get it taken down fast.',
  },
  {
    title: 'How to Monitor Your Brand Online: A Guide for Small Businesses',
    slug: 'how-to-monitor-your-brand-online-guide-for-small-businesses',
    date: '2026-02-03',
    category: 'Brand Monitoring',
    excerpt: 'Learn how to set up effective online brand monitoring for your small business. Step-by-step guide covering the 5 pillars of brand monitoring: domain monitoring, social media scanning, website clone detection, search result monitoring, and dark web monitoring.',
  },
  {
    title: 'Free vs Paid Brand Protection: What\'s the Real Difference?',
    slug: 'free-vs-paid-brand-protection-whats-the-difference',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'An honest comparison of free and paid brand protection tools at every price point. Learn what Google Alerts misses, what $49/month gets you, and when enterprise solutions make sense.',
  },
  {
    title: 'How Cybercriminals Clone Websites: What Business Owners Need to Know',
    slug: 'how-cybercriminals-clone-websites-what-businesses-need-to-know',
    date: '2026-02-03',
    category: 'Cybersecurity',
    excerpt: 'Creating a pixel-perfect copy of any website takes less than 60 seconds. Learn how website cloning attacks work, why small businesses are prime targets, and how to detect and prevent these attacks.',
  },
  {
    title: 'Phishing Attack Statistics 2026: What SMBs Need to Know',
    slug: 'phishing-attack-statistics-2026-what-smbs-need-to-know',
    date: '2026-02-03',
    category: 'Phishing Prevention',
    excerpt: 'The latest phishing attack statistics for 2026. Learn how often SMBs are targeted, the average cost of a phishing breach, emerging AI-powered attack trends, and how to protect your small business.',
  },
  {
    title: 'What is Domain Squatting and How to Protect Your Brand',
    slug: 'what-is-domain-squatting-how-to-protect-your-brand',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Domain squatting (cybersquatting) is the practice of registering domains containing trademarked brand names. Learn the six types, your legal remedies, and practical strategies to protect your business in 2026.',
  },
  {
    title: 'How to Check if Someone Registered a Domain Similar to Yours',
    slug: 'how-to-check-if-someone-registered-domain-similar-to-yours',
    date: '2026-02-03',
    category: 'Domain Security',
    excerpt: 'Someone may have registered a domain that looks almost identical to yours. Learn five methods to find lookalike domains — from manual WHOIS lookups to automated monitoring — and protect your brand.',
  },
  {
    title: 'What is Typosquatting? The Complete Guide for Business Owners (2026)',
    slug: 'what-is-typosquatting-complete-guide-2026',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Typosquatting is one of the oldest tricks in the domain fraud playbook — and in 2026 it\'s more dangerous than ever. Learn the five types of typosquatting attacks, real-world examples, and how to protect your business.',
  },
  {
    title: 'Brand Protection for Small Business: A Practical Guide',
    slug: 'brand-protection-for-small-business-practical-guide',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Small businesses are now the primary target for brand impersonation attacks. This step-by-step guide covers affordable strategies to monitor your brand, prevent impersonation, and protect your business online.',
  },
  {
    title: 'How to Protect Your Brand from Domain Squatting and Phishing in 2026',
    slug: 'how-to-protect-your-brand-from-domain-squatting-and-phishing-2026',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Domain squatting and phishing have evolved from fringe nuisances into mainstream threats. This guide walks you through practical, actionable strategies to protect your brand — without needing an enterprise security budget.',
  },
  {
    title: '5 Signs Your Brand Is Being Targeted by Phishing Attacks',
    slug: '5-signs-your-brand-is-being-targeted-by-phishing-attacks',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Brand-targeted phishing often happens entirely outside your infrastructure. The fraudulent emails, fake websites, and spoofed accounts all exist on someone else\'s servers. Here are five warning signs to watch for.',
  },
  {
    title: 'The True Cost of Brand Impersonation: Why SMBs Can\'t Afford to Ignore It',
    slug: 'true-cost-of-brand-impersonation-why-smbs-cant-ignore-it',
    date: '2026-02-03',
    category: 'Brand Protection',
    excerpt: 'Brand impersonation isn\'t just an enterprise problem. SMBs often pay a steeper price — relative to their size — when attackers hijack their identity. Let\'s break down the true cost.',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogIndexPage() {
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-landing-foreground mb-4">
            Brand Protection Blog
          </h1>
          <p className="text-lg text-landing-muted max-w-2xl mx-auto">
            Expert insights, practical guides, and the latest strategies to protect your brand from phishing, domain squatting, and online impersonation.
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-landing-elevated border border-landing-border rounded-xl p-6 sm:p-8 hover:border-primary-600/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-primary-400 bg-primary-600/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <time className="text-sm text-landing-muted" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-landing-foreground mb-3 hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-landing-muted mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors"
              >
                Read more
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}
