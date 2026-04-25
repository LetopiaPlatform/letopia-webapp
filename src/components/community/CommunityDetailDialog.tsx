import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCommunityBySlug, useJoinCommunity, useLeaveCommunity } from '@/hooks/useCommunities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, LogOut, Lock, Users, Loader2 } from 'lucide-react';
import { formatNumberCount } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface CommunityDetailDialogProps {
  slug: string | null;
  onClose: () => void;
}

export function CommunityDetailDialog({ slug, onClose }: CommunityDetailDialogProps) {
  const { data, isLoading } = useCommunityBySlug(slug!, {
    enabled: !!slug,
  });
  const community = data?.data;

  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { mutate: join, isPending: isJoining } = useJoinCommunity();
  const { mutate: leave, isPending: isLeaving } = useLeaveCommunity();
  const [imgError, setImgError] = useState(false);

  const handleJoin = () => {
    if (!community) return;
    if (isAuthenticated) {
      join(community.id);
    } else {
      navigate('/login', { state: { redirectTo: `/communities/${community.slug}` } });
    }
  };

  return (
    <Dialog open={!!slug} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-208.5 sm:max-w-208.5 max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-3xl *:data-[slot=dialog-close]:z-10">
        {isLoading ? (
          <DialogDetailSkeleton />
        ) : !community ? (
          <div className="p-8 text-center">
            <DialogHeader>
              <DialogTitle>Not found</DialogTitle>
              <DialogDescription>This community doesn't exist.</DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            {/* Cover image */}
            <div className="w-full h-67.75 overflow-hidden bg-linear-to-tl from-[#814698] to-[#4C88C1] rounded-t-3xl">
              {community.coverImageUrl && !imgError && (
                <img
                  src={community.coverImageUrl}
                  alt={community.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Body */}
            <div className="px-6 pt-4 pb-6 bg-background rounded-b-3xl flex flex-col sm:flex-row items-start gap-4">
              {/* Left column: badge, title, description */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                {/* Badge + member count */}
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#834496] hover:bg-[#6e3a7e] text-white rounded-xl px-2 py-1 text-xs font-medium">
                    {community.subCategoryName}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Users className="size-5" />
                    <span>{formatNumberCount(community.memberCount)} Members</span>
                  </div>
                </div>

                {/* Title */}
                <DialogHeader className="gap-0">
                  <DialogTitle className="text-4xl font-bold leading-10">
                    {community.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Description */}
                <DialogDescription className="text-lg font-normal leading-7.5 text-muted-foreground">
                  {community.description}
                </DialogDescription>
              </div>

              {/* Right column: join button + rules */}
              <div className="w-full sm:w-74.75 shrink-0 flex flex-col gap-4">
                {/* Join / Leave */}
                {community.isMember ? (
                  <Button
                    variant="outline"
                    onClick={() => leave(community.id)}
                    disabled={isLeaving}
                    className="w-full h-12.5 rounded-xl text-lg font-medium"
                  >
                    {isLeaving ? (
                      <Loader2 className="size-4.5 animate-spin" />
                    ) : (
                      <LogOut className="size-4.5" />
                    )}
                    Leave Community
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full h-12.5 rounded-xl text-lg font-medium"
                  >
                    {isJoining ? (
                      <Loader2 className="size-4.5 animate-spin" />
                    ) : community.isPrivate ? (
                      <Lock className="size-4.5" />
                    ) : (
                      <Plus className="size-4.5" />
                    )}
                    {community.isPrivate ? 'Request to Join' : 'Join Community'}
                  </Button>
                )}

                {/* Rules card */}
                {community.rules.length > 0 && (
                  <div className="bg-[#F7F7F7] dark:bg-muted rounded-xl px-4 pt-4 pb-2 flex flex-col gap-1.25">
                    <h3 className="text-lg font-bold leading-7">Community Rules</h3>
                    {community.rules.map((rule, i) => (
                      <p
                        key={i}
                        className="text-base font-normal leading-7.5 text-muted-foreground"
                      >
                        {rule}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DialogDetailSkeleton() {
  return (
    <>
      <Skeleton className="w-full h-67.75 rounded-t-3xl" />
      <div className="px-6 pt-4 pb-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex gap-3">
            <Skeleton className="h-7 w-32 rounded-xl" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-10 w-72" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
        <div className="w-full sm:w-74.75 shrink-0 flex flex-col gap-4">
          <Skeleton className="h-12.5 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}
