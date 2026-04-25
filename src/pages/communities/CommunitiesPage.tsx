import { HeroSection } from '@/components/HeroSection';
import { CommunitiesList } from '@/components/CommunitiesList';
import { useCategoriesList } from '@/hooks/useCategories';
import { useState } from 'react';
import { CategoryTabs } from '@/components/CategoryTabs';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SortDropdown } from '@/components/SortDropdown';
import { SubCategoryFilter } from '@/components/SubCategoryFilter';
import { CommunitiesSidebar } from '@/components/community/CommunitiesSidebar';

export function CommunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'newest';

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const { data, isLoading } = useCategoriesList('community');
  const categories = data?.data ?? [];

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('sortBy', value);
      return prev;
    });
  };

  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    setSelectedSubCategories([]);
  };
  const handleSubCategoryToggle = (slug: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSelectCommunity = (slug: string) => {
    navigate(`/communities/${slug}`, { state: { backgroundLocation: location } });
  };
  return (
    <div className="lg:flex lg:items-stretch">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-[calc(100vh-var(--navbar-height,0px))] lg:w-72 lg:shrink-0 lg:self-start">
        <CommunitiesSidebar />
      </aside>
      <div className="min-w-0 flex-1">
        <HeroSection isLoading={isLoading} />
        <div className="px-5 md:px-8 2xl:px-15 mb-10">
          <div className="flex flex-col gap-5 md:gap-8 lg:gap-10">
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              isLoading={isLoading}
            />
            {selectedCategoryObj?.childCategories &&
              selectedCategoryObj.childCategories.length > 0 && (
                <SubCategoryFilter
                  subCategories={selectedCategoryObj.childCategories}
                  selected={selectedSubCategories}
                  onToggle={handleSubCategoryToggle}
                />
              )}
            <div className="space-y-4">
              <div className="flex justify-end">
                <SortDropdown value={sortBy} onChange={handleSortChange} isLoading={isLoading} />
              </div>
              <CommunitiesList
                search={search}
                subCategorySlugs={selectedSubCategories}
                sortBy={sortBy}
                category={selectedCategoryObj}
                onSelectCommunity={handleSelectCommunity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
