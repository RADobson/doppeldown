import Link from 'next/link'

export default function Cta() {
  return (
    <section className="py-12 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to protect your brand?
        </h2>
        <Link
          href="/auth/signup"
          className="inline-block bg-card text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-accent transition"
        >
          Start Free
        </Link>
      </div>
    </section>
  )
}
