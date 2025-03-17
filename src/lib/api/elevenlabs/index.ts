import { Elevenlabs } from 'elevenlabs-node';
import { isApiEnabled } from '@/config/api-config';

let elevenlabsClient: Elevenlabs | null = null;

export function getElevenlabsClient() {
  if (!isApiEnabled('elevenlabs')) {
    throw new Error('Elevenlabs API is not enabled in this project');
  }
  
  if (!elevenlabsClient) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not defined');
    }
    
    elevenlabsClient = new Elevenlabs({
      apiKey: apiKey
    });
  }
  
  return elevenlabsClient;
}

export async function textToSpeech(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
  const client = getElevenlabsClient();
  
  const audioData = await client.textToSpeech({
    text,
    voice_id: voiceId,
    model_id: 'eleven_multilingual_v2'
  });
  
  return audioData;
} 