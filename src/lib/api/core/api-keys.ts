/**
 * Utility class to check if API keys are configured
 * Browser-safe implementation that doesn't rely on Node.js modules
 */
import { isSupabaseCredentialsMissing } from '@/lib/supabase/client';

export class ApiKeys {
  /**
   * Check if required API keys are set for a given API
   * @param apiName The name of the API to check
   * @returns boolean indicating if the API has all required keys
   */
  static hasRequiredKeys(apiName: string): boolean {
    // In browser environments, we check for environment variables
    // without actually trying to access the APIs
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
        // Use the specialized function that checks if credentials are missing
        return !isSupabaseCredentialsMissing();
      case 'elevenlabs':
        return !!process.env.ELEVENLABS_API_KEY;
      case 'react-pdf':
        return true; // React PDF doesn't require API keys
      case 'mediawiki':
        return true; // MediaWiki uses public APIs by default
      default:
        return false;
    }
  }
} 