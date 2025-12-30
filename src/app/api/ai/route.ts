import { genkit } from 'genkit';
import '@/ai/flows/scan-visitor-id';

// genkit() expects options in the type definitions; pass an empty options object
// and cast to any to preserve the runtime behavior used previously.
export const { POST } = genkit({} as any);
