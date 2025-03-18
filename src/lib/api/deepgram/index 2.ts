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

// Graceful handling for missing Deepgram SDK
let DeepgramClient: any;
let hasSDK = false;

// Try to load the Deepgram SDK, but handle errors gracefully
try {
  const sdk = require('@deepgram/sdk');
  DeepgramClient = sdk.Deepgram;
  hasSDK = true;
} catch (error) {
  console.warn('Deepgram SDK could not be loaded. Deepgram features will be disabled.');
  // Create a mock client for when the SDK isn't available
  DeepgramClient = class MockDeepgram {
    constructor() {
      // Mock implementation
    }
  
    // Mock methods
    listen() {
      return {
        addListener: () => {},
        removeListener: () => {}
      };
    }
  
    transcription() {
      return {
        preRecorded: async () => ({
          results: { channels: [{ alternatives: [{ transcript: 'Deepgram unavailable' }] }] }
        })
      };
    }
  };
}

/**
 * Get an instance of the Deepgram client
 */
export function getDeepgramClient() {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  
  if (!apiKey || !hasSDK) {
    console.warn('Deepgram disabled: API key missing or SDK not available');
    return new DeepgramClient();
  }
  
  return new DeepgramClient(apiKey);
}

/**
 * Check if Deepgram is available
 */
export function isDeepgramAvailable() {
  return hasSDK && !!process.env.DEEPGRAM_API_KEY;
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