import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  detail?: string
  variant?: 'default' | 'critical' | 'success' | 'warning'
}

export function MetricCard({ icon: Icon, label, value, detail, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400',
    critical: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={cn('p-2 rounded-lg', variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {detail && (
                <span className="text-xs text-muted-foreground">{detail}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
