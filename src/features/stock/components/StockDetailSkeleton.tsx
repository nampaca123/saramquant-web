import { Skeleton } from '@/components/ui/Skeleton';

export function StockDetailSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-zinc-100 bg-white p-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      {/* Price chart */}
      <Skeleton className="h-72 w-full rounded-xl" />
      {/* Benchmark */}
      <Skeleton className="h-56 w-full rounded-xl" />
      {/* Risk summary */}
      <Skeleton className="h-16 w-full rounded-xl" />
      {/* Risk cards */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      {/* Simulation collapsed */}
      <Skeleton className="h-12 w-full rounded-xl" />
      {/* AI section */}
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
