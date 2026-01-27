'use client'

import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded",
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      {/* Header */}
      <Skeleton className="h-6 w-1/4" />

      {/* Content lines */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

export interface ListSkeletonProps {
  rows?: number
}

export function ListSkeleton({ rows = 5 }: ListSkeletonProps) {
  return (
    <div className="divide-y divide-border">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4">
          {/* Icon placeholder */}
          <Skeleton className="h-4 w-4 flex-shrink-0" />

          {/* Text placeholder */}
          <Skeleton className="h-4 flex-1" />

          {/* Status placeholder */}
          <Skeleton className="h-4 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="flex items-center gap-4">
      {/* Icon circle */}
      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />

      {/* Text area */}
      <div className="space-y-2">
        {/* Label */}
        <Skeleton className="h-4 w-20" />
        {/* Value */}
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
