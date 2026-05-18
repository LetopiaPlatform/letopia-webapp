import { useOutletContext, useNavigate } from 'react-router-dom';
import { useChannelPosts, usePinnedPosts } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import type { CommunityDetail } from '@/types/community.types';
import { CommunityStats } from '../../components/community/CommunityStats';
import { Button } from '../../components/ui/button';
import { Pin, Plus } from 'lucide-react';
import { PostCard } from '../../components/community/Postcard';
import { EmptyState } from '@/components/EmptyState';
import { GradientContainer } from '@/components/Gradientcontainer';
import { PanelCard } from '@/components/PanelCard';
import { useCallback, useState, useMemo } from 'react';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { PinnedAnnouncementsDialog } from '@/components/community/PinnedAnnouncementsDialog';
import { useCurrentUser } from '@/hooks/useUser';
import type { ReactionType, PostSummary } from '@/types/post.types';
import { useJoinCommunity } from '@/hooks/useCommunities';
import { JoinToAccessDialog } from '@/components/community/JoinToAccessDialog';
import { SharePostDialog } from '@/components/community/SharePostDialog';

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const context = useOutletContext<{ community: CommunityDetail } | undefined>();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPinnedDialogOpen, setIsPinnedDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSummary | null>(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    postId: string;
  }>({
    isOpen: false,
    postId: '',
  });

  const handleCreateAnnouncement = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const community = context?.community;
  const announcementsChannel = community?.channels?.find(
    (channel) => channel.name.toLowerCase() === 'announcements' || channel.isDefault
  );
  const channelId = announcementsChannel?.id ?? '';

  const { data, isLoading, error } = useChannelPosts(community?.id ?? '', channelId);
  const { data: pinnedData, isLoading: pinnedLoading } = usePinnedPosts(
    community?.id ?? '',
    channelId
  );

  const isMember = community?.isMember;

  const { mutate: joinCommunity, isPending: joinPending } = useJoinCommunity();
  const { deletePost, addReaction, togglePin } = usePostActions(community?.id ?? '', channelId);

  const handleJoin = () => {
    const id = community?.id;
    if (!id) return;

    joinCommunity(id, {
      onSuccess: () => {
        setShowJoinDialog(false);
      },
    });
  };

  const handleResourcesClick = () => {
    if (isMember) {
      navigate('../resources');
      return;
    }
    setShowJoinDialog(true);
  };

  const handleDeletePost = useCallback((postId: string) => {
    setDeleteConfirmDialog({ isOpen: true, postId });
  }, []);

  const confirmDelete = useCallback(() => {
    deletePost(deleteConfirmDialog.postId);
    setDeleteConfirmDialog({ isOpen: false, postId: '' });
  }, [deletePost, deleteConfirmDialog.postId]);

  const handleReactToPost = useCallback(
    (postId: string, reactionType: ReactionType) => {
      addReaction({ postId, reactionType });
    },
    [addReaction]
  );

  const pinnedPosts = useMemo(
    () => (Array.isArray(pinnedData?.data) ? pinnedData.data : []),
    [pinnedData]
  );
  const hasPinned = pinnedPosts.length > 0;

  const posts = useMemo(() => {
    const items = Array.isArray(data?.data?.items) ? data.data.items : [];
    const pinnedNotInFeed = pinnedPosts.filter(
      (pinned) => !items.some((item) => item.id === pinned.id)
    );
    const allPosts = [...items, ...pinnedNotInFeed];
    return allPosts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, pinnedPosts]);

  const { data: currentUserData } = useCurrentUser();
  const currentUserId = currentUserData?.data?.id;
  const viewerRole = community?.userRole ?? 'Member';

  const handleSharePost = useCallback(
    (postId?: string) => {
      if (!postId) return;
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setShareDialogOpen(true);
      }
    },
    [posts]
  );

  const handleTogglePin = useCallback(
    (postId: string) => {
      const post = [...pinnedPosts, ...posts].find((p) => p.id === postId);
      if (post) {
        togglePin({ postId, isPinned: post.isPinned });
      }
    },
    [pinnedPosts, posts, togglePin]
  );

  if (!community) {
    return (
      <EmptyState title="Community not found" description="Unable to load community information." />
    );
  }

  return (
    <div className="flex flex-col gap-4 min-w-full">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1 md:gap-2 text-base md:text-lg font-medium xl:text-2xl md:font-bold text-[#261A2B]">
          <img src="/icons/announcements.svg" className="size-5" alt="Announcements" />
          Announcements
        </h2>
        <div className="flex items-center gap-3">
          {hasPinned && (
            <button onClick={() => setIsPinnedDialogOpen(true)} className="cursor-pointer">
              <Pin className="text-primary fill-primary size-6" />
            </button>
          )}

          {community.userRole === 'Owner' && (
            <Button
              variant="default"
              className="has-[>svg]:px-2.5 sm:has-[>svg]:px-6 py-4 md:py-6 rounded-xl text-white text-base font-normal cursor-pointer"
              onClick={handleCreateAnnouncement}
              aria-label="Create new announcement"
            >
              <Plus className="size-4 xl:size-5 stroke-3" aria-hidden="true" />
              <span className="capitalize tracking-wide hidden sm:inline">Create Announcement</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        {/* Posts */}
        <div className="w-full flex flex-col items-center gap-4 h-screen overflow-y-auto scrollbar-hide pb-8">
          {error && (
            <div className="w-full text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              Failed to load announcements. Please try again.
            </div>
          )}

          {isLoading && (
            <div className="w-full flex flex-col items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} className="w-full" />
              ))}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <EmptyState
              title="No announcements yet"
              description="Stay tuned for updates from the community admins."
            />
          )}

          {!isLoading &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                viewerRole={viewerRole}
                communityId={community?.id}
                channelId={channelId}
                communitySlug={community?.slug}
                onEdit={() => {}}
                onDelete={() => handleDeletePost(post.id)}
                onShare={() => handleSharePost(post.id)}
                onReact={(reactionType) => handleReactToPost(post.id, reactionType)}
                onTogglePin={() => handleTogglePin(post.id)}
              />
            ))}
        </div>

        <aside className="hidden lg:flex flex-col gap-4 w-80 shrink-0">
          <CommunityStats memberCount={community.memberCount} />
          <PanelCard>
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-[#261A2B]">Top Contributors</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </PanelCard>
          <PanelCard>
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-[#261A2B]">Popular Tags</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </PanelCard>
          <GradientContainer
            className="px-6 py-5"
            icon="/icons/user-question.svg"
            iconClassName="bottom-0 right-2 opacity-100"
          >
            <div className="flex flex-col gap-3 text-white">
              <h3 className="font-bold text-lg xl:text-xl capitalize tracking-wide">need help?</h3>
              <p className="text-base font-light">
                Check out our{' '}
                <button
                  onClick={handleResourcesClick}
                  className="text-brand-200 cursor-pointer hover:underline"
                >
                  resources
                </button>
                or reach out to moderators.
              </p>
            </div>
          </GradientContainer>
        </aside>
      </div>

      <CreatePostDialog
        communityId={community.id}
        channelId={channelId}
        postType="Announcement"
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <PinnedAnnouncementsDialog
        isOpen={isPinnedDialogOpen}
        onOpenChange={setIsPinnedDialogOpen}
        pinnedPosts={pinnedPosts}
        isLoading={pinnedLoading}
        currentUserId={currentUserId}
        viewerRole={viewerRole}
        communityId={community?.id}
        channelId={channelId}
        communitySlug={community?.slug}
        onDelete={handleDeletePost}
        onShare={handleSharePost}
        onReact={handleReactToPost}
        onTogglePin={handleTogglePin}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmDialog({ isOpen: false, postId: '' })}
      />

      <JoinToAccessDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onJoin={handleJoin}
        isPending={joinPending}
      />

      {selectedPost && (
        <SharePostDialog
          post={selectedPost}
          communitySlug={community.slug}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}
    </div>
  );
}
