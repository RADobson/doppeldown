import Link from 'next/link'

export default function Cta() {
  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-3">
          Stop letting impostors profit from your brand
        </h2>
        <p className="text-primary-100 mb-6 max-w-xl mx-auto">
          Most brand protection tools cost $15,000+/year and require a sales call to start. 
          DoppelDown gives you real results in 5 minutes — for free.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-card text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-accent transition text-lg"
        >
          Start Free — No Credit Card
        </Link>
      </div>
    </section>
  )
}
