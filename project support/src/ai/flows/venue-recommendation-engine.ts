'use server';
/**
 * @fileOverview This file implements the Genkit flow for the VenueRecommendationEngine story.
 *
 * - recommendVenue - A function that recommends venues based on expected attendance and equipment needs.
 * - VenueRecommendationInput - The input type for the recommendVenue function.
 * - VenueRecommendationOutput - The return type for the recommendVenue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VenueRecommendationInputSchema = z.object({
  expectedAttendance: z
    .number()
    .describe('The expected number of attendees for the event.'),
  equipmentNeeds: z
    .string()
    .describe(
      'A description of the equipment needed for the event, such as projector, sound system, etc.'
    ),
  historicalData: z
    .string()
    .optional()
    .describe(
      'Optional historical data about past event attendance and venue suitability.'
    ),
});
export type VenueRecommendationInput = z.infer<
  typeof VenueRecommendationInputSchema
>;

const VenueRecommendationOutputSchema = z.object({
  venueName: z.string().describe('The name of the recommended venue.'),
  suitabilityScore: z
    .number()
    .describe(
      'A score indicating how suitable the venue is for the event (0-100).'
    ),
  justification: z
    .string()
    .describe(
      'A justification for why the venue is recommended, based on the input criteria.'
    ),
});
export type VenueRecommendationOutput = z.infer<
  typeof VenueRecommendationOutputSchema
>;

export async function recommendVenue(
  input: VenueRecommendationInput
): Promise<VenueRecommendationOutput> {
  return recommendVenueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'venueRecommendationPrompt',
  input: {schema: VenueRecommendationInputSchema},
  output: {schema: VenueRecommendationOutputSchema},
  prompt: `You are an AI venue recommendation engine. Given the expected attendance, equipment needs, and historical data (if available), recommend the most suitable venue and provide a suitability score (0-100) and justification.

Expected Attendance: {{{expectedAttendance}}}
Equipment Needs: {{{equipmentNeeds}}}
Historical Data: {{{historicalData}}}

Consider the following venue options:

- Main Auditorium: Capacity 500, equipped with projector and sound system.
- Lecture Hall A: Capacity 100, equipped with projector.
- Lecture Hall B: Capacity 80, basic audio.
- Conference Room 1: Capacity 50, no equipment.

Based on the input, choose one of the above venues and provide a detailed justification. If there are other venues available, you may suggest a better alternative. If you don't have enough information to make a sound recommendation, be sure to state that in the justification.
`,
});

const recommendVenueFlow = ai.defineFlow(
  {
    name: 'recommendVenueFlow',
    inputSchema: VenueRecommendationInputSchema,
    outputSchema: VenueRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
