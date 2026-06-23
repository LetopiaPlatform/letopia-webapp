import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { StepCard } from './Stepcard';

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface StepsSectionProps {
  headline: string;
  steps: Step[];
  className?: string;
}

export function StepsSection({ headline, steps, className }: StepsSectionProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient text-center mb-18">
          {headline}
        </h2>

        {/* Steps Grid with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <StepCard
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
              />

              {/* Horizontal connector line (visible on md and up) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-13 -right-1/6 w-1/2 h-0.5 bg-gradient-to-r from-purple-400 via-[#4c88c1] to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
