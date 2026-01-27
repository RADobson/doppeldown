export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How DoppelDown Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get protected in minutes with our simple 4-step process
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Add Your Brand',
              description: 'Enter your brand name, domain, and any keywords you want to monitor'
            },
            {
              step: '2',
              title: 'Automated Scanning',
              description: 'Our system generates domain variations and scans the web for threats'
            },
            {
              step: '3',
              title: 'Review Threats',
              description: 'View detected threats with severity ratings and evidence collected'
            },
            {
              step: '4',
              title: 'Take Action',
              description: 'Generate takedown reports and submit to registrars or agencies'
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-primary-100 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              {i < 3 && (
                <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2 text-primary-200">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
