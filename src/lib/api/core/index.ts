import { isApiEnabled } from '@/config/api-config';
import { getElevenlabsClient } from '@/lib/api/elevenlabs';

// Central registry of all available APIs
export const availableApis = {
  openai: {
    isEnabled: () => isApiEnabled('openai'),
  },
  anthropic: {
    isEnabled: () => isApiEnabled('anthropic'),
  },
  replicate: {
    isEnabled: () => isApiEnabled('replicate'),
  },
  deepgram: {
    isEnabled: () => isApiEnabled('deepgram'),
  },
  resend: {
    isEnabled: () => isApiEnabled('resend'),
  },
  mediawiki: {
    isEnabled: () => isApiEnabled('mediawiki'),
  },
  stripe: {
    isEnabled: () => isApiEnabled('stripe'),
  },
  'react-pdf': {
    isEnabled: () => isApiEnabled('react-pdf'),
  },
  elevenlabs: {
    isEnabled: () => isApiEnabled('elevenlabs'),
    getClient: getElevenlabsClient,
  },
};

// Helper function to get all currently enabled APIs
export function getEnabledApis() {
  return Object.entries(availableApis)
    .filter(([_, api]) => api.isEnabled())
    .map(([name]) => name);
} 