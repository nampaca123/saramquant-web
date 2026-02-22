import { Skeleton } from '@/components/ui/Skeleton';

export function PortfolioSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      {/* Metrics */}
      <div className="flex gap-3 md:grid md:grid-cols-4 md:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full min-w-[140px] rounded-xl" />
        ))}
      </div>
      {/* Holdings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
      {/* Charts */}
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    </div>
  );
}
