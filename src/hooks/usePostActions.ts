import { useDeletePost, useTogglePin, useAddReaction } from './usePosts';

export function usePostActions(communityId: string, channelId: string) {
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(communityId, channelId);
  const { mutate: addReaction } = useAddReaction();
  const { mutate: togglePin } = useTogglePin(communityId, channelId);

  return {
    deletePost,
    isDeleting,
    addReaction,
    togglePin,
  };
}
