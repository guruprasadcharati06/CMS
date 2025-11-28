'use server';

/**
 * @fileOverview Predicts event attendance from registration patterns to help administrators plan resources effectively.
 *
 * - predictAttendance - Predicts event attendance based on registration data.
 * - PredictAttendanceInput - The input type for the predictAttendance function.
 * - PredictAttendanceOutput - The return type for the predictAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAttendanceInputSchema = z.object({
  eventDescription: z.string().describe('The description of the event.'),
  expectedAttendance: z.number().describe('The number of registrations for the event.'),
  historicalAttendanceData: z.string().describe('Historical registration and attendance data for similar events.'),
});

export type PredictAttendanceInput = z.infer<typeof PredictAttendanceInputSchema>;

const PredictAttendanceOutputSchema = z.object({
  predictedAttendance: z.number().describe('The predicted attendance for the event.'),
  rationale: z.string().describe('The rationale behind the attendance prediction.'),
});

export type PredictAttendanceOutput = z.infer<typeof PredictAttendanceOutputSchema>;

export async function predictAttendance(input: PredictAttendanceInput): Promise<PredictAttendanceOutput> {
  return predictAttendanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAttendancePrompt',
  input: {schema: PredictAttendanceInputSchema},
  output: {schema: PredictAttendanceOutputSchema},
  prompt: `You are an expert event planner. Based on the event description, registration numbers and historical attendance data, predict the likely attendance for the event.

Event Description: {{{eventDescription}}}
Number of Registrations: {{{expectedAttendance}}}
Historical Attendance Data: {{{historicalAttendanceData}}}

Provide a predicted attendance number, and a short rationale for your prediction.
`,
});

const predictAttendanceFlow = ai.defineFlow(
  {
    name: 'predictAttendanceFlow',
    inputSchema: PredictAttendanceInputSchema,
    outputSchema: PredictAttendanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
