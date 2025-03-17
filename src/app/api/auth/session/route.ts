import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';

/**
 * API route to get the current user session
 * This provides a centralized endpoint for validating sessions
 */
export async function GET() {
  try {
    // Create a Supabase client using server components
    const cookieStore = cookies();
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 401 }
      );
    }
    
    // If no session found, return 401
    if (!data.session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    // Get user profile including role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.session.user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }
    
    // Return session data and role information
    return NextResponse.json({
      authenticated: true,
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        role: profile?.role || 'user'
      },
      // Don't expose the actual tokens for security
      expires_at: data.session.expires_at
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 