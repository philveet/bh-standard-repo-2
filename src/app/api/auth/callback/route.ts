import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/clients/supabase/client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Auth callback handler for Supabase
 * Handles OAuth redirects and email confirmation redirects
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('next') || '/';
  
  if (code) {
    try {
      const supabase = getSupabaseClient();
      
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
      
      // Redirect to the requested page or home
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    } catch (error) {
      console.error('Error in auth callback:', error);
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent('Failed to sign in')}`, requestUrl.origin)
      );
    }
  }
  
  // If no code is provided, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 