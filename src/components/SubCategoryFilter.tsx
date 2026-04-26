import type { Category } from '@/types/category.types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SubCategoryFilterProps {
  subCategories: Category[];
  selected: string[];
  onToggle: (slug: string) => void;
  onClearAll: () => void;
}

export function SubCategoryFilter({
  subCategories,
  selected,
  onToggle,
  onClearAll,
}: SubCategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 overflow-x-auto px-3 md:px-8 pb-px scrollbar-hide md:flex-wrap">
        {subCategories.map((sub) => {
          const isSelected = selected.includes(sub.slug);
          return (
            <button
              key={sub.id}
              onClick={() => onToggle(sub.slug)}
              className={cn(
                'px-4 py-1.5 shrink-0 text-sm rounded-full border transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground border-none'
                  : 'bg-background text-foreground border-border hover:bg-accent'
              )}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-3 px-3 md:px-8">
          <div className="border-t border-border mb-3" />
          <button
            onClick={onClearAll}
            className={cn(
              'px-4 py-1.5 shrink-0 flex items-center gap-2 text-sm rounded-full border transition-colors',
              'bg-transparent text-destructive border border-destructive ',
              'hover:cursor-pointer'
            )}
          >
            <X className="size-4" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
