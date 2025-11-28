import { VenueAllocator } from "@/components/venue-allocator";

export default function VenuesPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold tracking-tight">Intelligent Venue Allocation</h1>
      <p className="text-muted-foreground mb-8">Get AI-powered recommendations for the best event space.</p>
      <VenueAllocator />
    </div>
  );
}
