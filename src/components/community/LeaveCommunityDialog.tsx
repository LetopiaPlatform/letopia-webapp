import { AlertTriangle, Copy, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { MemberAvatar } from './MemberAvatar';
import { useCurrentUser } from '@/hooks/useUser';
import type { Member } from '@/types/community.types';

type DialogStep = 'confirm' | 'transfer' | 'invite';

interface LeaveCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner: boolean;
  isOnlyMember: boolean;
  onLeave: () => void;
  isPending?: boolean;
  communityId?: string;
  communitySlug: string;
  members?: Member[];
  onTransferOwnership?: (memberId: string) => void;
  isTransferring?: boolean;
}

export function LeaveCommunityDialog({
  open,
  onOpenChange,
  isOwner,
  isOnlyMember,
  onLeave,
  isPending,
  communitySlug,
  members,
  onTransferOwnership,
  isTransferring = false,
}: LeaveCommunityDialogProps) {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.data?.id;

  const filteredMembers = useMemo(() => {
    return (members ?? []).filter((m) => m.userId !== currentUserId);
  }, [members, currentUserId]);

  const [step, setStep] = useState<DialogStep>('confirm');
  const [copied, setCopied] = useState(false);

  const showInviteFriends = isOnlyMember;
  const showTransferOwnership = isOwner && !isOnlyMember;

  const handleOpenChange = (open: boolean) => {
    if (!open) setStep('confirm');
    onOpenChange(open);
  };

  const communityLink = `${window.location.origin}/communities/${communitySlug}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(communityLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransferClick = (memberId: string) => {
    onTransferOwnership?.(memberId);
    onOpenChange(false);
  };

  const titles: Record<DialogStep, string> = {
    confirm: showTransferOwnership
      ? 'Transfer Ownership Before Leaving'
      : showInviteFriends
        ? 'Invite Members to Your Community'
        : 'Are you sure you want to leave this community?',
    transfer: 'Transfer Ownership',
    invite: 'Invite Friends',
  };

  const descriptions: Record<DialogStep, string> = {
    confirm: showTransferOwnership
      ? "You're the Owner of this community. Transfer ownership to another member before leaving."
      : showInviteFriends
        ? "You're the only member in this community. Invite friends to join before leaving."
        : "You'll lose access to all tasks, discussions, and resources in this community.",
    transfer: 'Select a member to transfer the community ownership to.',
    invite: 'Share this link with your friends to invite them to the community.',
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-8">
        <DialogHeader className="mt-4">
          <DialogTitle className="text-xl text-center font-semibold flex flex-col items-center gap-5">
            <span className="flex items-center justify-center bg-destructive/13 p-4 rounded-full">
              <AlertTriangle className="text-destructive size-8" />
            </span>
            {titles[step]}
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            {descriptions[step]}
          </DialogDescription>
        </DialogHeader>

        {/* confirm */}
        {step === 'confirm' && (
          <DialogFooter className="w-full md:grid grid-cols-2 gap-4 mt-3">
            <button
              onClick={() => handleOpenChange(false)}
              className="px-5 py-3 flex items-center justify-center bg-gray-100 text-muted-foreground font-medium capitalize rounded-2xl"
            >
              cancel
            </button>
            <button
              onClick={() => {
                if (showInviteFriends) setStep('invite');
                else if (showTransferOwnership) setStep('transfer');
                else onLeave();
              }}
              className="px-5 py-3 flex items-center justify-center text-white font-medium capitalize rounded-2xl bg-destructive"
            >
              {isPending
                ? 'Leaving...'
                : showInviteFriends
                  ? 'Invite Friends'
                  : showTransferOwnership
                    ? 'Transfer Ownership'
                    : 'leave'}
            </button>
          </DialogFooter>
        )}

        {/* transfer */}
        {step === 'transfer' && (
          <div className="mt-3">
            <div className="overflow-y-auto max-h-[calc(95vh-350px)] space-y-2">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No members found</p>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.userId}
                    onClick={() => handleTransferClick(member.userId)}
                    disabled={isTransferring}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MemberAvatar avatarUrl={member.avatarUrl} fullName={member.fullName} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => setStep('confirm')}
              className="mt-4 w-full py-3 flex items-center justify-center bg-gray-100 text-muted-foreground font-medium capitalize rounded-2xl"
            >
              back
            </button>
          </div>
        )}

        {/* invite */}
        {step === 'invite' && (
          <div className="mt-3 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <input
                type="text"
                value={communityLink}
                readOnly
                className="flex-1 outline-none bg-transparent text-sm text-gray-700 break-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
              >
                {copied ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <Copy className="size-5 text-gray-600" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 text-center">Link copied to clipboard!</p>
            )}
            <button
              onClick={() => setStep('confirm')}
              className="w-full py-3 flex items-center justify-center bg-gray-100 text-muted-foreground font-medium capitalize rounded-2xl"
            >
              back
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
