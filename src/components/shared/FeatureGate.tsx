import type { ReactNode } from 'react';
import { isFeatureEnabled, type FeatureKey } from '@/lib/featureFlags';

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders `children` only when the named feature flag is enabled.
 * Otherwise renders `fallback` (defaults to <ComingSoon />).
 */
export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  if (isFeatureEnabled(feature)) return <>{children}</>;
  return <>{fallback ?? <ComingSoon />}</>;
}

interface ComingSoonProps {
  title?: string;
  message?: string;
}

export function ComingSoon({
  title = 'Coming soon',
  message = 'This feature is under construction. Check back soon!',
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-[#1A1A1A]">{title}</h2>
      <p className="text-sm text-[#6B7280]">{message}</p>
    </div>
  );
}
