'use server';

/**
 * @fileOverview Suggests optimal event times based on faculty and student availability, minimizing scheduling conflicts.
 *
 * - suggestOptimalEventTime - A function that handles the scheduling process.
 * - SuggestOptimalEventTimeInput - The input type for the suggestOptimalEventTime function.
 * - SuggestOptimalEventTimeOutput - The return type for the suggestOptimalEventTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalEventTimeInputSchema = z.object({
  facultyAvailability: z.string().describe('The availability of the faculty member.'),
  studentAvailability: z.string().describe('The availability of the students.'),
  eventDuration: z.string().describe('The duration of the event (e.g., 1 hour, 2 hours).'),
  dateTimeConstraints: z.string().describe('Constraints on the date and time for the event'),
  otherConstraints: z.string().describe('Other constraints to consider, such as venue availability or holidays.'),
});
export type SuggestOptimalEventTimeInput = z.infer<
  typeof SuggestOptimalEventTimeInputSchema
>;

const SuggestOptimalEventTimeOutputSchema = z.object({
  suggestedDateTime: z
    .string()
    .describe(
      'The suggested date and time for the event, taking into account all availability and constraints.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested date and time, explaining why it is the optimal choice.'
    ),
});
export type SuggestOptimalEventTimeOutput = z.infer<
  typeof SuggestOptimalEventTimeOutputSchema
>;

export async function suggestOptimalEventTime(
  input: SuggestOptimalEventTimeInput
): Promise<SuggestOptimalEventTimeOutput> {
  return suggestOptimalEventTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalEventTimePrompt',
  input: {schema: SuggestOptimalEventTimeInputSchema},
  output: {schema: SuggestOptimalEventTimeOutputSchema},
  prompt: `You are an AI assistant that suggests the best time for an event based on faculty availability, student schedules, and other constraints.

  Given the following information, suggest the optimal date and time for the event:

  Faculty Availability: {{{facultyAvailability}}}
  Student Availability: {{{studentAvailability}}}
  Event Duration: {{{eventDuration}}}
  Date Time Constraints: {{{dateTimeConstraints}}}
  Other Constraints: {{{otherConstraints}}}

  Consider all factors and provide a suggested date and time that minimizes conflicts and maximizes attendance.
  Explain your reasoning for selecting this date and time.
  `,
});

const suggestOptimalEventTimeFlow = ai.defineFlow(
  {
    name: 'suggestOptimalEventTimeFlow',
    inputSchema: SuggestOptimalEventTimeInputSchema,
    outputSchema: SuggestOptimalEventTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
