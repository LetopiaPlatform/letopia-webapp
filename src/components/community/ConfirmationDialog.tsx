import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { LucideArrowBigLeft } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  communityName: string;
  onNavigate: () => void;
  onClose: () => void;
}

export function ConfirmationDialog({
  isOpen,
  communityName,
  onNavigate,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 rounded-3xl shadow-2xl"
      >
        {/* ── Body ───────────────────────────────────────────── */}
        <div className="p-7 flex flex-col items-center gap-6 bg-white">
          <div className="flex flex-col items-center gap-2 text-center">
            <DialogTitle className="text-xl font-agbalumo text-[#1A1A1A]">
              Community Created! 🎉
            </DialogTitle>
            <DialogDescription className="text-md text-[#6B7280] leading-relaxed">
              <span className="font-semibold text-[#824892]">{communityName}</span> community is
              live. Time to build something great!
            </DialogDescription>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={onNavigate}
              className="w-full h-11 rounded-xl bg-[#824892] hover:bg-[#6f3a80] text-white font-medium transition-colors cursor-pointer"
            >
              Visit Community
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full h-11  text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#f9fafb] font-medium transition-colors cursor-pointer"
            >
              <LucideArrowBigLeft />
              Back to Communities
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
