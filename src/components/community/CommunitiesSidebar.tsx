import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMyCommunities } from '@/hooks/useCommunities';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function CommunitiesSidebar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const { data } = useMyCommunities({ enabled: isAuthenticated });
  const joined = data?.data ?? [];
  const [communitiesOpen, setCommunitiesOpen] = useState(true);

  return (
    <aside className="flex h-full w-full flex-col items-center gap-8.75 bg-white pt-6 pr-6 pb-8 pl-4">
      <Button
        type="button"
        onClick={() => navigate('/communities/create')}
        className="h-11 w-full shrink-0 gap-2 rounded-xl bg-communities-accent px-4 text-base font-medium text-communities-accent-foreground hover:bg-communities-accent/90"
      >
        <Plus className="size-4.5" aria-hidden="true" />
        Create Community
      </Button>

      <div className="flex w-full flex-1 min-h-0 flex-col justify-between">
        <nav className="flex flex-col gap-6 overflow-y-auto min-h-0">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setCommunitiesOpen((v) => !v)}
              className="flex h-6 items-center gap-2 text-base font-medium text-communities-text"
              aria-expanded={communitiesOpen}
            >
              <Users className="size-5" aria-hidden="true" />
              <span>My Communities</span>
              {communitiesOpen ? (
                <ChevronDown className="size-5" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-5" aria-hidden="true" />
              )}
            </button>

            {communitiesOpen && isAuthenticated && joined.length > 0 && (
              <ul className="scrollbar-thin ml-2 flex max-h-[220px] flex-col gap-4 overflow-y-auto border-l border-communities-border pl-6">
                {joined.map(({ community }) => (
                  <li key={community.id}>
                    <NavLink
                      to={`/communities/${community.slug}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 text-sm font-normal',
                          isActive
                            ? 'text-communities-text'
                            : 'text-communities-text-secondary hover:text-communities-text'
                        )
                      }
                    >
                      <span className="size-6 shrink-0 overflow-hidden rounded-full bg-communities-placeholder">
                        {community.coverImageUrl && (
                          <img
                            src={community.coverImageUrl}
                            alt=""
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </span>
                      <span className="truncate">{community.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}

            {communitiesOpen && isAuthenticated && joined.length === 0 && (
              <p className="ml-2 border-l border-communities-border pl-6 text-sm font-normal text-communities-text-muted">
                You haven't joined any community yet.
              </p>
            )}
          </div>
        </nav>

        {isAuthenticated && user && (
          <div className="flex shrink-0 items-center gap-4">
            <div className="size-14 shrink-0 overflow-hidden rounded-full bg-communities-placeholder">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-communities-text">{user.fullName}</p>
              <p className="text-sm font-normal text-communities-text-muted">
                {user.role || 'Member'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
