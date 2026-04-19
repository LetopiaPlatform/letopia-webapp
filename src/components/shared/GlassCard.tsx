import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl sm:rounded-[32px] border border-white/30 bg-white/10 p-6 sm:p-10 md:p-12 shadow-xl shadow-black/5 backdrop-blur-2xl backdrop-saturate-150',
        className
      )}
    >
      {children}
    </div>
  );
}
