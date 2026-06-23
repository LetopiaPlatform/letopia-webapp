import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  headline: string;
  description?: string;
  primaryButtonLabel: string;
  onPrimaryClick: () => void;
  backgroundImage?: string;
  className?: string;
}

export function CTASection({
  headline,
  description,
  primaryButtonLabel,
  onPrimaryClick,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn('relative isolate w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6', className)}
    >
      {/* Background Gradient */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="h-72 w-72 rounded-full bg-gradient-to-l from-primary to-[#4c88c1]/80 blur-3xl opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex rounded-full bg-gradient-to-l from-primary to-[#4c88c1] px-4 py-1.5 items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={15} color="white" />
          <span className="text-xs font-light text-white">Free to start</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient text-center leading-tight">
          {headline}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
            {description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <button
            onClick={onPrimaryClick}
            className="flex items-center gap-2 px-6 py-2 sm:py-3 rounded-full font-medium bg-white shadow-xl transition-shadow hover:translate-y-1 hover:cursor-pointer transition-all duration-300"
          >
            <span className="text-sm sm:text-base text-gradient">{primaryButtonLabel}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={2.5}
              className="text-primary/90"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
