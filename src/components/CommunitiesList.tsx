import { useCommunitiesList } from '@/hooks/useCommunities';
import type { Category } from '@/types/category.types';
import CommunityCard from './CommunityCard';
import { CommunitySkeleton } from '@/components/CardSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const PAGE_SIZE = 12;

interface CommunitiesListProps {
  category?: Category | undefined;
  subCategorySlugs?: string[];
  search?: string;
  sortBy?: string;
  onSelectCommunity?: (slug: string) => void;
}

export function CommunitiesList({
  category,
  subCategorySlugs,
  search,
  sortBy,
  onSelectCommunity,
}: CommunitiesListProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error, refetch } = useCommunitiesList({
    category: category?.slug,
    subCategorySlugs: subCategorySlugs?.length ? subCategorySlugs : undefined,
    search,
    sortBy,
    page,
    pageSize: PAGE_SIZE,
  });

  const communities = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [category?.slug, subCategorySlugs, search, sortBy]);

  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const handleCreateCommunity = () => {
    if (isAuthenticated) {
      navigate('/communities/create');
    } else {
      navigate('/login', { state: { redirectTo: '/communities/create' } });
    }
  };

  if (!isLoading && !error && communities.length === 0) {
    if (search) {
      return (
        <EmptyState
          title="No communities found"
          description={`No result for '${search}' ${category ? `in ${category.name}` : ''}`}
        />
      );
    }
    return (
      <EmptyState
        title="No communities yet"
        description="Be the first to create a community and bring people together."
        actionLabel="Create Community"
        actionIcon={<Plus className="size-4 sm:size-5" />}
        onAction={handleCreateCommunity}
      />
    );
  }

  return (
    <section
      aria-labelledby={category ? `category-heading-${category.slug}` : 'communities-heading'}
      className="w-full flex flex-col gap-5 md:gap-10"
    >
      {/* Body */}
      {isLoading ? (
        <CommunitySkeleton count={PAGE_SIZE} />
      ) : error ? (
        <div className="px-3 py-4 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-6 h-6 text-destructive/70" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Something went wrong while loading communities.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 2xl:gap-10',
            isFetching && !isLoading && 'opacity-50 transition-opacity duration-200'
          )}
        >
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} onSelect={onSelectCommunity} />
          ))}
        </div>
      )}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => p - 1)}
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                isActive={page === 1}
                onClick={() => setPage(1)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>

            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p !== 1 && p !== totalPages && Math.abs(p - page) <= 1)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  isActive={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => p + 1)}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
