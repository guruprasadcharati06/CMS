"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { predictAttendance, type PredictAttendanceOutput } from "@/ai/flows/attendance-prediction-model";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Users } from "lucide-react";

const formSchema = z.object({
  eventDescription: z.string().min(1, "Event description is required."),
  expectedAttendance: z.coerce.number().min(1, "Number of registrations is required."),
  historicalAttendanceData: z.string().min(1, "Historical data is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function AttendancePredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictAttendanceOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDescription: "A weekend workshop on generative AI for students from all departments.",
      expectedAttendance: 250,
      historicalAttendanceData: "Similar workshops on weekends usually have a 70-80% show-up rate. Last year's blockchain workshop had 300 sign-ups and 230 attendees.",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const prediction = await predictAttendance(data);
      setResult(prediction);
    } catch (error) {
      console.error("Error getting prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Attendance Prediction Model</CardTitle>
          <CardDescription>
            Forecast actual attendance based on registration patterns and historical data.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="eventDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Annual tech conference..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedAttendance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Registrations</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalAttendanceData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Attendance Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Similar events show a 75% turnout..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Predict Attendance
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">Running prediction model...</p>
          </div>
        )}
        {result && (
          <Card className="w-full bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-accent">Attendance Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-4">
                <Users className="h-12 w-12 text-primary" />
                <div>
                  <p className="text-4xl font-bold">{result.predictedAttendance}</p>
                  <p className="text-sm text-muted-foreground">Predicted Attendees</p>
                </div>
              </div>
               <div className="text-left pt-4">
                <p className="font-semibold">Rationale</p>
                <p className="text-muted-foreground">{result.rationale}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
