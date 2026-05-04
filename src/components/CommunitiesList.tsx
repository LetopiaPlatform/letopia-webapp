import { useCommunitiesList } from '@/hooks/useCommunities';
import type { Category } from '@/types/category.types';
import CommunityCard from './CommunityCard';
import { CommunitySkeleton } from '@/components/CardSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SortDropdown } from '@/components/SortDropdown';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { CreateCommunityDialog } from './community/CreateCommunityDialog';

const PAGE_SIZE = 12;

interface CommunitiesListProps {
  category?: Category | undefined;
  subCategorySlugs?: string[];
  selectedSubCategoryItems?: Category[];
  search?: string;
  sortBy?: string;
  onSortChange: (value: string) => void;
  onClearFilters?: () => void;
  onRemoveSubCategory?: (slug: string) => void;
  onSelectCommunity?: (slug: string) => void;
  isLoadingCategories?: boolean;
}

export function CommunitiesList({
  category,
  subCategorySlugs,
  selectedSubCategoryItems,
  search,
  sortBy,
  onSortChange,
  onClearFilters,
  onRemoveSubCategory,
  onSelectCommunity,
  isLoadingCategories,
}: CommunitiesListProps) {
  const [page, setPage] = useState(1);

  const subCategoryKey = subCategorySlugs?.join(',') ?? '';
  const currentFilters = `${category?.slug}|${subCategoryKey}|${search}|${sortBy}`;
  const [prevFilters, setPrevFilters] = useState(currentFilters);
  if (currentFilters !== prevFilters) {
    setPrevFilters(currentFilters);
    setPage(1);
  }

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
  const totalItems = data?.data?.totalItems ?? 0;
  const hasActiveFilters = (subCategorySlugs?.length ?? 0) > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const handleCreateCommunity = () => {
    if (isAuthenticated) {
      setIsDialogOpen(true);
    } else {
      navigate('/login', { state: { redirectTo: '/communities' } });
    }
  };

  if (!isLoading && !error && communities.length === 0) {
    if (search) {
      return (
        <EmptyState
          image={'/assets/emptyState.svg'}
          title="No communities found"
          description={`No result for '${search}' ${category ? `in ${category.name}` : ''}`}
        />
      );
    }
    return (
      <>
        <EmptyState
          image={'/assets/emptyState.svg'}
          title="No communities yet"
          description="Be the first to create a community and bring people together."
          actionLabel="Create Community"
          actionIcon={<Plus className="size-4 sm:size-5" />}
          onAction={handleCreateCommunity}
        />
        <CreateCommunityDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      </>
    );
  }

  return (
    <section
      aria-labelledby={category ? `category-heading-${category.slug}` : 'communities-heading'}
      className="w-full flex flex-col gap-5 md:gap-10"
    >
      <div className="flex flex-col items-center gap-4 md:justify-between">
        <div className="w-full min-w-0 flex items-center gap-2  border-t border-foreground/10 pt-5 md:pt-6">
          <div className="flex items-center gap-2  overflow-x-auto min-w-0 flex-1 scrollbar-hide">
            {selectedSubCategoryItems?.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => onRemoveSubCategory?.(sub.slug)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/50 rounded-full border border-foreground/20 cursor-pointer transition-colors hover:bg-accent/50"
              >
                <X className="size-3.5" />
                {sub.name}
              </button>
            ))}
          </div>
          {hasActiveFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-destructive cursor-pointer transition-colors hover:text-destructive/80"
            >
              <X className="size-3.5" />
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:gap-4 w-full md:justify-end">
          {isLoading || isLoadingCategories ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            <span className="text-sm md:text-base font-medium text-foreground/70">
              Showing <span className="text-primary">{totalItems}</span>{' '}
              {totalItems === 1 ? 'Community' : 'Communities'}
            </span>
          )}
          <SortDropdown
            value={sortBy ?? 'newest'}
            onChange={onSortChange}
            isLoading={isLoadingCategories}
          />
        </div>
      </div>

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
