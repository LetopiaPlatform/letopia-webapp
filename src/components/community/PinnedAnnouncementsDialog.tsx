import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import type { PostSummary } from '@/types/post.types';
import { PinnedAnnouncementCard } from './PinnedAnnouncementCard';

interface PinnedAnnouncementsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pinnedPosts: PostSummary[];
  isLoading: boolean;
  onPostClick: (postId: string) => void;
}

export function PinnedAnnouncementsDialog({
  isOpen,
  onOpenChange,
  pinnedPosts,
  isLoading,
  onPostClick,
}: PinnedAnnouncementsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mauve-100 max-w-2xl">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Pinned Announcements
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] scrollbar-hide flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : pinnedPosts.length === 0 ? (
            <EmptyState
              title="No pinned announcements"
              description="There are no pinned announcements yet."
            />
          ) : (
            pinnedPosts.map((post) => (
              <PinnedAnnouncementCard
                key={post.id}
                post={post}
                onClick={() => onPostClick(post.id)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
