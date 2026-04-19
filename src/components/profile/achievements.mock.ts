import type { Achievement } from '@/components/profile/AchievementCard';

// TODO(backend): replace with real achievements endpoint.
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first task',
    image: '/assets/profile/achievements/first-steps.svg',
    imageClass: 'w-[122px] h-[217px] rotate-180',
    unlockedAt: '2026-03-01',
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Join 5 communities',
    image: '/assets/profile/achievements/community-builder.svg',
    imageClass: 'w-[163px] h-[163px]',
    unlockedAt: '2026-03-15',
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    image: '/assets/profile/achievements/week-warrior.svg',
    imageClass: 'w-[215px] h-[270px]',
    unlockedAt: '2026-04-05',
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 100 tasks',
    image: '/assets/profile/achievements/task-master.svg',
    imageClass: 'w-[228px] h-[179px]',
    unlockedAt: '2026-04-10',
  },
  {
    id: 'diamond-rank',
    title: 'Diamond Rank',
    description: 'Reach Diamond rank',
    image: '/assets/profile/achievements/diamond-rank.svg',
    imageClass: 'w-[200px] h-[223px]',
    unlockedAt: '2026-04-12',
  },
  {
    id: 'perfect-month',
    title: 'Perfect Month',
    description: 'Complete tasks every day for 30 days',
    image: '/assets/profile/achievements/perfect-month.svg',
    imageClass: 'w-[126px] h-[131px]',
    progress: 14,
  },
  {
    id: 'deadline-champion',
    title: 'Deadline Champion',
    description: 'Complete all tasks before their deadlines for 60 days',
    image: '/assets/profile/achievements/deadline-champion.svg',
    imageClass: 'w-[200px] h-[223px]',
    progress: 50,
  },
  {
    id: 'collaboration-pro',
    title: 'Collaboration Pro',
    description: 'Work on 50 collaborative tasks',
    image: '/assets/profile/achievements/collaboration-pro.svg',
    imageClass: 'w-[215px] h-[270px]',
    progress: 32,
  },
];
