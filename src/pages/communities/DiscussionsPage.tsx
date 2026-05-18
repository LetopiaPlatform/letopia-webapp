import { useNavigate, useOutletContext } from 'react-router-dom';
import type { CommunityDetail, CommunityRole } from '@/types/community.types';
import { Button } from '../../components/ui/button';
import { Plus, UserPlus2, Share2, ChevronLeft } from 'lucide-react';
import { PostCard } from '../../components/community/Postcard';
import { EmptyState } from '@/components/EmptyState';
import { GradientContainer } from '@/components/Gradientcontainer';
import { CommunityMembersCard } from '@/components/community/CommunityMembersCard';
import { useCommunityMembers } from '@/hooks/useCommunities';
import { useChannelPosts } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import { useCallback, useState } from 'react';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { InviteDialog } from '@/components/community/InviteDialog';
import { useCurrentUser } from '@/hooks/useUser';
import type { ReactionType } from '@/types/post.types';
import { SharePostDialog } from '@/components/community/SharePostDialog';
import type { PostSummary } from '@/types/post.types';

export function DiscussionsPage() {
  const navigate = useNavigate();
  const context = useOutletContext<{ community: CommunityDetail } | undefined>();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSummary | null>(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    postId: string;
  }>({
    isOpen: false,
    postId: '',
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const community = context?.community;
  const channelId =
    community?.channels?.find((ch) => ch.slug === 'discussions' || ch.channelType === 'Discussion')
      ?.id ?? '';

  const { data, isLoading, error } = useChannelPosts(community?.id ?? '', channelId);
  const posts = Array.isArray(data?.data?.items) ? data.data.items : [];

  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useCommunityMembers(community?.id ?? '', { page: 1, pageSize: 50 });
  const members = Array.isArray(membersData?.data?.items) ? membersData.data.items : [];

  const { data: currentUserData } = useCurrentUser();
  const currentUserId = currentUserData?.data?.id;
  const viewerRole: CommunityRole = community?.userRole ?? 'Member';

  const { deletePost, addReaction } = usePostActions(community?.id ?? '', channelId);

  function handleCreatePost() {
    setIsCreatePostOpen(true);
  }

  function handleDeletePost(postId: string) {
    setDeleteConfirmDialog({ isOpen: true, postId });
  }

  function confirmDelete() {
    deletePost(deleteConfirmDialog.postId);
    setDeleteConfirmDialog({ isOpen: false, postId: '' });
  }

  function handleSharePost(postId: string) {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShareDialogOpen(true);
    }
  }

  const handleReactToPost = useCallback(
    (postId: string, reactionType: ReactionType) => {
      addReaction({ postId, reactionType });
    },
    [addReaction]
  );

  function handleCommentOnPost(postId: string) {
    navigate(`${postId}/comments`);
  }

  // TODO: Implement save functionality
  function handleSavePost() {}

  function handleInviteFriends() {
    setInviteDialogOpen(true);
  }

  if (!community) {
    return (
      <EmptyState title="Community not found" description="Unable to load community information." />
    );
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4 min-w-full">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1 md:gap-2 text-base md:text-lg font-medium xl:text-2xl md:font-bold text-[#261A2B]">
          <img src="/icons/discussions.svg" className="size-5" alt="Discussions" />
          Discussions
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
            aria-expanded={showSidebar}
          >
            <img src="/icons/Members.svg" className="size-7" />
          </button>
          <Button
            variant="default"
            className="has-[>svg]:px-2.5 sm:has-[>svg]:px-6 py-4 md:py-6 rounded-xl text-white text-base font-normal cursor-pointer"
            onClick={handleCreatePost}
            aria-label="Create new discussion post"
          >
            <Plus className="size-4 stroke-3" aria-hidden="true" />
            <span className="capitalize tracking-wide hidden sm:inline">Create post</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        {/* Posts */}
        <div className="w-full flex flex-col items-center gap-4 h-screen overflow-y-auto scrollbar-hide pb-8">
          {error && (
            <div className="w-full text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              Failed to load discussions. Please try again.
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
              title="No posts yet!"
              description="Be the first to start a discussion in this community."
            />
          )}

          {!isLoading && (
            <div className="w-full flex flex-col items-center gap-4">
              {posts.map((post) => (
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
                  onSave={() => handleSavePost()}
                  onShare={() => handleSharePost(post.id)}
                  onReact={(reactionType) => handleReactToPost(post.id, reactionType)}
                  onComment={() => handleCommentOnPost(post.id)}
                />
              ))}
            </div>
          )}
        </div>

        <aside
          className={`fixed lg:static right-0 top-0 bottom-0 lg:inset-auto z-50 lg:z-auto flex flex-col gap-4 w-full lg:max-w-72 2xl:max-w-96 shrink-0 bg-white lg:bg-transparent p-6 lg:p-0 transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <button
              onClick={() => setShowSidebar(false)}
              className="flex items-center gap-3 capitalize text-muted-foreground cursor-pointer"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="size-5 stroke-3" /> back
            </button>
          </div>

          <GradientContainer
            className="px-6 py-5 shrink-0"
            icon={<Share2 className="size-32 -rotate-30 text-white" />}
            iconClassName="-top-4 -right-6"
          >
            <div className="flex flex-col gap-3 text-white">
              <h3 className="font-bold text-lg xl:text-xl tracking-wide">Grow with us</h3>
              <p className="text-base font-light">
                Contribute by inviting friends and earn points.
              </p>
              <button
                className="w-full bg-[#F3EBF4] text-lg text-primary font-medium py-2.5 rounded-xl flex items-center justify-center gap-3"
                onClick={handleInviteFriends}
                aria-label="Invite friends to community"
              >
                <UserPlus2 className="size-6" aria-hidden="true" />
                Invite friends
              </button>
            </div>
          </GradientContainer>

          {membersError && (
            <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              Failed to load members.
            </div>
          )}

          {membersLoading && (
            <div className="text-muted-foreground text-sm p-4">Loading members...</div>
          )}

          {!membersLoading && !membersError && (
            <CommunityMembersCard
              communityId={community.id}
              communitySlug={community.slug}
              members={members}
              totalCount={community.memberCount}
              viewerRole={community.userRole ?? 'Member'}
            />
          )}
        </aside>

        {showSidebar && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer"
            onClick={() => setShowSidebar(false)}
            aria-hidden="true"
          />
        )}
      </div>

      <CreatePostDialog
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        communityId={community.id}
        channelId={channelId ?? ''}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmDialog({ isOpen: false, postId: '' })}
      />

      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        communitySlug={community.slug}
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
