import type { CommunitySummary } from '@/types/community.types';
import { formatNumberCount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { cn } from '@/lib/utils';
import { useJoinCommunity } from '@/hooks/useCommunities';
import { useState } from 'react';

type CommunityCardProps = {
  community: CommunitySummary;
};

function CommunityCard({ community }: CommunityCardProps) {
  const { mutate: join, isPending } = useJoinCommunity();
  const [imgError, setImgError] = useState(false);

  return (
    <Card
      className={cn(
        'p-0 gap-0 w-full',
        'overflow-hidden rounded-2xl shadow-lg cursor-default',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-xl'
      )}
    >
      {/* Community Cover */}
      <div className="relative -mb-5 h-25 w-full overflow-hidden bg-linear-to-tl from-[#814698] to-[#4C88C1]">
        {community.coverImageUrl && !imgError && (
          <img
            src={community.coverImageUrl}
            alt={community.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="w-full rounded-t-2xl z-1 space-y-1.5 py-3.5 bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold truncate">
            <Link to={`/communities/${community.slug}`} className="hover:text-brand-800">
              {community.name}
            </Link>
          </CardTitle>

          <div className="flex gap-1.5 text-md font-medium text-zinc-500">
            <img
              src={community.iconUrl ?? '/icons/category-icon.svg'}
              alt={community.categoryName}
              className="w-4 rotate-15"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <p>
              {community.categoryName}
              {community.subCategoryName && (
                <span className="text-zinc-400"> . {community.subCategoryName}</span>
              )}
            </p>
          </div>
        </CardHeader>

        {/* Description */}
        <CardContent className="">
          <p className="text-md text-zinc-400 leading-snug line-clamp-2">{community.description}</p>
        </CardContent>

        {/*  Members count + Join / Request button */}
        <CardFooter className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <img src="/icons/user-group-gray.svg" />
            <span className="text-sm font-light whitespace-nowrap">
              {formatNumberCount(community.memberCount)} Members
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            aria-label={community.isPrivate ? `Request` : `Join`}
            className="text-md font-medium text-foreground shadow-none rounded-lg border-stone-300 has-[>svg]:px-6 h-9 cursor-pointer"
            onClick={() => join(community.id)}
          >
            {isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : community.isPrivate ? (
              <Lock size={12} />
            ) : (
              <Plus size={12} />
            )}
            {community.isPrivate ? 'Request' : 'Join'}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default CommunityCard;
