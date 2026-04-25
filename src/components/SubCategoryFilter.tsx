import type { Category } from '@/types/category.types';
import { cn } from '@/lib/utils';

interface SubCategoryFilterProps {
  subCategories: Category[];
  selected: string[];
  onToggle: (slug: string) => void;
}

export function SubCategoryFilter({ subCategories, selected, onToggle }: SubCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-6 border-b border-[#E5E7EB]">
      {subCategories.map((sub) => {
        const isSelected = selected.includes(sub.slug);
        return (
          <button
            key={sub.id}
            onClick={() => onToggle(sub.slug)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-full border transition-colors cursor-pointer',
              isSelected
                ? 'border-[#824892] text-[#824892] bg-transparent'
                : 'border-[#494949] text-[#494949] bg-transparent hover:bg-accent/50'
            )}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
