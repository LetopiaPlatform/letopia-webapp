import type { ReactNode } from 'react';
import { FeatureCard } from './FeatureCard';
import { cn } from '@/lib/utils';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
}

export function FeaturesSection({ title, subtitle, features, className }: FeaturesSectionProps) {
  return (
    <section className={cn('relative w-full px-4 sm:px-6 mb-40 sm:mb-50 2xl:mb-60', className)}>
      <div className="relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3 sm:gap-4 text-center bg-white shadow-2xl shadow-pink-100 rounded-xl p-10 pb-20 sm:pb-24">
          <span className="text-sm sm:text-base font-normal text-mauve-900 capitalize tracking-wider">
            why leTopia
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient">{title}</h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl">{subtitle}</p>
          )}
        </div>

        {/* Features*/}
        <div className="absolute left-0 top-50 sm:top-40 mt-10 w-full max-w-full mx-auto">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex w-max mx-auto gap-7 py-4 px-2">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
