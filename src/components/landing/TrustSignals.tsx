import { Lock, Shield } from 'lucide-react'

export default function TrustSignals() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          <div className="flex items-center text-gray-500">
            <Lock className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">256-bit SSL</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">SOC 2 Type II</span>
          </div>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-lg italic text-gray-700 mb-4">
            "DoppelDown helped us identify 23 phishing sites targeting our brand in the first month."
          </blockquote>
          <p className="text-gray-600">
            <span className="font-semibold">Sarah Chen</span>, Security Lead at TechCorp
          </p>
        </div>
      </div>
    </section>
  )
}
