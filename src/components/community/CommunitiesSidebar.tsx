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
        className="h-11 w-full gap-2 rounded-xl bg-[#824892] px-4 text-base font-medium text-[#EFEDF1] hover:bg-[#824892]/90"
      >
        <Plus className="size-4.5" aria-hidden="true" />
        Create Community
      </Button>

      <div className="flex w-full flex-1 flex-col justify-between">
        <nav className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setCommunitiesOpen((v) => !v)}
              className="flex h-6 items-center gap-2 text-base font-medium text-[#24252C]"
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
              <ul className="ml-2 flex flex-col gap-4 border-l border-[#EBE6ED] pl-6">
                {joined.map(({ community }) => (
                  <li key={community.id}>
                    <NavLink
                      to={`/communities/${community.slug}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 text-sm font-normal',
                          isActive ? 'text-[#24252C]' : 'text-[#494949] hover:text-[#24252C]'
                        )
                      }
                    >
                      <span className="size-6 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
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
              <p className="ml-2 border-l border-[#EBE6ED] pl-6 text-sm font-normal text-[#9E9E9E]">
                You haven't joined any community yet.
              </p>
            )}
          </div>
        </nav>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="size-14 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
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
              <p className="text-lg font-semibold text-[#24252C]">{user.fullName}</p>
              <p className="text-sm font-normal text-[#9E9E9E]">{user.role || 'Member'}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
