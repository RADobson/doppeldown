import { cn } from '@/lib/utils'

type LogoProps = {
  mode?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
} as const

const modeMap = {
  dark: 'text-foreground',
  light: 'text-landing-foreground',
} as const

export function Logo({ mode = 'dark', size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-bold tracking-tight',
        sizeMap[size],
        modeMap[mode],
        className
      )}
    >
      doppel<span className="text-primary-600">_</span>down
    </span>
  )
}
