import { ApiName, API_REGISTRY, ApiEnabledState } from './api-registry';

// Export ApiName type for use in other files
export type { ApiName };

// Default configuration based on registry defaults
export const ENABLED_APIS: ApiEnabledState = Object.entries(API_REGISTRY).reduce(
  (acc, [key, definition]) => {
    acc[key as ApiName] = definition.defaultEnabled;
    return acc;
  },
  {} as ApiEnabledState
);

/**
 * Checks if a specific API is enabled for this project
 */
export function isApiEnabled(api: ApiName): boolean {
  return ENABLED_APIS[api];
}

/**
 * Gets environment variable name for a specific API
 */
export function getApiEnvVar(api: ApiName): string {
  return API_REGISTRY[api].envVar;
} 