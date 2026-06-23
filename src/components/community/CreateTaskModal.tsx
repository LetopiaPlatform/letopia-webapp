import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  ChevronRight,
  CheckCheck,
  CheckListIcon,
} from '@hugeicons/core-free-icons';
import { cn, formatDeadline } from '@/lib/utils';
import { useCreateTask, useUpdateTask } from '@/hooks/useCommunityTasks';
import { useTaskCategories } from '@/hooks/useCommunityTaskCategories';
import type { CommunityTask } from '@/types/community-task.types';
import { taskSchema } from '@/lib/validators';
import type { TaskFormValues } from '@/lib/validators';
import { hexToRgba } from '@/lib/community-task-utils';
import { CATEGORY_ICONS } from '@/lib/category-task-icons';
import { Button } from '../ui/button';

interface CreateTaskModalProps {
  communityId: string;
  editTarget?: CommunityTask;
  onSuccess?: () => void;
}

export function CreateTaskModal({ communityId, editTarget, onSuccess }: CreateTaskModalProps) {
  const isEdit = !!editTarget;
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    editTarget?.categoryId ?? ''
  );
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useTaskCategories(communityId);
  const { mutate: createTask, isPending: isCreating } = useCreateTask(communityId);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(communityId);
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: editTarget?.title ?? '',
      description: editTarget?.description ?? '',
      deadline: editTarget?.deadline
        ? new Date(editTarget.deadline).toISOString().slice(0, 10)
        : '',
      categoryId: '',
    },
  });

  const deadlineValue = useWatch({ control, name: 'deadline' });

  useEffect(() => {
    if (!categoryDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryDropdownOpen]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedIconDef = selectedCategory
    ? (CATEGORY_ICONS.find((i) => i.key === selectedCategory.iconKey) ?? CATEGORY_ICONS[0])
    : null;

  const { ref: deadlineRef, ...deadlineRest } = register('deadline');

  const onSubmit = (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
      categoryId: selectedCategoryId || undefined,
    };

    if (isEdit && editTarget) {
      updateTask(
        { taskId: editTarget.id, data: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createTask(payload, {
        onSuccess: () => {
          reset();
          setSelectedCategoryId('');
          onSuccess?.();
        },
      });
    }
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col gap-5 sm:gap-7',
        'bg-[#F6F5F6] border border-natural-200',
        'rounded-2xl px-4 py-6 sm:px-5 sm:py-8',
        'sm:min-w-80 sm:py-6'
      )}
    >
      {/* Title */}
      <h2 className="text-[18px] sm:text-[20px] font-semibold shrink-0 text-primary">
        {isEdit ? 'Edit Task' : 'New Task'}
      </h2>

      {/* ── Task Title ── */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-[13px] sm:text-[15px] text-[#524B56] capitalize font-semibold">
          add task title
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="Task title..."
          className={cn(
            'h-11 sm:h-14 rounded-xl border bg-white px-3.5 text-sm text-[#261A2B]',
            'placeholder:text-neutral-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#824892]/30 focus:border-0',
            errors.title ? 'border-red-400' : 'border-natural-200'
          )}
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
      </div>

      {/* ── Category ── */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-[13px] sm:text-[15px] text-[#524B56] capitalize font-semibold">
          select task category
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setCategoryDropdownOpen((prev) => !prev)}
            className="w-full h-11 sm:h-14 rounded-xl bg-white flex items-center gap-3 px-3.5 border border-natural-200"
          >
            {selectedCategory && selectedIconDef ? (
              <div
                className="size-8 sm:size-8.5 rounded-[9px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: hexToRgba(selectedCategory.colorHex, 0.15) }}
              >
                <HugeiconsIcon
                  icon={selectedIconDef.icon}
                  size={20}
                  color={selectedCategory.colorHex}
                  strokeWidth={2}
                />
              </div>
            ) : (
              <div className="size-8 sm:size-8.5 rounded-[9px] bg-[#FFE4F2] flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckListIcon} size={18} color="#F478B8" strokeWidth={2} />
              </div>
            )}
            <span
              className={cn(
                'flex-1 text-sm text-left',
                selectedCategory ? 'font-medium text-[#261A2B]' : 'text-neutral-400'
              )}
            >
              {selectedCategory ? selectedCategory.name : 'Add category'}
            </span>
            <HugeiconsIcon
              icon={ChevronRight}
              size={22}
              strokeWidth={2}
              className={cn(
                'shrink-0 transition-transform duration-300 text-muted-foreground',
                categoryDropdownOpen && 'rotate-90'
              )}
            />
          </button>

          {categoryDropdownOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white border border-natural-200 rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-48 sm:max-h-52 overflow-y-auto py-2 sm:py-3 flex flex-col gap-1 scrollbar-thin">
                {/* No category option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId('');
                    setCategoryDropdownOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 sm:py-2.5 mx-1.5 rounded-xl text-left transition-colors',
                    !selectedCategoryId ? 'bg-[#F8F5F9]' : 'hover:bg-[#F8F5F9]'
                  )}
                >
                  <div className="size-8 sm:size-8.5 rounded-[9px] bg-[#F0EBF2] flex items-center justify-center shrink-0">
                    <HugeiconsIcon
                      icon={CheckListIcon}
                      size={18}
                      color={'#938A97'}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-sm text-[#524B56] flex-1">No category</span>
                  {!selectedCategoryId && (
                    <HugeiconsIcon
                      icon={CheckCheck}
                      size={20}
                      color={'#938A97'}
                      strokeWidth={1.5}
                    />
                  )}
                </button>

                {categories.map((cat) => {
                  const iconDef =
                    CATEGORY_ICONS.find((i) => i.key === cat.iconKey) ?? CATEGORY_ICONS[0];
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 sm:py-2.5 mx-1.5 rounded-xl text-left transition-colors',
                        isSelected ? 'bg-[#F8F5F9]' : 'hover:bg-[#F8F5F9]'
                      )}
                    >
                      <div
                        className="size-8 sm:size-8.5 rounded-[9px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: hexToRgba(cat.colorHex, 0.15) }}
                      >
                        <HugeiconsIcon
                          icon={iconDef.icon}
                          size={18}
                          color={cat.colorHex}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-[#261A2B] truncate">
                          {cat.name}
                        </span>
                      </div>
                      {isSelected && (
                        <HugeiconsIcon
                          icon={CheckCheck}
                          size={20}
                          color={cat.colorHex}
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Deadline ── */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-[13px] sm:text-[15px] text-[#524B56] capitalize font-semibold">
          set deadline
        </label>

        <input
          type="date"
          {...deadlineRest}
          ref={(el) => {
            deadlineRef(el);
            dateInputRef.current = el;
          }}
          className="sr-only "
          min={new Date().toISOString().slice(0, 10)}
        />

        <div className="h-11 sm:h-14 rounded-xl border border-neutral-200 bg-white flex items-center justify-between px-3.5">
          <span className={cn('text-sm', deadlineValue ? 'text-[#261A2B]' : 'text-neutral-400')}>
            {deadlineValue ? formatDeadline(deadlineValue) : 'No deadline set'}
          </span>
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker?.()}
            className="p-1.5 rounded-lg hover:bg-[#F0EBF2] transition-colors"
            aria-label="Open date picker"
          >
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={22}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          </button>
        </div>

        {deadlineValue && (
          <button
            type="button"
            onClick={() => setValue('deadline', '')}
            className="text-xs text-[#938A97] hover:text-[#524B56] self-start transition-colors"
          >
            Clear deadline
          </button>
        )}
      </div>

      {/* ── Description ── */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="text-[13px] sm:text-[15px] text-[#524B56] capitalize font-semibold">
          description (optional)
        </label>
        <textarea
          {...register('description')}
          placeholder="Add task description…"
          rows={4}
          className={cn(
            'rounded-xl border bg-white p-3 text-sm text-[#261A2B] max-h-28 sm:max-h-32 scrollbar-hide',
            'placeholder:text-neutral-400 placeholder:text-sm resize-none transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#824892]/30 focus:border-0',
            errors.description ? 'border-red-400' : 'border-neutral-200'
          )}
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description.message}</span>
        )}
      </div>

      {/* ── Submit ── */}
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
        className={cn(
          'w-full h-10 sm:h-11 rounded-xl text-sm sm:text-base text-white',
          isPending ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'
        )}
      >
        {isPending ? (isEdit ? 'Saving…' : 'Adding…') : isEdit ? 'Save Changes' : 'Add Task'}
      </Button>
    </div>
  );
}
