'use client'

/**
 * Browser-compatible Deepgram client implementation
 * This file provides a minimal interface that works in both Node.js and browser environments
 */

export interface DeepgramOptions {
  punctuate?: boolean;
  model?: string;
}

export interface DeepgramResponse {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
      }>;
    }>;
  };
}

// Mock implementation for browser or when SDK is missing
class MockDeepgramClient {
  constructor() {
    console.warn('Using mock Deepgram client - real SDK not available in browser');
  }

  transcription = {
    preRecorded: async (): Promise<DeepgramResponse> => {
      return {
        results: {
          channels: [
            {
              alternatives: [
                {
                  transcript: 'This is a mock transcription. Deepgram SDK not available in browser.'
                }
              ]
            }
          ]
        }
      };
    }
  };
}

/**
 * Get an instance of the Deepgram client
 * Returns a browser-compatible client
 */
export function getDeepgramClient() {
  return new MockDeepgramClient();
}

/**
 * Check if Deepgram credentials are configured
 */
export function hasDeepgramCredentials(): boolean {
  return !!process.env.DEEPGRAM_API_KEY;
} 