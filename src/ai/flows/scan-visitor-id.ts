'use server';

/**
 * @fileOverview This file defines a Genkit flow for scanning visitor IDs using OCR.
 *
 * The flow takes an image of a visitor's ID as input and returns the extracted information.
 * It uses the google-cloud-vision tool to perform OCR on the image.
 *
 * @exports {
 *   scanVisitorId,
 *   ScanVisitorIdInput,
 *   ScanVisitorIdOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ScanVisitorIdInputSchema = z.object({
  idDataUri: z
    .string()
    .describe(
      'A photo of a visitor ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the backslashes, it's part of the string content
    ),
});
export type ScanVisitorIdInput = z.infer<typeof ScanVisitorIdInputSchema>;

const ScanVisitorIdOutputSchema = z.object({
  name: z.string().describe('The name of the visitor.'),
  idNumber: z.string().describe('The ID number of the visitor.'),
  address: z.string().describe('The address of the visitor.'),
});
export type ScanVisitorIdOutput = z.infer<typeof ScanVisitorIdOutputSchema>;

export async function scanVisitorId(input: ScanVisitorIdInput): Promise<ScanVisitorIdOutput> {
  return scanVisitorIdFlow(input);
}

const scanVisitorIdPrompt = ai.definePrompt({
  name: 'scanVisitorIdPrompt',
  input: {schema: ScanVisitorIdInputSchema},
  output: {schema: ScanVisitorIdOutputSchema},
  prompt: `You are an OCR scanner that extracts data from the image of a visitor's ID.  Please extract the visitor's name, id number, and address.

  ID Image: {{media url=idDataUri}}
  `,
});

const scanVisitorIdFlow = ai.defineFlow(
  {
    name: 'scanVisitorIdFlow',
    inputSchema: ScanVisitorIdInputSchema,
    outputSchema: ScanVisitorIdOutputSchema,
  },
  async input => {
    const {output} = await scanVisitorIdPrompt(input);
    return output!;
  }
);
