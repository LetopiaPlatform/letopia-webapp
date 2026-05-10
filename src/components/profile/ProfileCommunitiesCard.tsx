import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMyCommunities } from '@/hooks/useCommunities';
import { getInitials, formatCount } from '@/lib/utils';
import { PROFILE_STRINGS } from '@/lib/constants';

const MAX_VISIBLE = 5;

export function ProfileCommunitiesCard() {
  const { data, isLoading } = useMyCommunities();
  const communities = data?.data ?? [];
  const visible = communities.slice(0, MAX_VISIBLE);
  const hasOverflow = communities.length > MAX_VISIBLE;

  return (
    <section
      aria-label={PROFILE_STRINGS.SECTIONS.MY_COMMUNITIES}
      className="flex flex-col rounded-3xl bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-base font-semibold text-[#1A1A1A]">
          {PROFILE_STRINGS.SECTIONS.MY_COMMUNITIES}
        </h3>
        {!isLoading && (
          <span className="shrink-0 text-xs text-[#6B7280]">{communities.length}</span>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[10px] bg-zinc-100" />
          ))}
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {visible.length === 0 && (
              <li className="text-sm text-[#6B7280]">{PROFILE_STRINGS.EMPTY.NO_COMMUNITIES}</li>
            )}
            {visible.map(({ community }) => (
              <li key={community.id}>
                <Link
                  to={`/communities/${community.slug ?? community.id}`}
                  className="flex h-20 items-center gap-3 rounded-[10px] bg-zinc-100 p-3 outline-[0.8px] -outline-offset-[0.8px] outline-gray-200 transition-colors hover:bg-zinc-200/70"
                >
                  <Avatar className="size-12 shrink-0">
                    <AvatarImage src={community.iconUrl ?? undefined} alt={community.name} />
                    <AvatarFallback className="bg-[#824892]/10 text-[#824892] text-xs font-semibold">
                      {getInitials(community.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-base font-medium leading-6 text-[#1A1A1A]">
                      {community.name}
                    </p>
                    <p className="text-sm font-normal leading-5 text-[#6B7280]">
                      {formatCount(community.memberCount)} members
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {hasOverflow && (
            <div className="mt-4 flex justify-center">
              <Link
                to="/communities"
                className="text-sm font-medium text-[#824892] hover:underline"
              >
                Show all ({communities.length})
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
