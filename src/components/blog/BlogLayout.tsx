import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-landing">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-landing/90 backdrop-blur-md z-50 border-b border-landing-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo mode="light" size="md" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-landing-muted hover:text-landing-foreground">Features</Link>
              <Link href="/#pricing" className="text-landing-muted hover:text-landing-foreground">Pricing</Link>
              <Link href="/blog" className="text-landing-muted hover:text-landing-foreground">Blog</Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/auth/login" className="text-landing-muted hover:text-landing-foreground text-sm sm:text-base">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-16">
        {children}
      </main>

      {/* Footer CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-3">
            Protect your brand today
          </h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Don&apos;t wait until someone impersonates your brand. DoppelDown detects threats in minutes — start free, no credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-card text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-accent transition text-lg"
          >
            Start Free — No Credit Card
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-landing text-landing-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center text-landing-foreground mb-4">
                <Logo mode="light" size="md" />
              </div>
              <p className="text-sm">
                Take down brand impostors. Automated phishing &amp; fake account detection.
              </p>
            </div>
            <div>
              <h4 className="text-landing-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features" className="hover:text-landing-foreground">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-landing-foreground">Pricing</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-landing-foreground">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-landing-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-landing-foreground">Blog</Link></li>
                <li><a href="#" className="hover:text-landing-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-landing-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-landing-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-landing-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-landing-border mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Dobson Development Pty Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
