import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

interface QrCheckinModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
}

export function QrCheckinModal({ isOpen, onOpenChange, eventName }: QrCheckinModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Check-in for {eventName}</DialogTitle>
          <DialogDescription>
            Scan this QR code with your mobile device to check in to the event.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <Image
            src="https://picsum.photos/seed/99/300/300"
            alt="QR Code"
            width={300}
            height={300}
            className="rounded-lg"
            data-ai-hint="qr code"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
