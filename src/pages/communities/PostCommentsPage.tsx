import { useNavigate, useParams } from 'react-router-dom';
import { usePostById, usePostComments, useAddComment } from '@/hooks/usePosts';
import { Send, Loader2, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { useAuthContext } from '@/context/AuthContext';
import { CommentItem } from '@/components/community/CommentItem';

export function PostCommentsPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthContext();

  const { data: postData, isLoading: postLoading } = usePostById(postId ?? '');
  const { data: commentsData, isLoading: commentsLoading } = usePostComments(postId ?? '');
  const { mutate: addComment, isPending: isSubmitting } = useAddComment(postId ?? '');

  const post = postData?.data;
  const comments = commentsData?.data?.items ?? [];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [commentText]);

  function handleSubmit() {
    const trimmed = commentText.trim();

    if (!trimmed) return;

    addComment(trimmed, {
      onSuccess: () => setCommentText(''),
    });
  }

  function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-[70vh] px-3 bg-white border-2 border-border/60 max-w-2xl mx-auto overflow-hidden rounded-3xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className=" size-4 md:size-5 text-muted-foreground stroke-3" />
        </button>
        <h1 className="text-sm font-semibold text-muted-foreground line-clamp-1">
          {postLoading ? 'Loading...' : post?.title}
        </h1>
      </div>

      {/* Comments list */}
      <div className="flex-1 py-4 md:px-4 flex flex-col gap-5 h-full overflow-y-auto scrollbar-hide">
        {commentsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {!commentsLoading && comments.length === 0 && (
          <EmptyState title="No comments yet!" description="Be the first to share your thoughts" />
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId ?? ''}
            currentUserId={user?.id}
          />
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white md:px-3 py-3">
        <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment"
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-border/50 bg-white text-sm text-foreground placeholder-muted-foreground/40 outline-none resize-none min-h-12 max-h-36 overflow-y-auto scrollbar-hide"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="shrink-0 size-11 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            aria-label="Send comment"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
