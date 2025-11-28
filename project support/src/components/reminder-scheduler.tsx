"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPersonalizedReminder } from "@/ai/flows/personalized-reminder-system";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2, CheckCircle, XCircle } from "lucide-react";
import { events } from "@/lib/events-data";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  eventId: z.string().min(1, "Please select an event."),
  userId: z.string().min(1, "User ID is required."),
  preferredChannel: z.enum(['email', 'sms', 'whatsapp']),
  contactInfo: z.string().min(1, "Contact info is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function ReminderScheduler() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: "",
      userId: "user_12345",
      preferredChannel: "email",
      contactInfo: "student@example.com",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    const selectedEvent = events.find(e => e.id === data.eventId);

    if (!selectedEvent) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected event not found.",
        });
        return;
    }

    try {
      const result = await sendPersonalizedReminder({
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        eventTime: new Date(selectedEvent.date).toISOString(),
        userId: data.userId,
        preferredChannel: data.preferredChannel,
        userEmail: data.preferredChannel === 'email' ? data.contactInfo : undefined,
        userPhoneNumber: data.preferredChannel !== 'email' ? data.contactInfo : undefined,
      });

      setResult(result);

    } catch (error) {
      setResult({ success: false, message: "Could not send the reminder. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">AI Reminder Engine</CardTitle>
        <CardDescription>
          Send personalized reminders for event attendees via their preferred channel.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event to send reminders for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredChannel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reminder channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info (Email or Phone)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., student@example.com or +1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Send Reminder
            </Button>
            {result && (
              <div className={`mt-4 flex items-center gap-2 p-3 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <p className="text-sm">{result.message}</p>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
