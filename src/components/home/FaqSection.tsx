import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FAQItem } from './FaqItem';

interface FAQItemData {
  id: string;
  question: string;
  answer: ReactNode;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  items: FAQItemData[];
  className?: string;
}

export function FAQSection({ title, subtitle, items, className }: FAQSectionProps) {
  return (
    <section className={cn('w-full px-4 sm:px-6', className)}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-neutral-600">{subtitle}</p>}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <FAQItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
