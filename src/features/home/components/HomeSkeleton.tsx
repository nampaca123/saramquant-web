import { Skeleton } from '@/components/ui/Skeleton';

export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Benchmark cards */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-44 shrink-0 rounded-xl" />
        ))}
      </div>
      {/* Market overview */}
      <Skeleton className="h-28 rounded-xl" />
      {/* Portfolio */}
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}
