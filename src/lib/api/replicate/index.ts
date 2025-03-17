import Replicate from 'replicate';
import { isApiEnabled } from '@/config/api-config';

let replicateClient: Replicate | null = null;

export function getReplicateClient() {
  if (!isApiEnabled('replicate')) {
    throw new Error('Replicate API is not enabled in this project');
  }
  
  if (!replicateClient) {
    const apiKey = process.env.REPLICATE_API_KEY;
    if (!apiKey) {
      throw new Error('REPLICATE_API_KEY is not defined');
    }
    
    replicateClient = new Replicate({
      auth: apiKey
    });
  }
  
  return replicateClient;
}

export async function generateImage(prompt: string, options: { width?: number; height?: number } = {}) {
  const client = getReplicateClient();
  
  const output = await client.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: prompt,
        width: options.width || 1024,
        height: options.height || 1024,
      }
    }
  );
  
  return output;
} 