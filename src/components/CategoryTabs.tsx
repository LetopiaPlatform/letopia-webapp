import type { Category } from '@/types/category.types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  count?: number;
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  isLoading?: boolean;
  className?: string;
}

export function CategoryTabs({
  count = 8,
  categories,
  selected,
  onSelect,
  isLoading,
  className,
}: CategoryTabsProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex gap-1 overflow-x-auto px-3 md:px-8 border-b pb-px scrollbar-hide',
          className
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-1 py-3 px-4 shrink-0 animate-pulse">
            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
            <Skeleton
              className="h-5 w-25 rounded-full"
              style={{ width: `${[56, 72, 64, 80, 60, 68, 76, 52][i % 8]}px` }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-3 md:px-8 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`py-3 px-4 text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
          selected === null
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        <img src="/icons/all-topics.svg" alt="" className="w-4.5 h-4.5 shrink-0 object-contain" />
        All Topics
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={`py-3 px-4 text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
            selected === category.slug
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {category.iconUrl && (
            <img
              src={category.iconUrl}
              alt=""
              className="w-4.5 h-4.5 shrink-0 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {category.name}
        </button>
      ))}
    </div>
  );
}
