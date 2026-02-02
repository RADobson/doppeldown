import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import TrustSignals from '@/components/landing/TrustSignals'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import DemoPreview from '@/components/landing/DemoPreview'
import Cta from '@/components/landing/Cta'
import Footer from '@/components/landing/Footer'
import FAQ from '@/components/landing/FAQ'
import { SoftwareApplicationSchema, FAQSchema } from '@/components/structured-data'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-landing">
      <SoftwareApplicationSchema />
      <FAQSchema />
      <Hero />
      <Features />
      <TrustSignals />
      <HowItWorks />
      <Pricing />
      <DemoPreview />
      <FAQ />
      <Cta />
      <Footer />
    </div>
  )
}
