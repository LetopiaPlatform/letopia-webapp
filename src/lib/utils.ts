import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | undefined, maxLength = 2): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatNumberCount(count: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(count);
}

const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerWeek = 7;

const intervals: Record<string, number> = {
  week: millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay * daysPerWeek,
  day: millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay,
  hour: millisecondsPerSecond * secondsPerMinute * minutesPerHour,
  minute: millisecondsPerSecond * secondsPerMinute,
  second: millisecondsPerSecond,
};

const relativeDateFormat = new Intl.RelativeTimeFormat('en', { style: 'long' });

export function formatRelativeTime(dateStr: string): string {
  const createTime = new Date(dateStr);
  const diff = createTime.getTime() - Date.now();
  for (const interval in intervals) {
    if (intervals[interval] <= Math.abs(diff)) {
      return relativeDateFormat.format(
        Math.trunc(diff / intervals[interval]),
        interval as Intl.RelativeTimeFormatUnit
      );
    }
  }
  return relativeDateFormat.format(Math.trunc(diff / 1000), 'second');
}