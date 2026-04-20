import type { Category } from '@/types/category.types';
import { cn } from '@/lib/utils';

interface SubCategoryFilterProps {
  subCategories: Category[];
  selected: string[];
  onToggle: (slug: string) => void;
}

export function SubCategoryFilter({ subCategories, selected, onToggle }: SubCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 px-3 md:px-8">
      {subCategories.map((sub) => {
        const isSelected = selected.includes(sub.slug);
        return (
          <button
            key={sub.id}
            onClick={() => onToggle(sub.slug)}
            className={cn(
              'px-4 py-1.5 text-sm rounded-full border transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-accent'
            )}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
