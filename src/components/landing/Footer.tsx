import { Logo } from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="bg-landing text-landing-muted py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center text-landing-foreground mb-4">
              <Logo mode="light" size="md" />
            </div>
            <p className="text-sm">
              Take down brand impostors. Automated phishing & fake account detection.
            </p>
          </div>
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-landing-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-landing-foreground">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-landing-foreground">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-landing-foreground">About</a></li>
              <li><a href="#" className="hover:text-landing-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-landing-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-landing-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-landing-foreground">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-landing-border mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} DoppelDown. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
