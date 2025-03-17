// List of available APIs that can be enabled/disabled
export type ApiName = 
  | 'replicate' 
  | 'anthropic' 
  | 'openai' 
  | 'deepgram' 
  | 'resend' 
  | 'mediawiki' 
  | 'react-pdf' 
  | 'stripe';

// By default all APIs are enabled
// This can be overridden in environment variables
export const ENABLED_APIS: Record<ApiName, boolean> = {
  replicate: true,
  anthropic: true,
  openai: true,
  deepgram: true,
  resend: true,
  mediawiki: true,
  'react-pdf': true,
  stripe: true
};

/**
 * Checks if a specific API is enabled for this project
 */
export function isApiEnabled(api: ApiName): boolean {
  return ENABLED_APIS[api];
} 