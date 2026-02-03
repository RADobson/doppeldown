'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

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
      "When DoppelDown detects a suspicious domain or social media account, it scores the threat using AI, collects evidence (screenshots, DNS records, WHOIS data), and provides you with everything you need to take action — whether that's a takedown request to the registrar or a report to law enforcement.",
  },
  {
    question: 'Can I try DoppelDown before paying?',
    answer:
      'Yes! Our Free tier is available forever with no credit card required. You can monitor 1 brand with 25 domain watches and 1 manual scan per week. Paid plans also include a 14-day free trial.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 lg:py-28 bg-landing-elevated/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-landing-muted">
            Everything you need to know about protecting your brand.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 ${
                openIndex === i 
                  ? 'bg-landing border-primary-500/30 shadow-lg shadow-primary-600/5' 
                  : 'bg-landing border-landing-border hover:border-landing-border/80'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-landing-foreground pr-8 text-lg">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-landing-elevated border border-landing-border flex items-center justify-center transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180 bg-primary-600/10 border-primary-500/30' : ''
                }`}>
                  <ChevronDown className="w-4 h-4 text-landing-muted" />
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-200 ${
                openIndex === i ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-6 pb-6 text-landing-muted leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <p className="text-landing-muted mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:support@doppeldown.com"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Contact our team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
