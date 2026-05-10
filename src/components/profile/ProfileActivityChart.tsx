import { PROFILE_STRINGS } from '@/lib/constants';

/**
 * Weekly activity chart placeholder.
 * TODO(backend): wire to real activity-over-time endpoint when available.
 */
export function ProfileActivityChart() {
  return (
    <section
      aria-label={PROFILE_STRINGS.SECTIONS.WEEKLY_ACTIVITY}
      className="flex flex-col rounded-3xl bg-white p-6 shadow-sm"
    >
      <h3 className="text-base font-semibold text-[#1A1A1A]">
        {PROFILE_STRINGS.SECTIONS.WEEKLY_ACTIVITY}
      </h3>
      <div className="mt-4 flex flex-1 min-h-48 items-center justify-center rounded-xl bg-linear-to-br from-[#824892]/5 to-[#824892]/10 text-sm text-[#6B7280]">
        {PROFILE_STRINGS.EMPTY.ACTIVITY_SOON}
      </div>
    </section>
  );
}
