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

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  loading: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserRole(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserRole(data.role);
    }
  }

  const value = {
    session,
    user,
    userRole,
    loading,
    signUp: (email: string, password: string) => 
      supabase.auth.signUp({ email, password }),
    signIn: (email: string, password: string) => 
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

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