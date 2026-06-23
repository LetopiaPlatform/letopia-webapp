interface ProfileChipPanelProps {
  title: string;
  items: string[];
  emptyText?: string;
}

export function ProfileChipPanel({
  title,
  items,
  emptyText = 'None added yet',
}: ProfileChipPanelProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#9CA3AF]">{emptyText}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#824892] outline outline-fuchsia-800/30"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
