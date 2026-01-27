import Link from 'next/link'

export default function Cta() {
  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Start Protecting Your Brand Today
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Join hundreds of companies using DoppelDown to take down brand impostors
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition"
        >
          Start Your Free 14-Day Trial
        </Link>
      </div>
    </section>
  )
}
