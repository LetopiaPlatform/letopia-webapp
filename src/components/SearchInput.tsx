import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FilterOption {
  value: string;
  label: string;
  href: string;
}

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showFilter?: boolean;
  filterOptions?: FilterOption[];
  activeFilter?: string;
}

export const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  showFilter,
  filterOptions = [],
  activeFilter,
}: SearchInputProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-sidebar-ring" />

      {showFilter && filterOptions.length > 0 && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <img src="/icons/filter.svg" className="w-5" />
        </button>
      )}

      <Input
        aria-label="Search"
        placeholder={placeholder}
        className="px-9 py-5 lg:py-6 bg-white rounded-xl placeholder:text-sidebar-ring text-sm md:text-md lg:text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 right-0 z-50 w-48 rounded-xl border bg-white shadow-lg py-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                navigate(`${option.href}?search=${value}`);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm cursor-pointer ${
                activeFilter === option.value ? 'text-primary font-semibold' : 'text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
