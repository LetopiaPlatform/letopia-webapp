import { Building2, Compass, Shield, Sprout, User, type LucideIcon } from 'lucide-react';

/**
 * Visual styles per platform role.
 * Backend defines: Learner (default), Guide, Architect, Admin.
 * Unknown values fall back to neutral.
 */

export type PlatformRole = 'Learner' | 'Guide' | 'Architect' | 'Admin';

export interface RoleStyle {
  /** Background color for the badge (Tailwind class) */
  bg: string;
  /** Text color for the badge */
  text: string;
  /** Border / outline color */
  outline: string;
  /** Lucide icon component to render inside the badge */
  Icon: LucideIcon;
  /** Human-readable suffix shown after the role (e.g. "Learner Member") */
  suffix: string;
}

const FALLBACK: RoleStyle = {
  bg: 'bg-zinc-100',
  text: 'text-zinc-700',
  outline: 'outline outline-zinc-300',
  Icon: User,
  suffix: 'Member',
};

const ROLE_STYLES: Record<PlatformRole, RoleStyle> = {
  Learner: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    outline: 'outline outline-emerald-300',
    Icon: Sprout,
    suffix: 'Learner',
  },
  Guide: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    outline: 'outline outline-sky-300',
    Icon: Compass,
    suffix: 'Guide',
  },
  Architect: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    outline: 'outline outline-fuchsia-300',
    Icon: Building2,
    suffix: 'Architect',
  },
  Admin: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    outline: 'outline outline-rose-300',
    Icon: Shield,
    suffix: 'Admin',
  },
};

export function getRoleStyle(role: string | null | undefined): RoleStyle {
  if (!role) return FALLBACK;
  return ROLE_STYLES[role as PlatformRole] ?? FALLBACK;
}
