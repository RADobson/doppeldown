import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-landing flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-landing-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-landing-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry — your brand is still safe with us.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-landing-elevated border border-landing-border text-landing-foreground rounded-lg hover:bg-landing transition font-medium"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}
