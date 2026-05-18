import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PostCard } from '@/components/community/Postcard';
import { EmptyState } from '@/components/EmptyState';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import type { PostSummary, ReactionType } from '@/types/post.types';
import type { CommunityRole } from '@/types/community.types';

interface PinnedAnnouncementsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pinnedPosts: PostSummary[];
  isLoading: boolean;
  currentUserId?: string;
  viewerRole?: CommunityRole;
  communityId?: string;
  channelId?: string;
  communitySlug?: string;
  onDelete: (postId: string) => void;
  onShare: (postId: string) => void;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onTogglePin: (postId: string) => void;
}

export function PinnedAnnouncementsDialog({
  isOpen,
  onOpenChange,
  pinnedPosts,
  isLoading,
  currentUserId,
  viewerRole,
  communityId,
  channelId,
  communitySlug,
  onDelete,
  onShare,
  onReact,
  onTogglePin,
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
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                viewerRole={viewerRole}
                communityId={communityId}
                channelId={channelId}
                communitySlug={communitySlug}
                onEdit={() => {}}
                onDelete={() => onDelete(post.id)}
                onShare={() => onShare(post.id)}
                onReact={(reactionType) => onReact(post.id, reactionType)}
                onTogglePin={() => onTogglePin(post.id)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
