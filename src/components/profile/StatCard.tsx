import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  const isPlaceholder = value === 'Coming soon';
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#824892]">{icon}</div>
      <p
        className={cn(
          'mt-3 font-semibold',
          isPlaceholder ? 'text-sm text-[#9CA3AF]' : 'text-2xl text-[#1A1A1A]'
        )}
      >
        {value}
      </p>
      <p className="text-xs text-[#6B7280]">{label}</p>
    </div>
  );
}
