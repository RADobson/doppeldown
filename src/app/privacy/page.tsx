import Link from 'next/link'
import { Logo } from '@/components/Logo'
import fs from 'fs'
import path from 'path'

export const metadata = {
  title: 'Privacy Policy | DoppelDown',
  description: 'DoppelDown Privacy Policy — How we handle your data. Dobson Development Pty Ltd.',
}

function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^# .+\n/, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-foreground mt-4 mb-2">$1</h4>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(?!<[hlu]|<li)(.+)$/gm, '<p class="mb-3 text-muted-foreground leading-relaxed">$1</p>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="mb-4 space-y-1">$&</ul>')
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'legal', 'PRIVACY_POLICY.md')
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>
        <MarkdownContent content={content} />
      </main>
    </div>
  )
}
