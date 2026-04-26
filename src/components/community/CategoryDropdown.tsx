import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';

function CategoryIcon({ src, className }: { src: string | null | undefined; className?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      className={className}
      alt=""
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

interface CategoryDropdownFieldProps {
  label: string;
  selected: Category | null;
  options: Category[];
  isLoading?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (cat: Category) => void;
}

export function CategoryDropdownField({
  label,
  selected,
  options,
  isLoading,
  disabled,
  required,
  placeholder = 'Select…',
  isOpen,
  onOpenChange,
  onSelect,
}: CategoryDropdownFieldProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border/40 focus-within:ring-2 focus-within:ring-ring/50',
        disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
      )}
    >
      <div className="flex flex-col items-start space-y-1 w-full">
        <DropdownMenu modal={false} open={isOpen} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="flex items-center cursor-pointer w-full justify-between disabled:cursor-not-allowed"
            >
              <div>
                <h4 className="text-muted-foreground text-sm font-normal whitespace-nowrap">
                  {label}
                  {required && ' *'}
                </h4>
                <div className="flex items-center gap-2">
                  <CategoryIcon src={selected?.iconUrl} className="size-3.5" />
                  <span className="font-medium capitalize text-sm">
                    {isLoading ? 'Loading…' : (selected?.name ?? placeholder)}
                  </span>
                </div>
              </div>

              {!disabled && (
                <img
                  src="/icons/arrow.svg"
                  className={cn(
                    'size-5 transform transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-50" align="start">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onSelect={() => onSelect(option)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon src={option.iconUrl} className="size-4" />
                    {option.name}
                  </div>
                  {selected?.id === option.id && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">No options available</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
