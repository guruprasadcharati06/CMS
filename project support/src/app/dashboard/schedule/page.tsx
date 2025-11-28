import { ScheduleAssistant } from "@/components/schedule-assistant";

export default function SchedulePage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold tracking-tight">Smart Scheduling</h1>
      <p className="text-muted-foreground mb-8">Let our AI assistant find the perfect time for your next event.</p>
      <ScheduleAssistant />
    </div>
  );
}
