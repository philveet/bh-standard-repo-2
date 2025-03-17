'use client'

import { type ApiStatusType } from './status';

/**
 * Dynamically import the API status module for browser compatibility
 * This prevents Node.js modules from being bundled in the browser
 */
export async function getApiStatusDynamic(): Promise<ApiStatusType[]> {
  try {
    // Dynamically import the status module
    const statusModule = await import('./status');
    return statusModule.getApiStatus();
  } catch (error) {
    console.error('Error importing API status module:', error);
    return [];
  }
} 