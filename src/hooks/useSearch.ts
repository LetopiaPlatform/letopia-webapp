import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

interface SearchConfig {
  placeholder: string;
}

const getConfig = (pathname: string): SearchConfig | null => {
  if (pathname === '/communities') return { placeholder: 'Search communities...' };
  if (pathname.match(/^\/communities\/[^/]+\/members$/))
    return { placeholder: 'Search members...' };
  if (pathname === '/projects') return { placeholder: 'Search projects...' };
  return null;
};

export function useSearch() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const config = getConfig(location.pathname);
  const placeholder = config?.placeholder ?? 'Search...';
  const isSearchable = !!config;

  const setSearch = useCallback(
    (value: string) => {
      if (isSearchable) {
        setSearchParams((prev) => {
          prev.set('search', value.trim());
          return prev;
        });
      }
    },
    [isSearchable, setSearchParams]
  );

  const currentSearch = searchParams.get('search') ?? '';

  return { placeholder, isSearchable, setSearch, currentSearch };
}
