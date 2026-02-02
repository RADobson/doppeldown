import Link from 'next/link'
import { Logo } from '@/components/Logo'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Terms of Service | DoppelDown',
  description: 'DoppelDown Terms of Service — Brand Protection Platform by Dobson Development Pty Ltd',
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown to HTML conversion for legal docs
  const html = content
    // Remove the first H1 (we render our own)
    .replace(/^# .+\n/, '')
    // Bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-4">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h3>')
    // H4
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-foreground mt-4 mb-2">$1</h4>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Paragraphs (lines that aren't already HTML)
    .replace(/^(?!<[hlu]|<li)(.+)$/gm, '<p class="mb-3 text-muted-foreground leading-relaxed">$1</p>')
    // Wrap consecutive li elements in ul
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="mb-4 space-y-1">$&</ul>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'legal', 'TERMS_OF_SERVICE.md')
  const content = fs.readFileSync(filePath, 'utf-8')

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Logo mode="dark" size="md" />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>
        <MarkdownContent content={content} />
      </main>
    </div>
  )
}
