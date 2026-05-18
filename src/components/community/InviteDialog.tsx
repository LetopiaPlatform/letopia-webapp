import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communitySlug: string;
}

export function InviteDialog({ open, onOpenChange, communitySlug }: InviteDialogProps) {
  const [copied, setCopied] = useState(false);

  const communityLink = `${window.location.origin}/communities/${communitySlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(communityLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-8">
        <DialogHeader className="mt-4">
          <DialogTitle className="text-xl text-center font-semibold">Invite Friends</DialogTitle>
          <DialogDescription className="text-base text-center">
            Share this link with your friends to invite them to the community.
          </DialogDescription>
        </DialogHeader>

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
            onClick={() => onOpenChange(false)}
            className="w-full py-3 flex items-center justify-center bg-gray-100 text-muted-foreground font-medium capitalize rounded-2xl"
          >
            close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
