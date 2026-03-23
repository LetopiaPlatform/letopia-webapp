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
      <div className={cn('flex gap-3 overflow-x-auto px-3 md:px-8 border-b pb-px', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full my-2 shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-3 md:px-8 border-b">
      <button
        onClick={() => onSelect(null)}
        className={`py-3 px-4 text-sm whitespace-nowrap border-b-2 transition-colors ${
          selected === null
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        Discover
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
          {category.iconUrl ? (
            <img
              src={category.iconUrl}
              alt=""
              className="size-4 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <img
              src="/icons/category-icon.svg"
              alt=""
              className="size-4 object-contain rotate-15"
            />
          )}
          {category.name}
        </button>
      ))}
    </div>
  );
}
