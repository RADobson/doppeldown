'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'How much does brand protection cost?',
    answer:
      'DoppelDown starts at $0/month with a free tier that includes 1 brand and 25 domain monitors. Paid plans start at $49/month. Traditional brand protection services charge $15,000 to $250,000+ per year — we believe every business deserves protection, not just enterprises.',
  },
  {
    question: 'What is typosquatting and how does DoppelDown detect it?',
    answer:
      'Typosquatting is when attackers register domains similar to your brand (e.g., g00gle.com instead of google.com) to trick your customers. DoppelDown automatically generates and monitors thousands of potential typosquat variations of your domain using AI-powered algorithms, checking for active phishing pages and suspicious content.',
  },
  {
    question: 'How quickly can DoppelDown detect threats?',
    answer:
      'DoppelDown can detect new domain threats within minutes of scanning. Depending on your plan, scans run from once weekly (Free) to hourly (Enterprise). New domain registration (NRD) monitoring runs daily to catch threats as soon as they appear.',
  },
  {
    question: 'Do I need technical skills to use DoppelDown?',
    answer:
      'Not at all. DoppelDown is designed for business owners, marketing teams, and brand managers — not just security professionals. Add your brand and domain, and the AI handles detection, threat scoring, and evidence collection automatically.',
  },
  {
    question: 'How does DoppelDown compare to BrandShield or PhishLabs?',
    answer:
      'DoppelDown provides similar detection capabilities at a fraction of the cost. While BrandShield, PhishLabs, and Red Points charge $15,000–$250,000+/year and require enterprise contracts, DoppelDown starts free and scales to $249/month for enterprise features. Same protection, 98% less cost.',
  },
  {
    question: 'What happens when a threat is detected?',
    answer:
      'When DoppelDown detects a suspicious domain or social media account, it scores the threat using AI, collects evidence (screenshots, DNS records, WHOIS data), and provides you with everything you need to take action — whether that\'s a takedown request to the registrar or a report to law enforcement.',
  },
  {
    question: 'Can I try DoppelDown before paying?',
    answer:
      'Yes! Our Free tier is available forever with no credit card required. You can monitor 1 brand with 25 domain watches and 1 manual scan per week. Paid plans also include a 14-day free trial.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 bg-landing">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-landing-foreground text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-landing-muted text-center mb-12">
          Everything you need to know about protecting your brand with DoppelDown.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-landing-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-landing-elevated transition-colors"
              >
                <span className="font-medium text-landing-foreground pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-landing-muted shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-landing-muted text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
