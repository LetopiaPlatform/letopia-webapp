import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createCommunitySchema, type CreateCommunityFormData } from '@/lib/validators';
import { Controller, useForm, useWatch, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Plus, Dot } from 'lucide-react';
import { useCoverImage } from '@/hooks/useCoverImage';
import { useRulesManagement } from '@/hooks/useRulesManagement';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { useCreateCommunityForm } from '@/hooks/useCreateCommunityForm';
import { useCategoriesList } from '@/hooks/useCategories';
import { useCategorySelection } from '@/hooks/useCategorySelection';
import { CategoryDropdownField } from './CategoryDropdown';
import { cn } from '@/lib/utils';
import { PRIVACY_OPTIONS } from '@/lib/constants';
import { useCallback, useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface CreateCommunityProps {
  isOpen: boolean;
  onClose: () => void;
}

function SafeImg({
  src,
  className,
  alt = '',
}: {
  src?: string | null;
  className?: string;
  alt?: string;
}) {
  if (!src) return null;
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

function FormField({
  children,
  error,
  className,
}: {
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn('col-span-2 space-y-2', className)}>
      <div className="rounded-xl bg-background px-4 py-3 border border-border/40 focus-within:ring-2 focus-within:ring-ring/50">
        {children}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function DescriptionLength({ control }: { control: Control<CreateCommunityFormData> }) {
  const value = useWatch({ control, name: 'description' });
  return <span className="ml-2 text-xs text-muted-foreground">{value?.length || 0}/2000</span>;
}

// Main component
type OpenDropdown = 'category' | 'subCategory' | 'privacy' | null;

export function CreateCommunityDialog({ isOpen, onClose }: CreateCommunityProps) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<CreateCommunityFormData>({
    resolver: zodResolver(createCommunitySchema),
    mode: 'onBlur',
    defaultValues: {
      categoryId: '',
      isPrivate: false,
      name: '',
      description: '',
      rules: [],
      coverImage: undefined,
    },
  });

  const rules = useWatch({ control, name: 'rules' });

  const {
    coverImageInputRef,
    uploadCoverImage,
    coverImagePreview,
    handleImageChange,
    clearCoverImage,
  } = useCoverImage({ setValue });

  const { newRule, setNewRule, addRule, editRule, removeRule } = useRulesManagement({
    rules,
    setValue,
    trigger,
  });

  const { confirmation, showConfirmation, closeConfirmation, navigateToCommunity } =
    useConfirmationDialog();

  const { onSubmit, isPending } = useCreateCommunityForm({
    reset,
    onSuccess: showConfirmation,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesList('community');
  const categories = categoriesData?.data || [];

  const {
    selectedMainCategory,
    selectedSubCategory,
    subCategories,
    handleMainCategorySelect,
    handleSubCategorySelect,
    resetCategorySelection,
  } = useCategorySelection({ categories, trigger });

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const toggleDropdown = (name: OpenDropdown) => (open: boolean) =>
    setOpenDropdown(open ? name : null);

  const handleDialogClose = useCallback(() => {
    reset();
    clearCoverImage();
    closeConfirmation();
    resetCategorySelection();
    onClose();
  }, [reset, clearCoverImage, closeConfirmation, resetCategorySelection, onClose]);

  // RENDER: CONFIRMATION DIALOG
  if (confirmation.show) {
    return (
      <ConfirmationDialog
        isOpen={confirmation.show}
        communityName={confirmation.communityName ?? ''}
        onNavigate={navigateToCommunity}
        onClose={handleDialogClose}
      />
    );
  }

  // RENDER: MAIN FORM
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}
    >
      <DialogContent className="bg-mauve-100">
        <DialogTitle className="sr-only">Create Community</DialogTitle>
        <DialogDescription className="sr-only">
          Fill in the details to create your new community
        </DialogDescription>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] scrollbar-hide">
          <form
            id="community-form"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 mt-8 p-1"
          >
            {/* ==================== CATEGORY + SUB-CATEGORY ==================== */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <>
                  {/* Main category */}
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <CategoryDropdownField
                      label="Choose a category"
                      selected={selectedMainCategory}
                      options={categories}
                      isLoading={categoriesLoading}
                      placeholder="Select category"
                      isOpen={openDropdown === 'category'}
                      onOpenChange={toggleDropdown('category')}
                      onSelect={(cat) => handleMainCategorySelect(cat, field.onChange)}
                    />
                  </div>

                  {/* Sub-category */}
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <CategoryDropdownField
                      label="Choose a sub-category"
                      selected={selectedSubCategory}
                      options={subCategories}
                      required={subCategories.length > 0}
                      placeholder={
                        subCategories.length === 0 ? 'No sub-categories' : 'Select sub-category'
                      }
                      isOpen={openDropdown === 'subCategory'}
                      onOpenChange={toggleDropdown('subCategory')}
                      onSelect={(sub) => handleSubCategorySelect(sub, field.onChange)}
                    />
                    {errors.categoryId && (
                      <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                    )}
                  </div>
                </>
              )}
            />

            {/* ==================== PRIVACY ==================== */}
            <FormField error={errors.isPrivate?.message}>
              <Controller
                name="isPrivate"
                control={control}
                render={({ field }) => {
                  const selected = PRIVACY_OPTIONS.find((p) => p.value === field.value);
                  return (
                    <DropdownMenu
                      open={openDropdown === 'privacy'}
                      onOpenChange={toggleDropdown('privacy')}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center w-full justify-between cursor-pointer"
                        >
                          <div>
                            <h4 className="text-muted-foreground text-sm font-normal capitalize">
                              community privacy
                            </h4>
                            <div className="flex items-center gap-2">
                              <SafeImg src={selected?.icon} className="size-4" />
                              <span className="font-medium text-sm capitalize">
                                {selected?.label || 'Public'}
                              </span>
                            </div>
                          </div>
                          <SafeImg
                            src="/icons/arrow.svg"
                            className={cn(
                              'size-5 transition-transform duration-200',
                              openDropdown === 'privacy' && 'rotate-180'
                            )}
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="min-w-50" align="start">
                        {PRIVACY_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={String(option.value)}
                            onSelect={() => {
                              field.onChange(option.value);
                              trigger('isPrivate');
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <SafeImg src={option.icon} className="size-4" />
                              {option.label}
                            </div>
                            {field.value === option.value && (
                              <Check className="size-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }}
              />
            </FormField>

            {/* ==================== NAME ==================== */}
            <FormField error={errors.name?.message}>
              <label className="text-muted-foreground text-sm font-medium">Name *</label>
              <Input
                placeholder="e.g., Data Science Community"
                className="border-0 shadow-none focus-visible:ring-0 p-0 mt-1 placeholder:text-sm placeholder:text-neutral-400"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
            </FormField>

            {/* ==================== DESCRIPTION ==================== */}
            <FormField error={errors.description?.message}>
              <label className="text-muted-foreground text-sm font-medium">
                Description * <DescriptionLength control={control} />
              </label>
              <textarea
                placeholder="e.g., A community for data science enthusiasts"
                className="w-full border-none shadow-none focus-visible:ring-0 focus:outline-0 p-0 resize-none min-h-20 mt-1 placeholder:text-sm placeholder:text-neutral-400"
                {...register('description')}
                aria-invalid={!!errors.description}
              />
            </FormField>

            {/* ==================== RULES ==================== */}
            <div className="col-span-2 space-y-4">
              <label className="text-muted-foreground text-sm font-medium">
                Rules{' '}
                <span className="text-xs text-muted-foreground">({rules?.length || 0}/20)</span>
              </label>

              <div className="flex gap-2 items-center">
                <Input
                  placeholder="e.g., Be respectful and professional in all interactions"
                  className="flex-1 bg-background rounded-lg border-0 px-4 py-6 focus-within:ring-2 focus-within:ring-ring/50 placeholder:text-sm placeholder:text-neutral-400"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRule.trim()) addRule();
                  }}
                />
                <button
                  type="button"
                  onClick={addRule}
                  disabled={!newRule.trim() || (rules && rules.length >= 20)}
                  className="flex items-center justify-center p-3 rounded-lg cursor-pointer bg-linear-to-b from-primary to-brand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                >
                  <SafeImg src="/icons/addIcon.svg" className="size-4" alt="Add rule" />
                </button>
              </div>

              {rules && rules.length > 0 && (
                <div className="space-y-2 bg-background rounded-lg p-4 border border-border/40">
                  <ul className="space-y-2">
                    {rules.map((rule, index) => (
                      <li key={index} className="flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-1 flex-1">
                          <Dot className="text-muted-foreground" />
                          <span className="text-md text-foreground">{rule}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => editRule(index)}
                            className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                            aria-label={`Edit rule ${index + 1}`}
                          >
                            <SafeImg src="/icons/pencil-edit.svg" className="size-5" alt="Edit" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRule(index)}
                            className="p-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            aria-label={`Remove rule ${index + 1}`}
                          >
                            <SafeImg src="/icons/delete.svg" className="size-5" alt="Delete" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ==================== COVER IMAGE ==================== */}
            <div className="col-span-2 space-y-2">
              <div
                className={cn(
                  'relative rounded-xl bg-background h-32 border overflow-hidden cursor-pointer',
                  errors.coverImage ? 'border-red-500' : 'border-border/40'
                )}
                onClick={() => !coverImagePreview && coverImageInputRef.current?.click()}
              >
                {!coverImagePreview ? (
                  <>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      {uploadCoverImage ? (
                        <>
                          <Loader2 className="size-6 animate-spin mb-2" />
                          <span className="text-sm">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <SafeImg src="/icons/image-add.svg" className="size-6 mb-2" />
                          <span className="text-sm">Click to upload a cover image</span>
                        </>
                      )}
                    </div>
                    <Input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                      aria-label="Upload cover image"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={coverImagePreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3">
                      <label className="cursor-pointer z-20 relative">
                        <SafeImg
                          src="/icons/arrow-reload-horizontal.svg"
                          className="size-5"
                          alt="Replace"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          aria-label="Replace cover image"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue('coverImage', undefined);
                          clearCoverImage();
                        }}
                        className="cursor-pointer z-20 relative"
                      >
                        <SafeImg src="/icons/delete.svg" className="size-5" alt="Delete" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {errors.coverImage && (
                <p className="text-sm text-red-500">{errors.coverImage.message}</p>
              )}
            </div>
          </form>
        </div>

        {/* ==================== DIALOG FOOTER ==================== */}
        <DialogFooter className="grid grid-cols-2 gap-4 p-1">
          <Button
            type="button"
            onClick={handleDialogClose}
            className="rounded-xl h-12 bg-neutral-300 text-gray-700 hover:bg-black/50 hover:text-white cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="community-form"
            aria-busy={isPending}
            className="flex items-center justify-center gap-2 rounded-xl h-12 bg-mauve-100 border-2 border-primary text-primary font-medium text-md cursor-pointer hover:bg-primary hover:text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
