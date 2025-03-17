import { isApiEnabled } from '@/config/api-config';

// Interface to match what we need from the Elevenlabs SDK
interface ElevenlabsClient {
  textToSpeech: (options: {
    text: string;
    voice_id: string;
    model_id?: string;
  }) => Promise<ArrayBuffer>;
}

let elevenlabsClient: ElevenlabsClient | null = null;

// Browser-compatible version of the Elevenlabs client
class BrowserElevenlabsClient implements ElevenlabsClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async textToSpeech(options: {
    text: string;
    voice_id: string;
    model_id?: string;
  }): Promise<ArrayBuffer> {
    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${options.voice_id}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: options.text,
        model_id: options.model_id || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Elevenlabs API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.arrayBuffer();
  }
}

export function getElevenlabsClient() {
  if (!isApiEnabled('elevenlabs')) {
    throw new Error('Elevenlabs API is not enabled in this project');
  }
  
  if (!elevenlabsClient) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not defined');
    }
    
    // Use browser-compatible client for browser environments
    if (typeof window !== 'undefined') {
      elevenlabsClient = new BrowserElevenlabsClient(apiKey);
    } else {
      // In Node.js environment, use the official SDK
      // Import dynamically to avoid issues in browser
      const { Elevenlabs } = require('elevenlabs-node');
      elevenlabsClient = new Elevenlabs({
        apiKey: apiKey
      });
    }
  }
  
  return elevenlabsClient;
}

export async function textToSpeech(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
  const client = getElevenlabsClient();
  
  if (!client) {
    throw new Error('Failed to initialize Elevenlabs client');
  }
  
  const audioData = await client.textToSpeech({
    text,
    voice_id: voiceId,
    model_id: 'eleven_multilingual_v2'
  });
  
  return audioData;
} 