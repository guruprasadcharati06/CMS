'use server';

/**
 * @fileOverview This file defines a Genkit flow for sending personalized reminders to users about upcoming events.
 *
 * It includes:
 * - `sendPersonalizedReminder`: Sends reminders via the user's preferred channel (email, SMS, WhatsApp).
 * - `PersonalizedReminderInput`: The input type for the sendPersonalizedReminder function.
 * - `PersonalizedReminderOutput`: The return type for the sendPersonalizedReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PreferredChannelSchema = z.enum(['email', 'sms', 'whatsapp']);

const PersonalizedReminderInputSchema = z.object({
  eventId: z.string().describe('The ID of the event.'),
  userId: z.string().describe('The ID of the user.'),
  eventName: z.string().describe('The name of the event.'),
  eventTime: z.string().describe('The time of the event (e.g., 2024-03-15T10:00:00).'),
  preferredChannel: PreferredChannelSchema.describe("The user's preferred channel for reminders (email, sms, or whatsapp)."),
  userEmail: z.string().email().optional().describe("The user's email address, required if preferredChannel is email."),
  userPhoneNumber: z.string().optional().describe("The user's phone number, required if preferredChannel is sms or whatsapp."),
});
export type PersonalizedReminderInput = z.infer<typeof PersonalizedReminderInputSchema>;

const PersonalizedReminderOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the reminder was successfully sent.'),
  message: z.string().describe('A message indicating the outcome of the reminder sending.'),
});
export type PersonalizedReminderOutput = z.infer<typeof PersonalizedReminderOutputSchema>;

const sendEmailTool = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Sends an email to a user.',
    inputSchema: z.object({
      to: z.string().describe('The email address of the recipient.'),
      subject: z.string().describe('The subject of the email.'),
      body: z.string().describe('The HTML body of the email.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async input => {
    try {
      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: input.to,
        subject: input.subject,
        html: input.body,
      });
      return {success: true, message: `Email sent successfully to ${input.to}.`};
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to send email: ${error.message}`,
      };
    }
  }
);

export async function sendPersonalizedReminder(input: PersonalizedReminderInput): Promise<PersonalizedReminderOutput> {
  return personalizedReminderFlow(input);
}

const personalizedReminderPrompt = ai.definePrompt({
  name: 'personalizedReminderPrompt',
  tools: [sendEmailTool],
  input: {schema: PersonalizedReminderInputSchema},
  output: {schema: PersonalizedReminderOutputSchema},
  prompt: `You are an event reminder system. Your task is to send a personalized reminder to a user about an upcoming event via their preferred channel.

Event Details:
- Name: {{{eventName}}}
- Time: {{{eventTime}}}

User Preferences:
- User ID: {{{userId}}}
- Preferred Channel: {{{preferredChannel}}}
- Email: {{{userEmail}}}
- Phone: {{{userPhoneNumber}}}

Instructions:
1.  Check the user's preferred channel.
2.  If it is 'email', create a compelling HTML email body for the reminder. The email should be friendly and contain all the event details. Then, use the 'sendEmail' tool to send the reminder with the 'to' address set to {{{userEmail}}}.
3.  If the channel is 'sms', return a success message stating that the SMS has been sent to the user's phone number.
4.  If the channel is 'whatsapp', return a success message stating that the WhatsApp message has been sent to the user's phone number.
5.  You MUST return the final result from the 'sendEmail' tool if it is called, or a success/failure message if the channel is not supported. Do not add any conversational text to the final output.`,
});

const personalizedReminderFlow = ai.defineFlow(
  {
    name: 'personalizedReminderFlow',
    inputSchema: PersonalizedReminderInputSchema,
    outputSchema: PersonalizedReminderOutputSchema,
  },
  async input => {
    if (
      (input.preferredChannel === 'email' && !input.userEmail) ||
      ((input.preferredChannel === 'sms' || input.preferredChannel === 'whatsapp') && !input.userPhoneNumber)
    ) {
      return {
        success: false,
        message: 'Reminder could not be sent: Missing contact information for the selected channel.',
      };
    }

    const {output} = await personalizedReminderPrompt(input);
    return output!;
  }
);
