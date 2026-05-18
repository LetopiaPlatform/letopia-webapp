import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const GRADIENT =
  'linear-gradient(to bottom right, #824892, #7E4893, #7A4894, #764894, #724795, #6E4796, #694797, #654697, #614698, #5D4599, #594599, #54449A, #50439B, #4C439B, #47429C)';

interface GradientContainerProps {
  children: ReactNode;
  className?: string;
  icon?: string | ReactNode;
  iconClassName?: string;
}

export function GradientContainer({
  children,
  className,
  icon,
  iconClassName,
}: GradientContainerProps) {
  const baseIconClass = cn('absolute opacity-10 pointer-events-none select-none', iconClassName);

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{ background: GRADIENT }}
    >
      {icon &&
        (typeof icon === 'string' ? (
          <img src={icon} alt="" aria-hidden="true" className={baseIconClass} />
        ) : (
          <span aria-hidden="true" className={baseIconClass}>
            {icon}
          </span>
        ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
