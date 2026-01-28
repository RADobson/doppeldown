'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  trigger: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Collapsible({ trigger, defaultOpen = false, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors bg-card"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="text-lg font-semibold text-card-foreground">{trigger}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-card">
          {children}
        </div>
      )}
    </div>
  )
}
