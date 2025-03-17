import { availableApis } from './core';
import { ApiKeys } from './core/api-keys';
import { ENABLED_APIS } from '@/config/api-config';

export type ApiStatusType = {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

const API_VERSIONS: Record<string, string> = {
  openai: '4.6.0',
  anthropic: '0.7.1',
  replicate: '0.18.0',
  stripe: '13.3.0',
  resend: '1.1.0',
  deepgram: '2.4.0',
  supabase: '2.39.3',
  wikijs: '6.4.1',
  reactpdf: '3.1.12'
};

/**
 * Get status information for all APIs
 * @returns Promise that resolves to an array of API status objects
 */
export async function getApiStatus(): Promise<ApiStatusType[]> {
  // Get API statuses and format them for display
  return Object.entries(availableApis).map(([apiName, api]) => {
    const isEnabled = ENABLED_APIS[apiName as keyof typeof ENABLED_APIS] || false;
    const hasCredentials = ApiKeys.hasRequiredKeys(apiName);
    
    return {
      name: formatApiName(apiName),
      version: API_VERSIONS[apiName] || 'Unknown',
      isEnabled,
      hasCredentials
    };
  });
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
    case 'wikijs':
      return 'Wiki.js';
    case 'reactpdf':
      return 'React PDF';
    default:
      return apiName.charAt(0).toUpperCase() + apiName.slice(1);
  }
} 