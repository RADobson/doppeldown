export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-landing-elevated">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-landing-foreground text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { step: '1', title: 'Add your brand' },
            { step: '2', title: 'We find the impostors' },
            { step: '3', title: 'We help take them down' }
          ].map((item, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-primary-500 mb-2">{item.step}</div>
              <p className="text-landing-foreground font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
