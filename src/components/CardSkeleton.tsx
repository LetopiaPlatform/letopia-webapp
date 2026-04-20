import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CommunitySkeletonProps {
  count?: number;
  className?: string;
}

export const CommunitySkeleton = ({ count = 12, className }: CommunitySkeletonProps) => {
  return (
    <div
      role="status"
      aria-label="Loading communities"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10 xl:gap-12',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full rounded-2xl overflow-hidden bg-muted">
          <Skeleton className="h-25 w-full rounded-none" />

          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading communities...</span>
    </div>
  );
};
