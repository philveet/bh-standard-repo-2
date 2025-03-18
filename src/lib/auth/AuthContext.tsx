'use client'

/**
 * SUPABASE USER MANAGEMENT GUIDE
 * 
 * 1. Accessing Supabase Dashboard:
 *    - Go to https://app.supabase.io/
 *    - Select your project
 * 
 * 2. Managing Users:
 *    - Navigate to "Authentication" > "Users" in the sidebar
 *    - Here you can view all registered users
 *    - Click on a user to see details, reset passwords, or delete users
 * 
 * 3. Modifying User Roles:
 *    - To change a user's role:
 *      - Go to "Table Editor" in the sidebar
 *      - Select the "profiles" table
 *      - Find the user by ID or email
 *      - Edit the "role" field (valid values: 'user', 'admin')
 *      - Save changes
 * 
 * 4. Email Templates:
 *    - To customize email templates:
 *      - Go to "Authentication" > "Email Templates"
 *      - Edit the templates for confirmation, reset password, etc.
 * 
 * 5. Authentication Settings:
 *    - Go to "Authentication" > "Providers" to manage sign-in methods
 *    - Enable/disable email confirmations, password recovery, etc.
 * 
 * NOTE: The first user you want to make an admin must be edited directly
 * in the database since RLS policies prevent users from changing roles.
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseCredentialsMissing } from '../clients/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  credentialsMissing: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache for user roles to reduce database calls
const userRoleCache = new Map<string, string>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [credentialsMissing, setCredentialsMissing] = useState(false);

  // Initialize Supabase client only on client side
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    // Check if Supabase credentials are missing
    const missing = isSupabaseCredentialsMissing();
    setCredentialsMissing(missing);
    
    return getSupabaseClient();
  }, []);

  // Memoize fetchUserRole to avoid recreating the function on each render
  const fetchUserRole = useCallback(async (userId: string) => {
    // Check cache first
    if (userRoleCache.has(userId)) {
      setUserRole(userRoleCache.get(userId) || null);
      return;
    }

    if (!supabase) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      userRoleCache.set(userId, data.role); // Cache the role
      setUserRole(data.role);
    }
  }, [supabase]);

  // Enhanced sign out function to properly clean up state
  const handleSignOut = useCallback(async () => {
    if (!supabase) return { error: new Error('Supabase client not initialized') as AuthError };
    
    const result = await supabase.auth.signOut();
    
    // Clear state on sign out
    setUser(null);
    setSession(null);
    setUserRole(null);
    
    return result;
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    
    // If credentials are missing, don't attempt to initialize auth
    if (credentialsMissing) {
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    // Implement token refresh logic
    const refreshInterval = setInterval(async () => {
      if (session) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      }
    }, 1000 * 60 * 30); // Refresh every 30 minutes

    return () => {
      // Proper cleanup
      subscription.unsubscribe();
      clearInterval(refreshInterval);
      setUser(null);
      setSession(null);
      setUserRole(null);
    };
  }, [supabase, fetchUserRole, session, credentialsMissing]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    session,
    user,
    userRole,
    loading,
    credentialsMissing,
    signUp: (email: string, password: string) => 
      supabase ? supabase.auth.signUp({ email, password }) :
      Promise.resolve({ error: new Error('Supabase client not initialized') as AuthError, data: null }),
    signIn: (email: string, password: string) => 
      supabase ? supabase.auth.signInWithPassword({ email, password }) :
      Promise.resolve({ error: new Error('Supabase client not initialized') as AuthError, data: null }),
    signOut: handleSignOut,
  }), [session, user, userRole, loading, credentialsMissing, supabase, handleSignOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 