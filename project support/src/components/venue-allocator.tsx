"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendVenue, type VenueRecommendationOutput } from "@/ai/flows/venue-recommendation-engine";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  expectedAttendance: z.coerce.number().min(1, "Expected attendance is required."),
  equipmentNeeds: z.string().min(1, "Equipment needs are required."),
  historicalData: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function VenueAllocator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VenueRecommendationOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expectedAttendance: 120,
      equipmentNeeds: "Projector, microphone, and a sound system for background music.",
      historicalData: "Last year's tech seminar had 100 attendees and was held in Lecture Hall A, which felt a bit cramped.",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const recommendation = await recommendVenue({
        ...data,
        historicalData: data.historicalData || "None",
      });
      setResult(recommendation);
    } catch (error) {
      console.error("Error getting recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Venue Allocator</CardTitle>
          <CardDescription>
            Describe your event needs to get an intelligent venue recommendation.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="expectedAttendance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Attendance</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Needs</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Projector, whiteboard, sound system" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Data (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Past attendance, venue feedback" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Recommend Venue
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing best-fit venues...</p>
          </div>
        )}
        {result && (
          <Card className="w-full bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-accent">Venue Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Recommended Venue</p>
                <p className="text-lg text-primary">{result.venueName}</p>
              </div>
               <div>
                <p className="font-semibold">Suitability Score: {result.suitabilityScore}/100</p>
                <Progress value={result.suitabilityScore} className="w-full h-2 mt-2" />
              </div>
              <div>
                <p className="font-semibold">Justification</p>
                <p className="text-muted-foreground">{result.justification}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
