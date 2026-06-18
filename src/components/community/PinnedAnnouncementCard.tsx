import { HugeiconsIcon } from '@hugeicons/react';
import { Pin02Icon } from '@hugeicons/core-free-icons';
import type { PostSummary } from '@/types/post.types';
import { formatRelativeTime } from '@/lib/utils';

interface Props {
  post: PostSummary;
  onClick: () => void;
}

export const PinnedAnnouncementCard = ({ post, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="m-1 w-full text-left bg-white border rounded-xl p-4 hover:shadow-md hover:translate-y-0.5 transition cursor-pointer"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon
              icon={Pin02Icon}
              size={17}
              strokeWidth={1.5}
              className="text-primary"
              fill="#834496"
            />

            <span className="text-xs font-medium text-primary uppercase">
              {post.authorInfo.communityRole}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>

          <h3 className="font-semibold text-[#261A2B] line-clamp-1">{post.title}</h3>

          {post.content && (
            <p className="text-sm text-[#6F6673] line-clamp-2 mt-1">{post.content}</p>
          )}
        </div>
      </div>
    </button>
  );
};
