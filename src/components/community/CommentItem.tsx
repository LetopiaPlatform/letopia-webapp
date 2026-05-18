import { useAddCommentReaction, useDeleteComment, useUpdateComment } from '@/hooks/useComments';
import { formatRelativeTime } from '@/lib/utils';
import type { Comment } from '@/types/comment.types';
import { Dot, EllipsisVertical, Heart, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
}

export function CommentItem({ comment, postId, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(postId);
  const { mutate: addReaction } = useAddCommentReaction(postId);

  const isOwner = currentUserId === comment.author.id;
  const isLiked = comment.currentUserReaction === 'Upvote';

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleUpdate() {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment(
      { commentId: comment.id, data: { content: trimmed } },
      { onSuccess: () => setIsEditing(false) }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === 'Escape') {
      setEditValue(comment.content);
      setIsEditing(false);
    }
  }

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      {comment.author.avatarUrl ? (
        <img
          src={comment.author.avatarUrl}
          alt={comment.author.fullName}
          className="size-8 rounded-full object-cover shrink-0 mt-0.5"
        />
      ) : (
        <div className="size-8 rounded-full bg-[#E5E7EB] shrink-0 mt-0.5 flex items-center justify-center">
          <span className="text-[#6F6673] text-xs font-semibold uppercase">
            {comment.author.fullName?.charAt(0) ?? '?'}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-[#261A2B]">{comment.author.fullName}</span>
            <Dot className="text-muted-foreground" />
            <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>

          {isOwner && !isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded-md text-muted-foreground cursor-pointer"
                aria-label="Comment options"
              >
                <EllipsisVertical className="size-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 z-10 min-w-30 bg-white border border-border rounded-xl shadow-md py-1 flex flex-col">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground w-full text-left"
                  >
                    <Pencil className="size-3.5 text-muted-foreground" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                      setMenuOpen(false);
                    }}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive w-full text-left disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content or Edit input */}
        {isEditing ? (
          <div className="mt-1.5 flex flex-col items-end gap-2">
            <textarea
              ref={editRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-border bg-white text-sm text-[#261A2B] outline-none resize-none scrollbar-hide"
            />
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-1 text-xs bg-primary text-white font-medium disabled:opacity-50 py-1 px-3 rounded-md"
              >
                {isUpdating && <Loader2 className="size-3.5 animate-spin" />}
                Save
              </button>
              <button
                onClick={() => {
                  setEditValue(comment.content);
                  setIsEditing(false);
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground bg-[#d6d2d8] py-1 px-3 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-[#524B56] leading-relaxed wrap-break-words">
            {comment.content}
          </p>
        )}

        {/* Footer actions */}
        {!isEditing && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => addReaction({ commentId: comment.id, reactionType: 'Upvote' })}
              className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-[#D91122]' : 'text-[#6F6673]'}`}
              aria-pressed={isLiked}
              aria-label={`${isLiked ? 'Remove reaction' : 'Like'} — ${comment.upvotes} upvotes`}
            >
              <Heart className={`size-3.5 ${isLiked ? 'fill-[#D91122]' : ''}`} strokeWidth={1.5} />
              <span className="text-xs font-medium">{comment.upvotes}</span>
            </button>
            {/* <button className="text-xs font-medium capitalize text-muted-foreground">reply</button> */}
          </div>
        )}
      </div>
    </div>
  );
}
