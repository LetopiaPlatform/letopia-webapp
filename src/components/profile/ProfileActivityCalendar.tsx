import { useMemo } from 'react';
import { cn, formatCount } from '@/lib/utils';
import { PROFILE_ICONS, PROFILE_STRINGS } from '@/lib/constants';
import type { UserProfile } from '@/types/user.types';

interface ProfileActivityCalendarProps {
  user: UserProfile | null;
  /**
   * Days of the displayed month that should appear "active" (highlighted green).
   * Defaults to a small mocked range until the backend exposes activity data.
   * TODO(backend): wire to real activity endpoint when available.
   */
  activeDays?: number[];
  /** Month to display. Defaults to the current month. */
  month?: Date;
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

interface CalendarCell {
  day: number;
  active: boolean;
}

function buildCalendarCells(month: Date, activeSet: Set<number>): CalendarCell[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, active: activeSet.has(d) });
  }
  return cells;
}

export function ProfileActivityCalendar({
  user,
  activeDays,
  month: monthProp,
}: ProfileActivityCalendarProps) {
  const month = useMemo(() => monthProp ?? new Date(), [monthProp]);
  const monthLabel = `${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`;

  const activeSet = useMemo(() => new Set(activeDays ?? []), [activeDays]);
  const cells = useMemo(() => buildCalendarCells(month, activeSet), [month, activeSet]);

  // Offset for first day of month (0 = Sunday)
  const firstDayOffset = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  // Today's day-of-month, only if the displayed month matches the current month
  const today = new Date();
  const todayDay =
    today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth()
      ? today.getDate()
      : null;

  return (
    <section
      aria-label={PROFILE_STRINGS.SECTIONS.WEEKLY_ACTIVITY}
      className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
    >
      {/*
        Outer row mirrors the ProfileHeader structure exactly:
        ─ Avatar (size-28) + gap-8 + flex-1 info column
        Replacing Avatar with an invisible spacer of the same width keeps the
        following content perfectly aligned with the info column above.
      */}
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-8">
        {/* Invisible avatar-sized spacer (only on md+) */}
        <div aria-hidden className="hidden shrink-0 md:block md:size-28" />

        {/*
          Inner: 2-column grid that mirrors the contact grid in ProfileHeader
          (sm:grid-cols-2 gap-x-8). Calendar lands in column 1 (Email side),
          Stats land in column 2 (Phone side).
        */}
        <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          {/* ── Calendar (column 1 — aligns with Email/Skills/etc.) ── */}
          <div className="flex w-fit flex-col items-center gap-6 justify-self-center md:justify-self-start">
            <h3 className="text-lg font-semibold text-[#261A2B]">{monthLabel}</h3>

            <div
              role="grid"
              aria-label={`${monthLabel} activity calendar`}
              className="grid grid-cols-7 gap-x-2 gap-y-2 sm:gap-x-4"
            >
              {WEEKDAY_LETTERS.map((letter, i) => (
                <div
                  key={`weekday-${i}-${letter}`}
                  role="columnheader"
                  className="flex h-5 items-center justify-center text-sm font-normal text-[#261A2B]"
                >
                  {letter}
                </div>
              ))}

              {/* Empty leading cells before the 1st of the month */}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`pad-${i}`} aria-hidden className="size-9" />
              ))}

              {cells.map(({ day, active }) => {
                const isToday = day === todayDay;
                const dateLabel = `${MONTH_NAMES[month.getMonth()]} ${day}, ${month.getFullYear()}`;
                const stateLabel = active ? ' — has activity' : '';
                const todayLabel = isToday ? ' — today' : '';
                return (
                  <div
                    key={day}
                    role="gridcell"
                    aria-label={`${dateLabel}${stateLabel}${todayLabel}`}
                    aria-current={isToday ? 'date' : undefined}
                    data-active={active || undefined}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full text-sm font-normal',
                      active
                        ? 'bg-[#3EA616] text-[#F3EBF4]'
                        : 'border border-[#F3EBF4] text-[#261A2B]',
                      isToday && 'ring-2 ring-[#824892] ring-offset-1'
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Stats 2×2 (column 2 — aligns with Phone Number column) ── */}
          <div className="grid grid-cols-2 gap-4">
            <MiniStatCard
              iconSrc={PROFILE_ICONS.BADGE}
              value={user ? formatCount(user.totalPoints) : '—'}
              label={PROFILE_STRINGS.STATS.TOTAL_POINTS}
            />
            <MiniStatCard
              iconSrc={PROFILE_ICONS.FIRE}
              value={user ? `${user.currentStreak} Days` : '—'}
              label={PROFILE_STRINGS.STATS.CURRENT_STREAK}
            />
            <MiniStatCard
              iconSrc={PROFILE_ICONS.CHECKLIST_PEN}
              value="Coming soon"
              label={PROFILE_STRINGS.STATS.TASKS_COMPLETED}
            />
            <MiniStatCard
              iconSrc={PROFILE_ICONS.TRUST}
              value="Coming soon"
              label={PROFILE_STRINGS.STATS.CONTRIBUTIONS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface MiniStatCardProps {
  iconSrc: string;
  value: string;
  label: string;
}

function MiniStatCard({ iconSrc, value, label }: MiniStatCardProps) {
  const isPlaceholder = value === 'Coming soon';
  return (
    <div className="flex h-32 min-w-0 flex-col justify-center gap-2 rounded-xl bg-[#F6F5F6] px-4 shadow-[0_4px_4px_rgba(0,0,0,0.10)]">
      <img src={iconSrc} alt="" className="size-[52px]" />
      <div className="flex min-w-0 flex-col">
        <p
          className={cn(
            'truncate font-semibold leading-8',
            isPlaceholder ? 'text-sm text-[#9CA3AF]' : 'text-lg text-[#261A2B]'
          )}
        >
          {value}
        </p>
        <p className="truncate text-sm font-normal leading-5 text-[#867D8A]">{label}</p>
      </div>
    </div>
  );
}
