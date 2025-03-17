/**
 * Utility class for checking API key availability
 */
export class ApiKeys {
  /**
   * Check if the required API keys are set for a given API
   * @param apiName The name of the API to check
   * @returns True if all required keys are available
   */
  static hasRequiredKeys(apiName: string): boolean {
    // Simple implementation - can be extended with more detailed checks
    switch (apiName) {
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY;
      case 'replicate':
        return !!process.env.REPLICATE_API_TOKEN;
      case 'stripe':
        return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PUBLISHABLE_KEY;
      case 'resend':
        return !!process.env.RESEND_API_KEY;
      case 'deepgram':
        return !!process.env.DEEPGRAM_API_KEY;
      case 'supabase':
        return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      default:
        return false;
    }
  }
} 