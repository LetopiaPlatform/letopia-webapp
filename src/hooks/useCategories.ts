import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';

export function useCategoriesList(type: string) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoriesApi.getByType(type).then((res) => res.data),
    enabled: !!type,
  });
}
