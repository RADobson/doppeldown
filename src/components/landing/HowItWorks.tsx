export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-landing-elevated">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-landing-foreground text-center mb-3">
          Up and Running in 5 Minutes
        </h2>
        <p className="text-landing-muted text-center mb-12">
          No sales calls. No onboarding meetings. No waiting.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { step: '1', title: 'Add your brand', desc: 'Enter your domain name and upload your logo' },
            { step: '2', title: 'We scan for threats', desc: 'AI checks 500+ domain variations, web, and social media' },
            { step: '3', title: 'Act on what matters', desc: 'Get scored threats and evidence packages for takedowns' }
          ].map((item, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-primary-500 mb-2">{item.step}</div>
              <p className="text-landing-foreground font-medium mb-1">{item.title}</p>
              <p className="text-landing-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
