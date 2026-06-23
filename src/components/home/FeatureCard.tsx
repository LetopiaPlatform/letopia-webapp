import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl w-[250px] py-[2px] px-0 bg-gradient-to-r from-[#4c88c1] to-[#814698] overflow-hidden shrink-0',
        className
      )}
    >
      <div className="h-full w-full flex flex-col items-center gap-3 rounded-2xl bg-white py-4 px-6 bg-white margin-0">
        <h3 className="text-center text-lg font-semibold text-gradient">{title}</h3>
        <p className="text-center text-sm text-neutral-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
