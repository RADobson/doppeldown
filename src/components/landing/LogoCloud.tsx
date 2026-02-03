export default function LogoCloud() {
  const logos = [
    { name: 'TechFlow', initial: 'T' },
    { name: 'NexusLabs', initial: 'N' },
    { name: 'DataSync', initial: 'D' },
    { name: 'CloudPeak', initial: 'C' },
    { name: 'SecureStack', initial: 'S' },
    { name: 'BrandShield', initial: 'B' },
  ]

  return (
    <section className="py-12 border-y border-landing-border/50 bg-landing-elevated/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-landing-muted text-sm font-medium mb-8 uppercase tracking-wider">
          Trusted by security-conscious brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 text-landing-muted/60 hover:text-landing-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-landing-elevated border border-landing-border flex items-center justify-center text-sm font-bold">
                {logo.initial}
              </div>
              <span className="font-semibold text-lg">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
