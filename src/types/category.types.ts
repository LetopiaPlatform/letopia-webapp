export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  type: string;
  parentCategoryId: string | null;
  childCategories: Category[] | null;
}
