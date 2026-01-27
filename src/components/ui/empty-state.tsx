'use client'

import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  variant?: 'default' | 'success'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className={cn(
        "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
        variant === 'success' ? 'bg-green-100' : 'bg-muted'
      )}>
        <Icon className={cn(
          "h-8 w-8",
          variant === 'success' ? 'text-green-600' : 'text-muted-foreground'
        )} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
