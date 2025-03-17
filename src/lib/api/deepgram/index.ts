import { isApiEnabled } from '@/config/api-config';

// Type definitions to match Deepgram SDK
type DeepgramResponse = {
  results?: {
    channels: Array<{
      alternatives: Array<{
        transcript: string
      }>
    }>
  }
};

type DeepgramOptions = {
  punctuate?: boolean;
  model?: string;
  [key: string]: any;
};

// Interface matching what we need from the Deepgram SDK
interface DeepgramClient {
  transcription: {
    preRecorded: (
      source: { buffer: Buffer | ArrayBuffer, mimetype: string },
      options: DeepgramOptions
    ) => Promise<DeepgramResponse>
  }
}

let deepgramClient: DeepgramClient | null = null;

// Browser-compatible version of the Deepgram client
class BrowserDeepgramClient implements DeepgramClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  transcription = {
    preRecorded: async (
      source: { buffer: Buffer | ArrayBuffer, mimetype: string },
      options: DeepgramOptions
    ): Promise<DeepgramResponse> => {
      // For browser environments, use fetch API
      const endpoint = 'https://api.deepgram.com/v1/listen';
      
      // Convert ArrayBuffer to Blob for fetch
      const blob = new Blob([source.buffer], { type: source.mimetype });
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (options.punctuate) queryParams.append('punctuate', 'true');
      if (options.model) queryParams.append('model', options.model);
      
      // Make the request
      const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': source.mimetype,
        },
        body: blob
      });
      
      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    }
  };
}

export function getDeepgramClient() {
  if (!isApiEnabled('deepgram')) {
    throw new Error('Deepgram API is not enabled in this project');
  }
  
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is not defined');
    }
    
    // Use browser-compatible client
    if (typeof window !== 'undefined') {
      deepgramClient = new BrowserDeepgramClient(apiKey);
    } else {
      // In Node.js environment, use the official SDK
      // Import dynamically to avoid issues in browser
      const { Deepgram } = require('@deepgram/sdk');
      deepgramClient = new Deepgram(apiKey);
    }
  }
  
  return deepgramClient;
}

export async function transcribeAudio(audioFile: File) {
  const client = getDeepgramClient();
  
  if (!client) {
    throw new Error('Failed to initialize Deepgram client');
  }
  
  // Convert to appropriate format
  const arrayBuffer = await audioFile.arrayBuffer();
  
  // In browser, we can pass the ArrayBuffer directly
  // In Node.js, it will be converted to Buffer by the SDK
  const audioSource = {
    buffer: arrayBuffer,
    mimetype: audioFile.type,
  };
  
  const response = await client.transcription.preRecorded(audioSource, {
    punctuate: true,
    model: 'nova',
  });
  
  return response.results?.channels[0]?.alternatives[0]?.transcript || '';
} 