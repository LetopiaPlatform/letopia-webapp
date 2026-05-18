import { useUpdatePost } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGES,
  MAX_TAGS,
  type CreatePostFormValues,
  createPostSchema,
} from '@/lib/validators';
import type { PostSummary } from '@/types/post.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Dot, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState, useEffect, startTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { POST_GUIDELINES } from '@/lib/constants';

interface UpdatePostDialogProps {
  post: PostSummary | null;
  communityId: string;
  channelId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ImagePreview {
  file?: File;
  url: string;
  id: string;
  isExisting?: boolean;
}

const postGuidelines = POST_GUIDELINES;

export const UpdatePostDialog = ({
  post,
  communityId,
  channelId,
  isOpen,
  onClose,
}: UpdatePostDialogProps) => {
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updatePost, isPending } = useUpdatePost(communityId, channelId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      postType: 'Discussion',
      images: [],
      tags: [],
    },
  });

  const tags = useWatch({ control, name: 'tags' }) ?? [];
  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const contentValue = useWatch({ control, name: 'content' }) ?? '';
  const isAnnouncement = post?.postType === 'Announcement';

  useEffect(() => {
    if (isOpen && post) {
      const existingImages: ImagePreview[] = (post.imageUrls ?? []).map((url) => ({
        url,
        id: url,
        isExisting: true,
      }));

      startTransition(() => {
        reset({
          title: post.title,
          content: post.content,
          tags: post.tags,
          images: [],
          postType: post.postType,
        });
        setImagePreviews(existingImages);
      });
    }
  }, [isOpen, post, reset]);

  function handleClose() {
    imagePreviews.forEach((preview) => {
      if (!preview.isExisting) {
        URL.revokeObjectURL(preview.url);
      }
    });
    reset();
    setTagInput('');
    setTagError('');
    setImagePreviews([]);
    onClose();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;

    const slotsLeft = MAX_IMAGES - imagePreviews.length;
    const accepted = incoming.slice(0, slotsLeft);

    const newPreviews = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImagePreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      const files = updated.filter((p) => p.file).map((p) => p.file!);
      setValue('images', files, { shouldValidate: true, shouldDirty: true });
      return updated;
    });

    e.target.value = '';
  }

  function removeImage(id: string) {
    setImagePreviews((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target && !target.isExisting) {
        URL.revokeObjectURL(target.url);
      }

      const updated = prev.filter((p) => p.id !== id);
      const files = updated.filter((p) => p.file).map((p) => p.file!);
      setValue('images', files, { shouldValidate: true, shouldDirty: true });
      return updated;
    });
  }

  function addTag() {
    const trimmed = tagInput.trim();
    setTagError('');

    if (!trimmed) return;

    if (tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      setTagError('Tag already added.');
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setTagError(`Maximum ${MAX_TAGS} tags allowed.`);
      return;
    }

    setValue('tags', [...tags, trimmed], { shouldValidate: true });
    setTagInput('');
  }

  function removeTag(tag: string) {
    setValue(
      'tags',
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  function onSubmit(data: CreatePostFormValues) {
    if (!post) {
      toast.error('Post data not loaded');
      return;
    }

    const removedExistingImages = (post.imageUrls ?? []).filter(
      (url) => !imagePreviews.some((p) => p.url === url)
    );

    updatePost(
      {
        postId: post.id,
        data: {
          title: data.title,
          content: data.content,
          addImages: data.images,
          removeImageUrls: removedExistingImages,
          tags: data.tags,
        },
      },
      { onSuccess: handleClose }
    );
  }

  if (!post) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="bg-mauve-100">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Post</DialogTitle>
          <div className="absolute right-8 -top-2 z-50">
            <button
              type="button"
              title="Guidelines"
              onClick={() => setShowGuidelines((prev) => !prev)}
              className="transition-transform hover:scale-105"
            >
              <AlertCircle className="size-8 text-primary stroke-1" />
            </button>

            {showGuidelines && (
              <div className="absolute top-10 -right-10 md:right-0 w-80 max-w-[90vw] rounded-2xl border border-border bg-white shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold capitalize mb-3">Posting Guidelines</h3>

                <ul className="space-y-3">
                  {postGuidelines?.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Dot className="text-destructive shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {guideline}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogDescription className="sr-only">Edit your post details</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] scrollbar-hide">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <input
                {...register('title')}
                placeholder="Post Title *"
                maxLength={200}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-muted-foreground outline-none transition-colors',
                  'focus:border-2 focus:border-primary/20',
                  errors.title ? 'border-red-400' : 'border-border'
                )}
              />
              <div className="flex justify-between mt-1 px-1">
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                <p className="text-xs text-gray-400 ml-auto">{titleValue.length}/200</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <textarea
                {...register('content')}
                placeholder="Description *"
                rows={4}
                maxLength={10000}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-muted-foreground outline-none resize-none transition-colors',
                  'focus:border-2 focus:border-primary/20',
                  errors.content ? 'border-red-400' : 'border-border'
                )}
              />
              <div className="flex justify-between mt-1 px-1">
                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                <p className="text-xs text-gray-400 ml-auto">{contentValue.length}/10,000</p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {imagePreviews.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'w-full rounded-xl border bg-gray-50 py-6 flex flex-col items-center gap-2 text-sm text-gray-500 transition-colors',
                    '',
                    errors.images ? 'border-red-400' : 'border-border'
                  )}
                >
                  <img src="/icons/image-add.svg" className="size-6" />
                  <span>Click to upload images</span>
                </button>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview) => (
                      <div
                        key={preview.id}
                        className="relative group aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={preview.url}
                          alt={`Preview ${preview.id}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(preview.id)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              {errors.images && (
                <p className="text-xs text-red-500 mt-1 px-1">{errors.images.message}</p>
              )}
            </div>

            {/* Tags */}
            {!isAnnouncement && (
              <div>
                <div className="flex items-center gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError('');
                    }}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tags..."
                    maxLength={30}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder-muted-foreground outline-none transition-colors',
                      'focus:border-2 focus:border-primary/20',
                      tagError ? 'border-red-400' : 'border-border'
                    )}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= MAX_TAGS}
                    className="flex items-center justify-center size-10 rounded-xl shadow-md cursor-pointer bg-linear-to-b from-primary to-brand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  >
                    <Plus className="size-5 stroke-3 text-white" />
                  </button>
                </div>

                {tagError ? (
                  <p className="text-xs text-red-500 mt-1 px-1">{tagError}</p>
                ) : (
                  <p className="text-[14px] text-primary mt-1 px-1">
                    Add tags to help others find your post
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary bg-violet-50 text-primary text-xs font-normal"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-[#EBE6ED] text-[#656565] font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="shrink-0 py-3 px-2 md:flex-1 rounded-xl border-2 border-primary text-primary font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span className="w-4 h-4 border-2 border-primary/60 border-t-transparent rounded-xl animate-spin" />
                ) : (
                  <>
                    <Plus className="size-4 stroke-3" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
