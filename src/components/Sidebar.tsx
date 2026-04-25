import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { useMyCommunities } from '@/hooks/useCommunities';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { CreateCommunityDialog } from './community/CreateCommunityDialog';
import { Skeleton } from './ui/skeleton';

function SidebarContentSkeleton() {
  return (
    <>
      <SidebarHeader>
        <div className="hidden md:flex h-8">
          <Skeleton className="w-6 h-6 rounded" />
        </div>
        <hr />
      </SidebarHeader>

      <SidebarContent className="px-0">
        {/* Header */}
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between py-5 px-3 gap-1">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <Skeleton className="size-5 rounded-full shrink-0" />
                <Skeleton className="w-24 h-4 rounded-full" />
                <Skeleton className="size-5 rounded-full shrink-0" />
              </div>
              <Skeleton className="size-4 rounded shrink-0" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* List */}
        <div className="ml-8 border-l-2 px-3">
          <SidebarMenu className="max-h-60 space-y-0.5">
            {[...Array(5)].map((_, i) => (
              <SidebarMenuItem key={i} className="py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <Skeleton className="size-6 rounded-full shrink-0" />
                  <Skeleton className="h-4 rounded-full flex-1" />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </>
  );
}

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const [manualOpen, setManualOpen] = useState(true);
  const [imgError, setImgError] = useState<Set<string>>(new Set());
  const { data, isLoading } = useMyCommunities();

  const collapsibleOpen = (isMobile || state === 'expanded') && manualOpen;

  const handleImgError = (communityId: string) => {
    setImgError((prev) => new Set(prev).add(communityId));
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleCreateCommunity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      setIsDialogOpen(true);
    } else {
      navigate('/login', { state: { redirectTo: '/communities' } });
    }
  };

  if (isLoading) {
    return (
      <>
        <SidebarTrigger className="fixed top-25 left-3 z-50 [&_svg]:size-5 text-[#999999] md:hidden" />
        <Sidebar collapsible="icon" className="bg-background border-none shadow-md">
          <SidebarContentSkeleton />
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <SidebarTrigger className="fixed top-25 left-3 z-50 [&_svg]:size-5 text-[#999999] md:hidden" />

      <Sidebar collapsible="icon" className="bg-background border-none shadow-md">
        <SidebarHeader>
          <div className=" hidden md:flex h-8">
            <SidebarTrigger className="[&_svg]:size-5"></SidebarTrigger>
          </div>
          <hr />
        </SidebarHeader>
        <SidebarContent className="px-0">
          {/* My Communities */}
          <Collapsible open={collapsibleOpen} onOpenChange={setManualOpen}>
            <SidebarMenu>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between py-5 px-3 rounded-none hover:bg-linear-to-r from-brand-200 to-brand-50 transition-all gap-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 ">
                      <img
                        src="/icons/user-group.svg"
                        alt="Communities"
                        className="size-5 shrink-0"
                      />
                      <span className="font-medium text-sm truncate">Communities</span>
                      <img
                        src="/icons/arrow.svg"
                        className={`size-5 cursor-pointer shrink-0 transition-transform ${collapsibleOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                    <button className="shrink-0 p-0.5" onClick={handleCreateCommunity}>
                      <Plus className="size-4 cursor-pointer " />
                    </button>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </SidebarMenu>

            <CollapsibleContent className="ml-8 border-l-2 px-3">
              <SidebarMenu className="max-h-60 overflow-y-auto scrollbar-hide">
                {!data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/assets/no-communities.svg"
                      alt="No communities"
                      className="size-30"
                    />
                    <span className="text-primary text-sm font-medium mt-1">
                      No Joined Communities
                    </span>
                    <p className="text-muted-foreground text-xs text-center mt-1">
                      Discover communities and connect with people!
                    </p>
                  </div>
                ) : (
                  data.data.map((item) => (
                    <SidebarMenuItem key={item.community.id} className="py-0.5">
                      <SidebarMenuButton asChild className="hover:bg-primary/20">
                        <Link to={`/communities/${item.community.slug}`} className="w-full">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <div className="size-6 rounded-full bg-linear-to-tl from-[#814698] to-[#4C88C1] shrink-0 overflow-y-hidden">
                              {item.community.coverImageUrl && !imgError.has(item.community.id) ? (
                                <img
                                  src={item.community.coverImageUrl ?? ''}
                                  alt={item.community.name}
                                  className="size-6 rounded-full object-cover"
                                  onError={() => handleImgError(item.community.id)}
                                />
                              ) : (
                                <div className="size-6 flex items-center justify-center text-white font-agbalumo text-xs">
                                  {item.community.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-600 truncate text-sm">
                              {item.community.name}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarContent>
      </Sidebar>

      <CreateCommunityDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
