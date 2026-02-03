import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'API', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: 'mailto:support@doppeldown.com' },
    ],
    compare: [
      { name: 'vs BrandShield', href: '/compare/brandshield' },
      { name: 'vs Red Points', href: '/compare/red-points' },
      { name: 'vs PhishLabs', href: '/compare/phishlabs' },
      { name: 'vs ZeroFox', href: '/compare/zerofox' },
      { name: 'vs Bolster', href: '/compare/bolster' },
      { name: 'vs Allure Security', href: '/compare/allure-security' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '#' },
    ],
  }

  return (
    <footer className="bg-landing-elevated border-t border-landing-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Logo mode="light" size="md" />
            </div>
            <p className="text-landing-muted text-sm mb-6 max-w-xs">
              AI-powered brand protection for SMBs. Detect typosquats, phishing sites, and social media impostors in minutes.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-landing-muted hover:text-landing-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-landing-muted hover:text-landing-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-landing-muted hover:text-landing-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-landing-muted hover:text-landing-foreground text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-landing-muted hover:text-landing-foreground text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare Links */}
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4 text-sm">Compare</h4>
            <ul className="space-y-3">
              {footerLinks.compare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-landing-muted hover:text-landing-foreground text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-landing-foreground font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-landing-muted hover:text-landing-foreground text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-landing-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-landing-muted text-sm">
            &copy; {new Date().getFullYear()} Dobson Development Pty Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-landing-muted text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
