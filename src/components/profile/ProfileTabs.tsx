import { cn } from '@/lib/utils';
import { PROFILE_ICONS, PROFILE_STRINGS } from '@/lib/constants';

export type ProfileTabKey = 'overview' | 'projects' | 'achievement';

interface ProfileTabsProps {
  active: ProfileTabKey;
  onChange: (key: ProfileTabKey) => void;
}

const TABS = [
  ['overview', PROFILE_STRINGS.TABS.OVERVIEW, PROFILE_ICONS.DASHBOARD],
  ['projects', PROFILE_STRINGS.TABS.PROJECTS, PROFILE_ICONS.CHECKLIST],
  ['achievement', PROFILE_STRINGS.TABS.ACHIEVEMENT, PROFILE_ICONS.AWARD],
] as const;

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <section className="mb-4!">
      <div
        role="tablist"
        className="grid grid-cols-3 gap-1 rounded-2xl bg-[#F3EBF4] p-1 sm:inline-flex sm:w-auto"
      >
        {TABS.map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => onChange(key)}
            className={cn(
              'flex h-9 items-center justify-center gap-1 rounded-2xl px-1 text-xs font-medium leading-5 text-[#1A1A1A] transition-colors xs:px-2 xs:text-sm sm:px-6 sm:text-base',
              active === key ? 'bg-white shadow-sm' : 'hover:bg-white/40'
            )}
          >
            <img src={icon} alt="" className="size-4.5 shrink-0" />
            <span className="hidden xs:inline">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
