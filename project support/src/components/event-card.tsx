'use client';

import * as React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { QrCheckinModal } from './qr-checkin-modal';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isQrModalOpen, setQrModalOpen] = React.useState(false);

  return (
    <>
      <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={event.image.url}
              alt={event.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={event.image.hint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl mb-2">{event.title}</CardTitle>
            <Badge variant="secondary">{event.category}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" variant="outline">Register Now</Button>
          <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => setQrModalOpen(true)}>
            <QrCode className="h-5 w-5" />
            <span className="sr-only">QR Check-in</span>
          </Button>
        </CardFooter>
      </Card>
      <QrCheckinModal isOpen={isQrModalOpen} onOpenChange={setQrModalOpen} eventName={event.title} />
    </>
  );
}
