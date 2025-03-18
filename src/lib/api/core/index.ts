import { isApiEnabled } from '@/config/api-config';
import { getElevenlabsClient } from '@/lib/api/elevenlabs';
import { getOpenAIClient } from '@/lib/api/openai';
import { getAnthropicClient } from '@/lib/api/anthropic';
import { getReplicateClient } from '@/lib/api/replicate';
import { getDeepgramClient } from '@/lib/api/deepgram';
import { getResendClient } from '@/lib/api/resend';
import { getWikiClient } from '@/lib/api/mediawiki';
import { checkPdfEnabled } from '@/lib/api/react-pdf';
import { getStripeClient } from '@/lib/api/stripe';
import { ApiKeys } from './api-keys';

// Central registry of all available APIs
export const apiRegistry = {
  openai: {
    isEnabled: () => isApiEnabled('openai'),
    getClient: getOpenAIClient,
  },
  anthropic: {
    isEnabled: () => isApiEnabled('anthropic'),
    getClient: getAnthropicClient,
  },
  replicate: {
    isEnabled: () => isApiEnabled('replicate'),
    getClient: getReplicateClient,
  },
  deepgram: {
    isEnabled: () => isApiEnabled('deepgram'),
    getClient: getDeepgramClient,
  },
  resend: {
    isEnabled: () => isApiEnabled('resend'),
    getClient: getResendClient,
  },
  mediawiki: {
    isEnabled: () => isApiEnabled('mediawiki'),
    getClient: getWikiClient,
  },
  stripe: {
    isEnabled: () => isApiEnabled('stripe'),
    getClient: getStripeClient,
  },
  'react-pdf': {
    isEnabled: () => isApiEnabled('react-pdf'),
    getClient: () => {
      checkPdfEnabled();
      return { enabled: true };
    },
  },
  elevenlabs: {
    isEnabled: () => isApiEnabled('elevenlabs'),
    getClient: getElevenlabsClient,
  },
};

// Helper function to get all currently enabled APIs
export function getActiveApis() {
  return Object.entries(apiRegistry)
    .filter(([_, api]) => api.isEnabled())
    .map(([name]) => name);
}

// For backward compatibility
export const availableApis = apiRegistry;

type ApiStatus = {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

/**
 * Get status of all available APIs
 * @returns Array of API status objects
 */
export async function getApiStatuses(): Promise<ApiStatus[]> {
  try {
    const enabledApis = getActiveApis();
    
    return Object.entries(apiRegistry).map(([apiName, api]) => {
      try {
        const isEnabled = enabledApis.includes(apiName);
        const hasCredentials = ApiKeys.hasRequiredKeys(apiName);
        
        // Format API name for display
        const formattedName = formatApiName(apiName);
        
        return {
          name: formattedName,
          version: getApiVersion(apiName),
          isEnabled,
          hasCredentials
        };
      } catch (error) {
        console.error(`Error getting status for API ${apiName}:`, error);
        // Return a placeholder status for the API that failed
        return {
          name: formatApiName(apiName),
          version: 'Error',
          isEnabled: false,
          hasCredentials: false
        };
      }
    });
  } catch (error) {
    console.error("Error getting API statuses:", error);
    // Return empty array in case of error
    return [];
  }
}

/**
 * Get version of an API
 * @param apiName Name of the API
 * @returns Version string
 */
function getApiVersion(apiName: string): string {
  const versionMap: Record<string, string> = {
    openai: '4.28.4',
    anthropic: '0.36.3',
    replicate: '0.25.2',
    stripe: '13.3.0',
    resend: '2.0.0',
    deepgram: '3.11.2',
    supabase: '2.39.8',
    mediawiki: '6.4.1',
    'react-pdf': '3.1.12',
    elevenlabs: '1.1.0'
  };
  
  return versionMap[apiName] || 'N/A';
}

/**
 * Format API name for display
 * @param apiName Raw API name
 * @returns Formatted API name
 */
function formatApiName(apiName: string): string {
  switch (apiName) {
    case 'openai':
      return 'OpenAI';
    case 'anthropic':
      return 'Anthropic';
    case 'replicate':
      return 'Replicate';
    case 'stripe':
      return 'Stripe';
    case 'resend':
      return 'Resend';
    case 'deepgram':
      return 'Deepgram';
    case 'supabase':
      return 'Supabase';
    case 'mediawiki':
      return 'Wiki.js';
    case 'react-pdf':
      return 'React PDF';
    case 'elevenlabs':
      return 'ElevenLabs';
    default:
      return apiName.charAt(0).toUpperCase() + apiName.slice(1);
  }
} 