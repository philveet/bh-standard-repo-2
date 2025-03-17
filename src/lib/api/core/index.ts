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

// Central registry of all available APIs
export const availableApis = {
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
export function getEnabledApis() {
  return Object.entries(availableApis)
    .filter(([_, api]) => api.isEnabled())
    .map(([name]) => name);
} 