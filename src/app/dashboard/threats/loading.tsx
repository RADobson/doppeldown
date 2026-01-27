import { Card, CardContent } from '@/components/ui/card'
import { Skeleton, ListSkeleton } from '@/components/ui/skeleton'

export default function ThreatsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters card skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats List skeleton */}
      <Card>
        <CardContent className="pt-6">
          <ListSkeleton rows={6} />
        </CardContent>
      </Card>
    </div>
  )
}
