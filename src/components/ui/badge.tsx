import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-foreground',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low'
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const colors = {
    critical: 'bg-red-100 text-red-800 border border-red-200',
    high: 'bg-orange-100 text-orange-800 border border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border border-blue-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full uppercase',
        colors[severity],
        className
      )}
    >
      {severity}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    new: 'bg-purple-100 text-purple-800',
    investigating: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-orange-100 text-orange-800',
    takedown_requested: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    false_positive: 'bg-muted text-foreground',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-muted text-foreground',
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  const labels: Record<string, string> = {
    new: 'New',
    investigating: 'Investigating',
    confirmed: 'Confirmed',
    takedown_requested: 'Takedown Requested',
    resolved: 'Resolved',
    false_positive: 'False Positive',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full capitalize',
        colors[status] || 'bg-muted text-foreground',
        className
      )}
    >
      {labels[status] || status.replace(/_/g, ' ')}
    </span>
  )
}
