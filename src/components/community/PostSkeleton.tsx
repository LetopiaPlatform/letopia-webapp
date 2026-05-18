import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface PostSkeletonProps {
  variant?: 'discussion' | 'announcement';
  imageCount?: 0 | 1 | 2 | 3 | 4;
  showTags?: boolean;
  className?: string;
}

export const PostSkeleton = ({
  variant = 'discussion',
  imageCount = 0,
  showTags = false,
  className,
}: PostSkeletonProps) => {
  const isAnnouncement = variant === 'announcement';

  return (
    <article
      className={cn(
        'px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 flex flex-col gap-3 sm:gap-4 rounded-2xl border-2 border-border min-w-xs max-w-4xl',
        className
      )}
      aria-busy="true"
      aria-label="Loading post"
    >
      <div className="flex items-center justify-between">
        {isAnnouncement ? (
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full mx-0.5" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="size-8 sm:size-10 rounded-full shrink-0" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Skeleton className="h-4 w-28 sm:w-32 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
        )}

        <Skeleton className="size-4 sm:size-5 rounded-md shrink-0" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 sm:h-7 w-full rounded-md" />
        <Skeleton className="h-6 sm:h-7 w-3/4 rounded-md" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>

      {imageCount > 0 && (
        <div
          className={cn(
            'overflow-hidden rounded-2xl',
            imageCount === 1 && 'w-full h-40 sm:h-48 md:h-56',
            imageCount >= 2 && 'grid grid-cols-2 gap-1 h-44 sm:h-52 md:h-60'
          )}
        >
          {Array.from({ length: Math.min(imageCount, 4) }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                'rounded-2xl',
                imageCount === 1 && 'w-full h-full',
                imageCount === 2 && 'h-full',
                imageCount === 3 && i === 0 && 'row-span-2 h-full',
                imageCount === 3 && i > 0 && 'h-[calc(100%-2px)]',
                imageCount >= 4 && 'h-full'
              )}
            />
          ))}
        </div>
      )}

      {!isAnnouncement && showTags && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Skeleton className="h-5 sm:h-6 w-14 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
          <Skeleton className="h-5 sm:h-6 w-16 rounded-full" />
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:py-2 sm:px-3">
            <Skeleton className="size-4 sm:size-5 rounded-md shrink-0" />
            <Skeleton className="h-4 w-6 rounded-md" />
          </div>

          {!isAnnouncement && (
            <div className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:py-2 sm:px-3">
              <Skeleton className="size-4 sm:size-5 rounded-md shrink-0" />
              <Skeleton className="h-4 w-6 rounded-md" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2">
          <Skeleton className="size-4 sm:size-5 rounded-md" />
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
      </div>
    </article>
  );
};
