import { Copy, Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { PostSummary } from '@/types/post.types';

type SharePlatform = 'linkedin' | 'email' | 'whatsapp' | 'telegram' | 'x';

interface SharePostDialogProps {
  post: PostSummary;
  communitySlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SharePostDialog({ post, communitySlug, open, onOpenChange }: SharePostDialogProps) {
  const [copied, setCopied] = useState(false);

  const postLink = `${window.location.origin}/communities/${communitySlug}/posts/${post.id}`;
  const encodedLink = encodeURIComponent(postLink);
  const encodedText = encodeURIComponent(
    `Check out this post: "${post.title}" in ${communitySlug}`
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToSocial = (platform: SharePlatform) => {
    const urls: Record<SharePlatform, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      email: `mailto:?subject=${encodedText}&body=${encodedLink}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedLink}`,
      telegram: `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`,
      x: `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedText}`,
    };

    const url = urls[platform];
    window.open(url, '_blank');
  };

  const socialButtons: { platform: SharePlatform; label: string; bg: string; icon: string }[] = [
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      bg: 'bg-[#447DBE]',
      icon: '/icons/social/linkedin-02.svg',
    },
    { platform: 'email', label: 'Email', bg: 'bg-[#D91122]', icon: '/icons/social/mail-01.svg' },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      bg: 'bg-[#3EA616]',
      icon: '/icons/social/whatsapp.svg',
    },
    {
      platform: 'telegram',
      label: 'Telegram',
      bg: 'bg-[#58A5D5]',
      icon: '/icons/social/telegram.svg',
    },
    { platform: 'x', label: 'X', bg: 'bg-[#2A2B34]', icon: '/icons/social/Twitter-X.svg' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-8 w-sm md:w-md">
        <DialogHeader className="mt-4">
          <DialogTitle className="text-xl text-center font-semibold flex items-center justify-center gap-2">
            <Share2 className="size-5" />
            Share Post
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            Share "{post.title}" with others
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Copy Link */}
          <div>
            <p className="text-sm font-medium text-[#524B56] mb-2">Copy Link</p>
            <div className="flex items-center gap-2 p-3 bg-[#F5F3F7] rounded-lg border border-[#E8DFF0]">
              <input
                type="text"
                value={postLink}
                readOnly
                className="flex-1 outline-none bg-transparent text-xs sm:text-sm text-[#524B56] truncate"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-[#E8DFF0] rounded-lg transition-colors shrink-0"
                aria-label="Copy link to clipboard"
              >
                {copied ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <Copy className="size-5 text-[#6F6673]" />
                )}
              </button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-2">Link copied to clipboard!</p>}
          </div>

          {/* Social Share */}
          <div>
            <p className="text-sm font-medium text-[#524B56] mb-2">Share To</p>
            <div className="flex items-center gap-3 overflow-x-auto w-full scrollbar-hide">
              {socialButtons.map(({ platform, label, bg, icon }) => (
                <button
                  key={platform}
                  onClick={() => handleShareToSocial(platform)}
                  className={`flex items-center justify-center p-2.5 rounded-xl shrink-0 ${bg}`}
                  aria-label={`Share on ${label}`}
                >
                  <img src={icon} alt={label} className="size-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-3 flex items-center justify-center bg-[#F5F3F7] text-[#524B56] font-medium capitalize rounded-2xl hover:bg-[#E8DFF0] transition-colors"
          >
            close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
