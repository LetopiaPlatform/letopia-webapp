export type FeatureKey =
  | 'communitiesPage'
  | 'projectsPage'
  | 'roadmapsPage'
  | 'profileAchievementsTab'
  | 'profileProjectsTab'
  | 'settingsPage';

type Flags = Partial<Record<FeatureKey, boolean>>;

const FLAGS_URL = import.meta.env.VITE_FLAGS_URL ?? '/config.json';

let flags: Flags = {};
let loaded = false;

export async function loadFeatureFlags(): Promise<void> {
  try {
    const res = await fetch(FLAGS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`flags ${res.status}`);
    const data = (await res.json()) as { features?: Flags };
    flags = data.features ?? {};
  } catch (err) {
    console.warn('[featureFlags] failed to load, defaulting all off', err);
    flags = {};
  } finally {
    loaded = true;
  }
}

export function isFeatureEnabled(key: FeatureKey): boolean {
  if (!loaded) {
    console.warn(`[featureFlags] read "${key}" before load()`);
  }

  return flags[key] === true;
}
