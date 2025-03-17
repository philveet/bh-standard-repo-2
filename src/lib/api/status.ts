import { apiRegistry, getApiStatuses } from './core';
import { ApiKeys } from './core/api-keys';
import { ENABLED_APIS } from '@/config/api-config';

export type ApiStatusType = {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

/**
 * Safely check if credentials exist without actually importing the client
 * This helps avoid loading Node.js modules in the browser
 */
function safeHasCredentials(apiName: string): boolean {
  // If we're in the browser, just check basic environment variable existence
  if (typeof window !== 'undefined') {
    switch (apiName) {
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY;
      case 'replicate':
        return !!process.env.REPLICATE_API_TOKEN;
      case 'stripe':
        return !!process.env.STRIPE_SECRET_KEY;
      case 'resend':
        return !!process.env.RESEND_API_KEY;
      case 'deepgram':
        return !!process.env.DEEPGRAM_API_KEY;
      case 'supabase':
        return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      case 'elevenlabs':
        return !!process.env.ELEVENLABS_API_KEY;
      default:
        return false;
    }
  }
  
  // On the server, we can use the more detailed check
  return ApiKeys.hasRequiredKeys(apiName);
}

/**
 * Get status information for all APIs
 * @returns Promise that resolves to an array of API status objects
 */
export async function getApiStatus(): Promise<ApiStatusType[]> {
  // Forward to the core implementation
  return getApiStatuses();
} 