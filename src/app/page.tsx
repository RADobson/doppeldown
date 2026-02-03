import Hero from '@/components/landing/Hero'
import LogoCloud from '@/components/landing/LogoCloud'
import WhyNow from '@/components/landing/WhyNow'
import Features from '@/components/landing/Features'
import TrustSignals from '@/components/landing/TrustSignals'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import DemoPreview from '@/components/landing/DemoPreview'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import Newsletter from '@/components/landing/Newsletter'
import Cta from '@/components/landing/Cta'
import Footer from '@/components/landing/Footer'
import { SoftwareApplicationSchema, FAQSchema } from '@/components/structured-data'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-landing">
      <SoftwareApplicationSchema />
      <FAQSchema />
      <Hero />
      <LogoCloud />
      <WhyNow />
      <Features />
      <TrustSignals />
      <HowItWorks />
      <DemoPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Newsletter />
      <Cta />
      <Footer />
    </div>
  )
}
