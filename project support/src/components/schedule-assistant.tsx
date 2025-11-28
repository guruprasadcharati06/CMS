"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestOptimalEventTime, type SuggestOptimalEventTimeOutput } from "@/ai/flows/smart-schedule-assistant";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  facultyAvailability: z.string().min(1, "Faculty availability is required."),
  studentAvailability: z.string().min(1, "Student availability is required."),
  eventDuration: z.string().min(1, "Event duration is required."),
  dateTimeConstraints: z.string().optional(),
  otherConstraints: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ScheduleAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalEventTimeOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyAvailability: "Weekdays 9 AM - 5 PM, not available on Wednesdays.",
      studentAvailability: "Most students available after 3 PM on weekdays. Some have evening classes on Tuesdays.",
      eventDuration: "2 hours",
      dateTimeConstraints: "Must be in the next two weeks.",
      otherConstraints: "The main auditorium is booked this Friday.",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestOptimalEventTime({
        ...data,
        dateTimeConstraints: data.dateTimeConstraints || "None",
        otherConstraints: data.otherConstraints || "None",
      });
      setResult(suggestion);
    } catch (error) {
      console.error("Error getting suggestion:", error);
      // Handle error display to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Scheduling Assistant</CardTitle>
          <CardDescription>
            Provide availability details and constraints to find the perfect time for your event.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="facultyAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty Availability</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Prof. Smith is free on Mondays and Fridays..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Availability</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Students are generally free after 4 PM..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1.5 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTimeConstraints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date/Time Constraints (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Must be a weekday afternoon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherConstraints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Constraints (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Venue availability, holidays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Suggest Time
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">Finding the best time...</p>
          </div>
        )}
        {result && (
          <Card className="w-full bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-accent">Optimal Time Found!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Suggested Date & Time</p>
                <p className="text-lg text-primary">{result.suggestedDateTime}</p>
              </div>
              <div>
                <p className="font-semibold">Reasoning</p>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
