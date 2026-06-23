import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  stepNumber: string | number;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function StepCard({ stepNumber, title, description, className }: StepCardProps) {
  const formattedNumber = String(stepNumber).padStart(2, '0');

  return (
    <div className={cn('flex flex-col items-center gap-4 text-center', className)}>
      {/* Step Number Badge */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        {/* Purple gradient background square */}
        <div className="absolute inset-0 rounded-[10px] bg-gradient-to-l from-[#814698] to-[#4c88c1] rotate-18" />
        <div className="absolute inset-0 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center flex translate-3">
          {/* Number */}
          <span className="relative text-2xl font-semibold text-white">{formattedNumber}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 mt-8">{title}</h3>
      {/* Description */}
      <p className="text-sm sm:text-base font-medium text-neutral-600 leading-relaxed max-w-[200px]">
        {description}
      </p>
    </div>
  );
}
