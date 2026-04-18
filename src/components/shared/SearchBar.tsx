import { useRef, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { NAV_ICONS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SEARCH_FILTERS = ['Communities', 'Projects', 'Members'] as const;
type SearchFilter = (typeof SEARCH_FILTERS)[number];

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleResultClick = (result: string) => {
    setSearchQuery(result);
    setIsSearchFocused(false);
  };

  const filteredResults = (
    activeFilter ? MOCK_RESULTS[activeFilter] : Object.values(MOCK_RESULTS).flat()
  ).filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`relative ${className ?? ''}`}>
      <div
        className={`flex items-center rounded-xl border bg-white p-3 sm:p-4 transition-colors ${
          isSearchFocused ? 'border-[#824892]' : 'border-[#DBD5DE]'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <img
            src={NAV_ICONS.SEARCH}
            alt=""
            aria-hidden="true"
            className={`size-6 shrink-0 transition-all ${
              isSearchFocused || activeFilter
                ? 'brightness-0 invert-28 sepia-60 saturate-700 hue-rotate-260'
                : ''
            }`}
          />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder={
              activeFilter ? `Search ${activeFilter}...` : 'Search for Communities, Projects...'
            }
            className="min-w-0 flex-1 bg-transparent text-sm font-normal text-[#24252c] placeholder:text-[#DBD5DE] outline-none truncate"
          />

          {activeFilter && (
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className="flex items-center gap-1 rounded-[14px] border border-[#824892] px-2 py-1 text-xs text-[#824892] shrink-0"
              aria-label={`Remove ${activeFilter} filter`}
            >
              <XIcon className="size-3.5" />
              <span>{activeFilter}</span>
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="outline-none shrink-0">
                <img src={NAV_ICONS.FILTER} alt="Filter" className="size-6 cursor-pointer" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={24}
              className="rounded-[14px] border border-[#a39ba6] bg-white p-4 gap-4 min-w-35"
            >
              {SEARCH_FILTERS.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    searchInputRef.current?.focus();
                  }}
                  className="cursor-pointer text-sm text-[#24252c] px-0 py-0 hover:text-[#824892] focus:text-[#824892] hover:bg-transparent focus:bg-transparent"
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search results dropdown */}
      {isSearchFocused && searchQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-[14px] border border-[#DBD5DE] bg-white p-4 shadow-sm z-50">
          <div className="flex flex-col gap-4">
            {filteredResults.length > 0 ? (
              filteredResults.slice(0, 5).map((result) => (
                <button
                  key={result}
                  type="button"
                  className="text-left text-sm text-[#24252c] hover:text-black transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(result)}
                >
                  {result}
                </button>
              ))
            ) : (
              <p className="text-sm text-[#DBD5DE]">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder mock results — replace with real API later
const MOCK_RESULTS: Record<SearchFilter, string[]> = {
  Communities: ['UI/UX Design', 'Graphic Design', 'Designers'],
  Projects: ['Portfolio Website', 'E-commerce App', 'Design System'],
  Members: ['Mohamed Raafat', 'Ahmed Ali', 'Sara Hassan'],
};
