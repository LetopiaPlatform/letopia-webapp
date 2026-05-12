import { cn } from '@/lib/utils';
import { SOCIAL_OPTIONS, SOCIAL_BG } from '@/lib/constants';
import type { SocialLink } from '@/types/user.types';

interface ProfileSocialLinksProps {
  links: SocialLink[];
}

export function ProfileSocialLinks({ links }: ProfileSocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const opt = SOCIAL_OPTIONS.find(
          (o) => (o.type as string).toLowerCase() === link.provider.toLowerCase()
        );
        if (!opt) return null;
        const bg = SOCIAL_BG[opt.type] ?? 'bg-zinc-700';
        return (
          <a
            key={`${link.provider}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white hover:opacity-90',
              bg
            )}
          >
            <img src={opt.icon} alt="" className="size-3.5 invert brightness-0" />
            {opt.label}
          </a>
        );
      })}
    </div>
  );
}
