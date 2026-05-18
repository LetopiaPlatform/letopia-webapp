import { cn } from '@/lib/utils';

interface PanelCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelCard({ children, className }: PanelCardProps) {
  return (
    <div
      className={cn(
        'bg-[#F6F5F6] rounded-2xl border border-[#DBD5DE] px-3 py-4 flex flex-col gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
