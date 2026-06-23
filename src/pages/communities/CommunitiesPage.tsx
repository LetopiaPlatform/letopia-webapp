import { HeroSection } from '@/components/HeroSection';
import { CommunitiesList } from '@/components/CommunitiesList';
import { useCategoriesList } from '@/hooks/useCategories';
import { useMemo, useState } from 'react';
import { CategoryTabs } from '@/components/CategoryTabs';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SubCategoryFilter } from '@/components/SubCategoryFilter';
import { AppSidebar } from '@/components/AppSidebar';

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
  const selectedSubCategoryItems = useMemo(
    () =>
      selectedCategoryObj?.childCategories?.filter((c) => selectedSubCategories.includes(c.slug)),
    [selectedCategoryObj?.childCategories, selectedSubCategories]
  );
  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    setSelectedSubCategories([]);
  };
  const handleSubCategoryToggle = (slug: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleClearSubCategories = () => {
    setSelectedSubCategories([]);
  };

  const handleSelectCommunity = (slug: string) => {
    navigate(`/communities/${slug}`, { state: { backgroundLocation: location } });
  };
  return (
    <>
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <HeroSection isLoading={isLoading} />

        <div className="px-4 md:px-6 lg:px-10 2xl:px-15 md:ml-16 mb-10">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-6">
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
                    onClearAll={handleClearSubCategories}
                  />
                )}
            </div>
            <CommunitiesList
              search={search}
              subCategorySlugs={selectedSubCategories}
              selectedSubCategoryItems={selectedSubCategoryItems}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onClearFilters={() => setSelectedSubCategories([])}
              onRemoveSubCategory={handleSubCategoryToggle}
              category={selectedCategoryObj}
              onSelectCommunity={handleSelectCommunity}
              isLoadingCategories={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
