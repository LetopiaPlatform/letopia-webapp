import { useCallback, useState } from 'react';
import type { UseFormTrigger } from 'react-hook-form';
import type { Category } from '@/types/category.types';
import type { CreateCommunityFormData } from '@/lib/validators';

interface UseCategorySelectionProps {
  categories: Category[];
  trigger: UseFormTrigger<CreateCommunityFormData>;
}

interface UseCategorySelectionReturn {
  selectedMainCategory: Category | null;
  selectedSubCategory: Category | null;
  subCategories: Category[];
  handleMainCategorySelect: (cat: Category, onChange: (id: string) => void) => void;
  handleSubCategorySelect: (sub: Category, onChange: (id: string) => void) => void;
  resetCategorySelection: () => void;
}

export function useCategorySelection({
  categories,
  trigger,
}: UseCategorySelectionProps): UseCategorySelectionReturn {
  const [selectedMainCategory, setSelectedMainCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null);

  const effectiveMainCategory = selectedMainCategory ?? categories[0] ?? null;
  const subCategories = selectedMainCategory?.childCategories ?? [];

  const handleMainCategorySelect = useCallback(
    (cat: Category, onChange: (id: string) => void) => {
      setSelectedMainCategory(cat);
      setSelectedSubCategory(null);

      if (!cat.childCategories?.length) {
        onChange(cat.id);
        trigger('categoryId');
      } else {
        onChange('');
      }
    },
    [trigger]
  );

  const handleSubCategorySelect = useCallback(
    (sub: Category, onChange: (id: string) => void) => {
      setSelectedSubCategory(sub);
      onChange(sub.id);
      trigger('categoryId');
    },
    [trigger]
  );

  const resetCategorySelection = useCallback(() => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
  }, []);

  return {
    selectedMainCategory: effectiveMainCategory,
    selectedSubCategory,
    subCategories,
    handleMainCategorySelect,
    handleSubCategorySelect,
    resetCategorySelection,
  };
}
