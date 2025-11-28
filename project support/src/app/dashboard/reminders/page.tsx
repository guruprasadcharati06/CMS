import { ReminderScheduler } from "@/components/reminder-scheduler";

export default function RemindersPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold tracking-tight">AI-Powered Reminders</h1>
      <p className="text-muted-foreground mb-8">Keep your attendees engaged with smart, automated reminders.</p>
      <ReminderScheduler />
    </div>
  );
}
