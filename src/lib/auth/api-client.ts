'use client'

import { getSupabaseClient } from '../supabase/client';

/**
 * Make an authenticated API request with the current user's session token
 * 
 * @param url The URL to fetch
 * @param options Optional fetch options
 * @returns Promise with the fetch response
 */
export async function authenticatedFetch(url: string, options?: RequestInit) {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    Authorization: session ? `Bearer ${session.access_token}` : '',
  };
  
  return fetch(url, { 
    ...options, 
    headers,
    // Add credentials mode for cookies
    credentials: 'include',
  });
}

/**
 * Get the current authenticated user's session
 * @returns Promise with the user session or null
 */
export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Check if the current user has a specific role
 * @param requiredRole The role to check for
 * @returns Promise that resolves to boolean indicating if user has role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return false;
  
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  return data?.role === requiredRole;
} 