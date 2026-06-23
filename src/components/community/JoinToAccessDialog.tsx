import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface JoinToAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: () => void;
  isPending?: boolean;
}

export function JoinToAccessDialog({
  open,
  onOpenChange,
  onJoin,
  isPending,
}: JoinToAccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-semibold capitalize text-center">Join Community</DialogTitle>

          <DialogDescription className="text-base text-center">
            Join community first to access resources.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl bg-muted text-muted-foreground"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onJoin}
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-primary text-white disabled:opacity-50"
          >
            {isPending ? 'Joining...' : 'Join Community'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
