import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useCommunityBySlug, useCommunityMembers, useJoinCommunity } from '@/hooks/useCommunities';
import { AppSidebar } from '@/components/AppSidebar';
import { CommunityNav } from '@/components/community/Communitynav';
import { COMMUNITY_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useCommunityBySlug(slug!);
  const { mutate: joinCommunity, isPending: joinPending } = useJoinCommunity();
  const community = data?.data;
  const navigate = useNavigate();

  const { data: membersData } = useCommunityMembers(
    community?.id ?? '',
    { page: 1, pageSize: 50 },
    { enabled: !!community?.id }
  );
  const members = membersData?.data?.items ?? [];
  const viewerRole = community?.userRole ?? 'Member';

  const handleJoin = () => {
    if (!community) return;
    joinCommunity(community.id, {
      onSuccess: () => {
        navigate(`/communities/${community.slug}/announcements`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Community not found.</p>
      </div>
    );
  }

  return (
    <>
      <AppSidebar />
      <div className="min-h-screen pt-18 md:ml-16 lg:ml-22 px-4 xl:px-6 flex flex-col gap-2 md:gap-4 bg-[#FAF9FB]">
        <div className="w-full h-[15vh] sm:h-[20vh] md:h-[25vh] xl:h-[30vh] overflow-hidden relative rounded-3xl md:rounded-4xl">
          {community.coverImageUrl ? (
            <img
              src={community.coverImageUrl}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/30" />
          )}
          <div
            className="absolute left-3 sm:left-4 md:left-6 bottom-[15%] flex items-center justify-center
      text-xs sm:text-sm md:text-xl xl:text-2xl
      font-medium tracking-wide
      text-white
      px-3 sm:px-4 md:px-6
      py-1.5 sm:py-2 md:py-3
      rounded-full
      bg-white/30 backdrop-blur-2xl backdrop-saturate-150"
          >
            {community.name}
          </div>
        </div>

        {community.isMember ? (
          <div className="lg:hidden px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {COMMUNITY_LINKS.map(({ key, label, icon, activeIcon }) => {
                const href = `/communities/${community.slug}/${key}`;
                const isActive = location.pathname === href;
                return (
                  <button
                    key={key}
                    onClick={() => navigate(href)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium shrink-0',
                      isActive ? 'bg-primary text-white' : 'bg-[#F6F5F6] text-[#261A2B]'
                    )}
                  >
                    <img
                      src={isActive ? activeIcon : icon}
                      alt=""
                      className="size-4"
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="lg:hidden">
            <button
              onClick={handleJoin}
              disabled={joinPending}
              className={cn(
                'w-full bg-primary text-white capitalize text-sm font-medium py-3 gap-2 rounded-xl flex items-center justify-center shrink-0',
                joinPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Plus className="size-4 xl:size-5 stroke-3" />
              {joinPending ? 'Joining...' : 'join community'}
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 xl:gap-6">
          {/* Left nav */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <CommunityNav
                communitySlug={community.slug}
                communityId={community.id}
                members={members}
                viewerRole={viewerRole}
                isOnlyMember={members.length === 1}
                isMember={community.isMember}
              />
            </div>
          </aside>

          {/* Content */}
          <main className="w-full">
            <Outlet context={{ community }} />
          </main>
        </div>
      </div>
    </>
  );
}
