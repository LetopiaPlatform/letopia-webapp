import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthPageLayoutProps {
  children: ReactNode;
  /** Max width of the centered card container. Defaults to 740px (Figma). */
  maxWidthClassName?: string;
}

/**
 * Shared layout for auth pages (verify email, forgot password, etc.).
 *
 * Handles:
 * - Viewport centering below the 72px navbar (h-18)
 * - Decorative cubes anchored to a centered 1440px Figma frame on lg+
 * - Decorative cubes anchored to the card on sm/md (hidden on mobile)
 *
 * Usage:
 *   <AuthPageLayout>
 *     <GlassCard>...form content...</GlassCard>
 *   </AuthPageLayout>
 */
export function AuthPageLayout({
  children,
  maxWidthClassName = 'max-w-[740px]',
}: AuthPageLayoutProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-4 py-8">
      {/* lg+: a 1440×1024 Figma frame centered in the viewport (both axes).
          Cubes are absolutely positioned inside this fixed-size box, so their
          position relative to the centered card never changes when the
          viewport width or height changes. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[1024px] w-[1440px] -translate-x-1/2 -translate-y-1/2 lg:block">
        <img
          src="/assets/cube-of-squares-block.svg"
          alt=""
          aria-hidden="true"
          className="absolute"
          style={{ left: 32, top: 390, width: 736, height: 638 }}
        />
        <img
          src="/assets/small-cube.svg"
          alt=""
          aria-hidden="true"
          className="absolute rotate-180"
          style={{ left: 628, top: 190, width: 168, height: 151 }}
        />
        <img
          src="/assets/top-cube.svg"
          alt=""
          aria-hidden="true"
          className="absolute"
          style={{
            left: 700,
            top: -85,
            width: 207,
            height: 206,
            transform: 'rotate(148.49deg)',
          }}
        />
      </div>

      {/* Card wrapper — sm/md cubes are anchored here so they stay tethered
          to the card regardless of viewport height. */}
      <div className={cn('relative w-full', maxWidthClassName)}>
        <img
          src="/assets/cube-of-squares-block.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute hidden sm:block lg:hidden
                     -bottom-24 -left-48 w-[380px] opacity-50
                     md:-bottom-32 md:-left-40 md:w-[520px] md:opacity-70"
        />
        <img
          src="/assets/small-cube.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute hidden rotate-180 sm:block lg:hidden
                     -top-20 -right-4 w-[110px] opacity-60
                     md:-top-24 md:-right-6 md:w-[140px] md:opacity-80"
        />

        {children}
      </div>
    </div>
  );
}
