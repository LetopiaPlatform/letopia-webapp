import { cn, formatNumberCount, formatRelativeTime } from '@/lib/utils';
import {
  Heart,
  Share2,
  Pin,
  Dot,
  MessageCircle,
  Pencil,
  Bookmark,
  EllipsisVertical,
} from 'lucide-react';
import type { PostSummary, ReactionType } from '@/types/post.types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TAG_COLORS } from '@/lib/constants';
import { MemberAvatar } from './MemberAvatar';
import type { CommunityRole } from '@/types/community.types';
import { ImageGallery } from './ImageGallery';
import { UpdatePostDialog } from './UpdatePostDialog';
import { SharePostDialog } from './SharePostDialog';

interface PostCardProps {
  post: PostSummary;
  currentUserId?: string;
  viewerRole?: CommunityRole;
  communityId?: string;
  channelId?: string;
  communitySlug?: string;
  onShare?: () => void;
  onDelete?: () => void;
  onTogglePin?: () => void;
  onReact?: (type: ReactionType) => void;
  onComment?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
}

export const PostCard = ({
  post,
  currentUserId,
  viewerRole,
  communityId,
  channelId,
  communitySlug,
  onShare,
  onDelete,
  onTogglePin,
  onReact,
  onComment,
  onEdit,
  onSave,
}: PostCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAnnouncement = post.postType === 'Announcement';
  const imageCount = post.imageUrls?.length ?? 0;
  const hasImage = post.imageUrls && post.imageUrls.length > 0;
  const hasContent = Boolean(post.content?.trim());
  const hasTags = !isAnnouncement && post.tags && post.tags.length > 0;
  const isLiked = post.currentUserReaction === 'Upvote';

  const getPostTagColor = (postId: string) => {
    const index = postId.charCodeAt(0) % TAG_COLORS.length;
    return TAG_COLORS[index];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleDelete = useCallback(() => {
    onDelete?.();
    setShowMenu(false);
  }, [onDelete]);

  const handleTogglePin = useCallback(() => {
    onTogglePin?.();
    setShowMenu(false);
  }, [onTogglePin]);

  const handleEdit = useCallback(() => {
    if (communityId && channelId) {
      setShowUpdateDialog(true);
    } else {
      onEdit?.();
    }
    setShowMenu(false);
  }, [onEdit, communityId, channelId]);

  const handleSave = useCallback(() => {
    onSave?.();
    setShowMenu(false);
  }, [onSave]);

  const handleReact = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onReact?.('Upvote');
    },
    [onReact]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (communitySlug) {
        setShowShareDialog(true);
      } else {
        onShare?.();
      }
    },
    [onShare, communitySlug]
  );

  const handleComment = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onComment?.();
    },
    [onComment]
  );

  const menuId = `post-menu-${post.id}`;

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    isDangerous?: boolean;
  }

  const isPostOwner = post.authorInfo.id === currentUserId;
  const isOwner = viewerRole === 'Owner';

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];

    if (isAnnouncement) {
      if (isOwner) {
        if (onTogglePin) {
          items.push({
            id: 'pin',
            label: post.isPinned ? 'Unpin' : 'Pin',
            icon: <Pin className="size-3.5 sm:size-4 fill-[#524B56]" />,
            onClick: handleTogglePin,
          });
        }
        if (onEdit) {
          items.push({
            id: 'edit',
            label: 'Edit',
            icon: <Pencil className="size-3.5 sm:size-4" />,
            onClick: handleEdit,
          });
        }
        if (onDelete) {
          items.push({
            id: 'delete',
            label: 'Delete',
            icon: <img src="/icons/delete-02.svg" className="size-3.5 sm:size-4" alt="" />,
            onClick: handleDelete,
            isDangerous: true,
          });
        }
      }
    } else {
      // Discussions
      if (isPostOwner) {
        if (onEdit) {
          items.push({
            id: 'edit',
            label: 'Edit',
            icon: <Pencil className="size-3.5 sm:size-4" />,
            onClick: handleEdit,
          });
        }
        if (onDelete) {
          items.push({
            id: 'delete',
            label: 'Delete',
            icon: <img src="/icons/delete-02.svg" className="size-3.5 sm:size-4" alt="" />,
            onClick: handleDelete,
            isDangerous: true,
          });
        }
      } else if (isOwner) {
        if (onDelete) {
          items.push({
            id: 'delete',
            label: 'Delete',
            icon: <img src="/icons/delete-02.svg" className="size-3.5 sm:size-4" alt="" />,
            onClick: handleDelete,
            isDangerous: true,
          });
        }
      }
    }

    return items;
  };

  const menuItems = getMenuItems();
  const hasMenu = menuItems.length > 0;

  const renderMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        aria-label="Post options"
        aria-expanded={showMenu}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="cursor-pointer"
      >
        <EllipsisVertical className="text-[#6F6673] size-4 stroke-3" />
      </button>
      {showMenu && (
        <div
          id={menuId}
          className="absolute top-full -right-1 mt-1 px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-2 bg-white border border-[#DBD5DE] rounded-xl z-20 min-w-36 sm:min-w-40 overflow-hidden"
          role="menu"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center gap-2 text-[13px] sm:text-[14px] font-normal ${
                item.isDangerous ? 'text-destructive' : 'text-[#524B56]'
              }`}
              role="menuitem"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <article
      className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 group flex flex-col gap-3 sm:gap-4 rounded-2xl border-2 border-border bg-white w-full min-w-xs max-w-4xl"
      role="article"
      aria-label={`${post.postType}: ${post.title}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        {isAnnouncement ? (
          /* Announcement header: role badge + timestamp */
          <div className="flex items-center gap-1">
            <span className="uppercase text-primary font-semibold text-[10px] sm:text-xs tracking-wider py-0.5 px-2 sm:py-1 sm:px-2.5 bg-[#652FE7]/10 rounded-full">
              {post.authorInfo.communityRole}
            </span>
            <time
              className="text-xs sm:text-sm font-normal text-[#6F6673] flex items-center"
              dateTime={post.createdAt}
              title={new Date(post.createdAt).toLocaleString('ar-EG')}
            >
              <Dot className="size-3 sm:size-4" />
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>
        ) : (
          /* Discussion header: avatar + name + role + timestamp */
          <div className="flex items-center gap-2 sm:gap-3">
            <MemberAvatar
              avatarUrl={post.authorInfo.avatarUrl}
              fullName={post.authorInfo.fullName}
            />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-semibold text-[#261A2B] leading-tight">
                  {post.authorInfo.fullName}
                </span>
                {post.authorInfo.communityRole && (
                  <span className="uppercase text-primary font-semibold text-[10px] sm:text-xs tracking-wider py-0.5 px-2 sm:py-1 sm:px-2.5 bg-[#652FE7]/10 rounded-full leading-none">
                    {post.authorInfo.communityRole}
                  </span>
                )}
              </div>
              <time
                className="text-xs sm:text-sm font-normal text-[#6F6673]"
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString('ar-EG')}
              >
                {formatRelativeTime(post.createdAt)}
              </time>
            </div>
          </div>
        )}

        {/* Pin + actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isAnnouncement && post.isPinned && (
            <Pin
              className="size-3.5 sm:size-4 text-primary fill-primary"
              aria-label="Pinned post"
            />
          )}

          {!isAnnouncement && onSave && (
            <button onClick={handleSave} aria-label="Save post">
              <Bookmark className="text-[#6F6673] size-4 sm:size-5" />
            </button>
          )}

          {hasMenu && renderMenu()}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug line-clamp-2 text-[#261A2B]">
        {post.title}
      </h3>

      {/* Content */}
      {hasContent && (
        <p className="text-sm sm:text-base text-[#6F6673] leading-relaxed line-clamp-3">
          {post.content}
        </p>
      )}

      {/* Images */}
      {hasImage && (
        <>
          <div
            className={cn(
              'overflow-hidden rounded-2xl',
              imageCount === 1 && 'w-full h-40 sm:h-48 md:h-56',
              imageCount >= 2 && 'grid grid-cols-2 gap-1 h-44 sm:h-52 md:h-60'
            )}
          >
            {post.imageUrls.slice(0, 4).map((img, i) => {
              const isLast = i === 3 && imageCount > 4;
              const remaining = imageCount - 4;
              return (
                <button
                  key={img}
                  onClick={() => {
                    setGalleryStartIndex(i);
                    setShowGallery(true);
                  }}
                  className={cn(
                    'relative overflow-hidden bg-muted rounded-2xl cursor-pointer group',
                    imageCount === 1 && 'aspect-video w-full',
                    imageCount === 2 && 'aspect-square',
                    imageCount === 3 && i === 0 && 'row-span-2',
                    imageCount === 3 && i > 0 && 'h-[calc(100%-1px)]',
                    imageCount >= 4 && 'h-full'
                  )}
                  type="button"
                  aria-label={`View image ${i + 1}${isLast ? ` and ${remaining} more` : ''}`}
                >
                  <img
                    src={img}
                    alt={`${post.title} — image ${i + 1} of ${imageCount}`}
                    className="absolute inset-0 w-full h-full rounded-2xl object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <span className="text-white text-base sm:text-xl font-medium">
                        +{remaining}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <ImageGallery
            images={post.imageUrls}
            isOpen={showGallery}
            onClose={() => setShowGallery(false)}
            initialIndex={galleryStartIndex}
          />
        </>
      )}

      {/* Tags (Discussions only) */}
      {hasTags && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {post.tags.map((tag) => {
            const { text, bg } = getPostTagColor(post.id);
            return (
              <span
                key={tag}
                style={{ color: text, backgroundColor: bg }}
                className="text-[10px] sm:text-xs font-semibold rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5"
              >
                #{tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* React */}
          <button
            onClick={handleReact}
            className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 transition-colors py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl ${isLiked ? 'bg-[#D91122]/10' : ''}`}
            aria-label={`${isLiked ? 'Remove reaction' : 'React'} — ${post.upvotes} upvotes`}
            aria-pressed={isLiked}
          >
            <Heart
              className={`size-4 sm:size-5 shrink-0 ${isLiked ? 'text-[#D91122] fill-[#D91122]' : 'text-[#6F6673]'}`}
              strokeWidth={1.5}
            />
            <span
              className={`${isLiked ? 'text-[#D91122]' : 'text-[#6F6673]'} text-xs sm:text-sm font-medium`}
            >
              {formatNumberCount(post.upvotes)}
            </span>
          </button>

          {/* Comments — Discussions only */}
          {!isAnnouncement && (
            <button
              onClick={handleComment}
              className="cursor-pointer flex items-center gap-1.5 sm:gap-2 transition-colors py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl"
              aria-label={`${post.commentCount} comments`}
            >
              <MessageCircle
                className="size-4 sm:size-5 shrink-0 text-[#6F6673]"
                strokeWidth={1.5}
              />
              <span className="text-[#6F6673] text-xs sm:text-sm font-medium">
                {formatNumberCount(post.commentCount)}
              </span>
            </button>
          )}
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="cursor-pointer flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 capitalize text-xs sm:text-sm font-medium text-[#524B56]"
          aria-label="Share post"
        >
          <Share2 className="size-4 sm:size-5" strokeWidth={1.5} />
          Share
        </button>
      </div>

      {communityId && channelId && (
        <UpdatePostDialog
          post={post}
          communityId={communityId}
          channelId={channelId}
          isOpen={showUpdateDialog}
          onClose={() => setShowUpdateDialog(false)}
        />
      )}

      {communitySlug && (
        <SharePostDialog
          post={post}
          communitySlug={communitySlug}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}
    </article>
  );
};
