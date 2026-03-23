import { SORT_OPTIONS } from '@/lib/constants';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from './ui/skeleton';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const SortDropdown = ({ value, onChange, isLoading }: SortDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  if (isLoading) {
    return <Skeleton className="h-10 w-36 rounded-xl" />;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 lg:px-5 py-3 bg-white rounded-xl border text-sm text-sidebar-ring cursor-pointer"
      >
        <img src="/icons/sort.svg" className="size-4" alt="Sort icon" />
        <span>{SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Sort By'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 right-0 z-50 w-52 rounded-xl border bg-white shadow-lg py-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer ${
                value === option.value ? 'text-primary font-semibold' : 'text-foreground'
              }`}
            >
              <img src={option.icon} className="size-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
