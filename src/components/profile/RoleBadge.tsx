import { cn } from '@/lib/utils';
import { getRoleStyle } from '@/lib/role-styles';

interface RoleBadgeProps {
  role: string | null | undefined;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const style = getRoleStyle(role);
  const { Icon } = style;
  return (
    <span
      aria-label={`Role: ${role ?? 'Member'}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        style.bg,
        style.text,
        style.outline,
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span>{role ?? 'Member'}</span>
    </span>
  );
}
