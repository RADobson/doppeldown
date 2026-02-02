export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DoppelDown',
    url: 'https://doppeldown.com',
    description: 'AI-powered brand protection for SMBs. Detect phishing, typosquatting, and brand impersonation.',
    foundingDate: '2026',
    founders: [
      {
        '@type': 'Person',
        name: 'Richard Dobson',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://doppeldown.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DoppelDown',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    url: 'https://doppeldown.com',
    description: 'Automated brand protection platform that detects fake domains, phishing sites, and social media impostors. AI-powered threat scoring with results in minutes.',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free',
        description: '1 brand, 25 domains, 1 social account, 1 manual scan/week',
      },
      {
        '@type': 'Offer',
        price: '49',
        priceCurrency: 'USD',
        name: 'Starter',
        description: '3 brands, 100 domains, 3 social accounts, daily scans',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '49',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
      },
      {
        '@type': 'Offer',
        price: '99',
        priceCurrency: 'USD',
        name: 'Pro',
        description: '10 brands, 500 domains, 6 social accounts, scans every 6 hours',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '99',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
      },
      {
        '@type': 'Offer',
        price: '249',
        priceCurrency: 'USD',
        name: 'Enterprise',
        description: 'Unlimited brands, 2500 domains, 8 social accounts, hourly scans, NRD monitoring',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '249',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
      },
    ],
    aggregateRating: undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DoppelDown',
    url: 'https://doppeldown.com',
    description: 'AI-powered brand protection that doesn\'t cost $15K/year',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://doppeldown.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema() {
  const faqs = [
    {
      question: 'How much does brand protection cost?',
      answer: 'DoppelDown starts at $0/month with a free tier that includes 1 brand and 25 domain monitors. Paid plans start at $49/month. Traditional brand protection services charge $15,000 to $250,000+ per year.',
    },
    {
      question: 'What is typosquatting and how does DoppelDown detect it?',
      answer: 'Typosquatting is when attackers register domains similar to your brand (e.g., g00gle.com instead of google.com) to trick your customers. DoppelDown automatically generates and monitors thousands of potential typosquat variations of your domain using AI-powered algorithms.',
    },
    {
      question: 'How quickly can DoppelDown detect threats?',
      answer: 'DoppelDown can detect new domain threats within minutes of scanning. Depending on your plan, scans run from once weekly (Free) to hourly (Enterprise). New domain registration (NRD) monitoring runs daily.',
    },
    {
      question: 'Do I need technical skills to use DoppelDown?',
      answer: 'No. DoppelDown is designed for business owners and marketing teams, not just security professionals. Add your brand, and the AI handles detection, scoring, and evidence collection automatically.',
    },
    {
      question: 'How does DoppelDown compare to BrandShield or PhishLabs?',
      answer: 'DoppelDown provides similar detection capabilities at a fraction of the cost. While BrandShield and PhishLabs charge $15,000-$250,000+/year and require enterprise contracts, DoppelDown starts free and scales to $249/month for enterprise features.',
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
