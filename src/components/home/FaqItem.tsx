import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function FAQItem({ question, answer, isOpen = false, onToggle, className }: FAQItemProps) {
  const [open, setOpen] = useState(isOpen);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div
      className={cn(
        'bg-neutral-50 p-px rounded-2xl overflow-hidden transition-all duration-200',
        open && ' bg-gradient-to-l from-primary to-[#4c88c1]/80 ',
        className
      )}
    >
      <div className="bg-neutral-50 rounded-2xl px-4 sm:px-6">
        {/* Question Header */}
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between gap-4 text-left hover:bg-neutral-50 transition-colors"
        >
          <span
            className={cn(
              'text-sm sm:text-md font-semibold transition-colors py-4 sm:py-5',
              open ? 'text-gradient' : 'text-neutral-900'
            )}
          >
            {question}
          </span>

          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={20}
            strokeWidth={2.5}
            color="#6B67AD"
            className={cn(
              'flex-shrink-0 rounded-full bg-primary/10 p-1 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>

        {/* Answer Content */}
        {open && (
          <div className="border-t border-neutral-200 py-4 text-sm sm:text-base text-neutral-500 leading-relaxed">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}
