interface StatBadgeProps {
  value: number;
  label: string;
}

export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 rounded-full py-1.5 sm:py-2 px-2.5 sm:px-3 bg-[#F6F5F6]">
      <span className="text-primary font-semibold text-sm sm:text-base">{value}</span>
      <span className="uppercase tracking-widest text-[#867D8A] text-xs font-normal">{label}</span>
    </div>
  );
}
