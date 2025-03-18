import { createClient } from '@supabase/supabase-js';
import { type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let isMockClient = false;

// Create a mock client that returns appropriate values for methods
function createMockClient(): SupabaseClient {
  const credentialsMessage = 'Supabase credentials not configured';

  // We're creating a partial mock that handles common methods
  // @ts-ignore - We need to ignore TypeScript errors since we're creating a simplified mock
  return {
    // Auth methods
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: null 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: null
      }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {}, id: 'mock-id', callback: () => {} } } }),
      refreshSession: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    },
    // Database methods
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    // Storage methods
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}

/**
 * Gets a singleton instance of the Supabase client.
 * Lazily initialized to prevent hydration mismatches.
 * Returns a mock client with appropriate responses if credentials are missing.
 */
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Authentication features will be disabled. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    supabaseInstance = createMockClient();
    isMockClient = true;
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

/**
 * Checks if the current Supabase client is a mock client due to missing credentials
 */
export function isSupabaseCredentialsMissing() {
  // Initialize the client if it hasn't been already
  if (!supabaseInstance) {
    getSupabaseClient();
  }
  return isMockClient;
}

// For backward compatibility
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null; 