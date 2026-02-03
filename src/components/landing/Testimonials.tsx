import { Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      quote: "DoppelDown caught a phishing site impersonating our brand within hours of it going live. The AI scoring helped us prioritize which threats to tackle first.",
      author: "Sarah Chen",
      role: "Head of Security",
      company: "TechFlow Inc.",
      initials: "SC"
    },
    {
      quote: "We were quoted $50K by a traditional brand protection vendor. DoppelDown gives us 90% of the same functionality for under $100/month. Incredible value.",
      author: "Marcus Johnson",
      role: "CTO",
      company: "NexusLabs",
      initials: "MJ"
    },
    {
      quote: "The automated takedown reports saved us countless hours. What used to take our team days now takes minutes. Game changer for our security posture.",
      author: "Emily Rodriguez",
      role: "Brand Manager",
      company: "DataSync",
      initials: "ER"
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-landing-elevated/30 border-y border-landing-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Trusted by security-conscious teams
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className="group relative p-6 rounded-2xl bg-landing border border-landing-border hover:border-primary-500/30 transition-all"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-primary-600/20" />
              </div>

              {/* Content */}
              <div className="relative">
                <p className="text-landing-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-semibold text-sm">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-medium text-landing-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-landing-muted">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
