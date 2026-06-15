import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  useCreateCategory,
  useTaskCategories,
  useUpdateCategory,
} from '@/hooks/useCommunityTaskCategories';
import type { TaskCategory } from '@/types/community-task-category.types';
import { HugeiconsIcon } from '@hugeicons/react';
import { COLOR_ROWS, DEFAULT_ICON_COLOR } from '@/lib/constants';
import { categorySchema, type CategoryFormData } from '@/lib/validators';
import { hexToRgba } from '@/lib/community-task-utils';
import { CATEGORY_ICONS } from '@/lib/category-task-icons';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface CreateCategoryModalProps {
  communityId: string;
  editTarget?: TaskCategory;
  onSuccess?: () => void;
}

export function CreateCategoryModal({
  communityId,
  editTarget,
  onSuccess,
}: CreateCategoryModalProps) {
  const isEdit = !!editTarget;

  const [selectedIcon, setSelectedIcon] = useState<string>(
    editTarget?.iconKey ?? CATEGORY_ICONS[0].key
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    editTarget?.colorHex ?? DEFAULT_ICON_COLOR
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: editTarget?.name ?? '' },
  });

  const nameValue = useWatch({ control, name: 'name' });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory(communityId);
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(communityId);
  const { data: categories = [] } = useTaskCategories(communityId);
  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CategoryFormData) => {
    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === values.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('A category with this name already exists');
      return;
    }
    const payload = {
      name: values.name,
      colorHex: selectedColor,
      iconKey: selectedIcon,
    };

    if (isEdit && editTarget) {
      updateCategory(
        { categoryId: editTarget.id, data: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const activeIconDef = CATEGORY_ICONS.find((i) => i.key === selectedIcon) ?? CATEGORY_ICONS[0];

  return (
    <div
      className={cn(
        'w-full bg-white flex flex-col gap-4 sm:gap-6',
        'rounded-2xl px-4 pt-4 pb-6 sm:px-5 sm:pt-5 sm:pb-8',
        'sm:min-w-80 sm:py-6',
        'border border-neutral-200'
      )}
    >
      {/* Title */}
      <h2 className="text-[18px] sm:text-[20px] font-semibold shrink-0 text-primary">
        {isEdit ? 'Edit Category' : 'New Category'}
      </h2>

      {/* Category Name */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-xs sm:text-sm font-medium text-[#524B56] uppercase">
          Category Name
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="e.g. Daily Tasks…"
          className={cn(
            'h-11 sm:h-14 rounded-xl border px-3.5 text-sm text-[#261A2B] placeholder:text-[#938A97]',
            'focus:outline-none focus:border-2 focus:border-[#824892]/20',
            'transition-colors',
            errors.name ? 'border-red-400' : 'border-[#DBD5DE]'
          )}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      {/* Icon Picker */}
      <div className="flex flex-col gap-2 shrink-0">
        <label className="text-xs sm:text-sm font-medium text-[#524B56] uppercase">
          Icon selection
        </label>
        <div className="border border-[#DBD5DE] rounded-xl p-2.5 sm:p-3.5">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            {CATEGORY_ICONS.map((ic) => {
              const active = selectedIcon === ic.key;
              return (
                <button
                  key={ic.key}
                  type="button"
                  onClick={() => setSelectedIcon(ic.key)}
                  aria-label={ic.key}
                  aria-pressed={active}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center transition-all shrink-0 p-1 sm:p-1.5',
                    !active && 'hover:bg-[#F0EBF2]'
                  )}
                  style={
                    active
                      ? {
                          background: hexToRgba(selectedColor, 0.12),
                        }
                      : undefined
                  }
                >
                  <HugeiconsIcon
                    icon={ic.icon}
                    size={24}
                    color={active ? selectedColor : '#524B56'}
                    strokeWidth={1.5}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="flex flex-col gap-2 shrink-0">
        <label className="text-xs sm:text-sm font-medium text-[#524B56] uppercase">
          Color selection
        </label>
        <div className="border border-[#DBD5DE] rounded-xl p-2 sm:p-3.5 flex flex-col gap-2 sm:gap-2.5">
          {COLOR_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-2 sm:gap-2.5 justify-center">
              {row.map((color) => {
                const active = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    aria-pressed={active}
                    className="size-5 sm:size-6 rounded-[4px] sm:rounded-[5px] transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      outline: active ? `2px solid ${color}` : 'none',
                      outlineOffset: active ? '2px' : '0',
                      border: active ? '2px solid white' : '2px solid transparent',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="shrink-0 rounded-2xl bg-[#F8F5F9] px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-3">
        <div
          className="size-8 sm:size-8.5 rounded-[9px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: hexToRgba(selectedColor, 0.15) }}
        >
          <HugeiconsIcon
            icon={activeIconDef.icon}
            size={20}
            color={selectedColor}
            strokeWidth={1.5}
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-[#261A2B] truncate">
            {nameValue?.trim() || 'Category Name'}
          </span>
          <span className="text-xs text-[#938A97]">0 tasks</span>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
        className={cn(
          'w-full h-10 sm:h-11 rounded-xl text-sm sm:text-base text-white',
          isPending ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'
        )}
      >
        {isPending ? (isEdit ? 'Saving…' : 'Adding…') : isEdit ? 'Save Changes' : 'Add Category'}
      </Button>
    </div>
  );
}
