import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // By default, we will use the gemini-pro-vision model.
  model: 'googleai/gemini-pro-vision',
});
