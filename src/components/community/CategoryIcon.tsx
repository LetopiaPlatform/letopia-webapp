import { HugeiconsIcon } from '@hugeicons/react';
import { CATEGORY_ICONS } from '@/lib/category-task-icons';
import { hexToRgba } from '@/lib/community-task-utils';

interface CategoryIconProps {
  colorHex: string;
  iconKey: string | null;
  dimmed?: boolean;
}

export const CategoryIcon = ({ colorHex, iconKey, dimmed }: CategoryIconProps) => {
  const iconDef = CATEGORY_ICONS.find((i) => i.key === iconKey) ?? CATEGORY_ICONS[0];
  const color = dimmed ? '#DBD5DE' : colorHex;

  return (
    <div
      className="size-8 sm:size-9 rounded-[10px] sm:rounded-[11px] flex items-center justify-center shrink-0"
      style={{ backgroundColor: dimmed ? hexToRgba('#938A97', 0.15) : hexToRgba(colorHex, 0.15) }}
    >
      <HugeiconsIcon icon={iconDef.icon} size={20} color={color} strokeWidth={2} />
    </div>
  );
};
