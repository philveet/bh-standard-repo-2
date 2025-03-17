import { Deepgram } from '@deepgram/sdk';
import { isApiEnabled } from '@/config/api-config';

let deepgramClient: Deepgram | null = null;

export function getDeepgramClient() {
  if (!isApiEnabled('deepgram')) {
    throw new Error('Deepgram API is not enabled in this project');
  }
  
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is not defined');
    }
    
    deepgramClient = new Deepgram(apiKey);
  }
  
  return deepgramClient;
}

export async function transcribeAudio(audioFile: File) {
  const client = getDeepgramClient();
  
  // Convert ArrayBuffer to Buffer for Deepgram API
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const audioSource = {
    buffer,
    mimetype: audioFile.type,
  };
  
  const response = await client.transcription.preRecorded(audioSource, {
    punctuate: true,
    model: 'nova',
  });
  
  return response.results?.channels[0]?.alternatives[0]?.transcript || '';
} 