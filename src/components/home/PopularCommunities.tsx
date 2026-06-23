import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import CommunityCard from '../CommunityCard';
import { useCommunitiesList } from '@/hooks/useCommunities';
import { useNavigate } from 'react-router-dom';

interface PopularCommunitiesProps {
  title: string;
  viewAll?: string;
  limit?: number;
  className?: string;
}

export function PopularCommunities({
  title,
  viewAll = 'View all',
  limit = 4,
  className,
}: PopularCommunitiesProps) {
  const navigate = useNavigate();
  const { data } = useCommunitiesList({ page: 1, pageSize: limit, sortBy: 'popular' });

  const communities = data?.data?.items ?? [];

  return (
    <section className={cn('w-full px-4 sm:px-6 xl:px-10 mt-16 ', className)}>
      <div className="max-w-full mx-auto">
        {/* Header with View All link */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary">{title}</h2>
          {viewAll && (
            <button
              onClick={() => navigate('/communities')}
              className="shrink-0 text-sm sm:text-base font-semibold text-primary hover:text-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {viewAll}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={2.5}
                className="text-primary"
              />
            </button>
          )}
        </div>

        {/* Horizontal scrolling communities */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {communities.map((community) => (
            <div key={community.id} className="min-w-70 max-w-85 shrink-0">
              <CommunityCard
                community={community}
                onSelect={(slug) => navigate(`/communities/${slug}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
