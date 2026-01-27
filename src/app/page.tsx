import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import TrustSignals from '@/components/landing/TrustSignals'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import Cta from '@/components/landing/Cta'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <TrustSignals />
      <HowItWorks />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  )
}
