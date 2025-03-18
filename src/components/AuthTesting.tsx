'use client'

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import styles from '@/styles/AuthTesting.module.css';

export default function AuthTesting() {
  // Track client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is fully mounted before rendering any dynamic content
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted yet, render a placeholder with the exact same DOM structure
  // This ensures server and client renders match exactly
  if (!mounted) {
    return <AuthTestingPlaceholder />;
  }
  
  // Only render the actual component on the client side
  return <AuthTestingContent />;
}

// Placeholder with the same DOM structure but static content
function AuthTestingPlaceholder() {
  return (
    <div className={styles.authContainer}>
      <h2>Authentication Testing</h2>
      <div className={styles.authStatus}>
        <h3>Current Status</h3>
        <p>Loading authentication status...</p>
      </div>
      <div className={styles.authForms}>
        <form className={styles.authForm}>
          <h3>Sign Up</h3>
          <input type="email" placeholder="Email" disabled />
          <input type="password" placeholder="Password" disabled />
          <button type="button" disabled>Sign Up</button>
        </form>
        <form className={styles.authForm}>
          <h3>Log In</h3>
          <input type="email" placeholder="Email" disabled />
          <input type="password" placeholder="Password" disabled />
          <button type="button" disabled>Log In</button>
        </form>
      </div>
    </div>
  );
}

// Actual content component only rendered client-side
function AuthTestingContent() {
  const { user, userRole, signUp, signIn, signOut, loading, session, credentialsMissing } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format date from timestamp
  const formatExpiryTime = useCallback((expiresAt?: number) => {
    if (!expiresAt) return 'Unknown';
    return new Date(expiresAt * 1000).toLocaleString();
  }, []);

  // Calculate remaining session time
  const getSessionTimeRemaining = useCallback(() => {
    if (!session?.expires_at) return 'Unknown';
    
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = expiresAt - now;
    
    if (remainingSeconds <= 0) return 'Expired';
    
    const minutes = Math.floor(remainingSeconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    
    return `${minutes}m ${remainingSeconds % 60}s`;
  }, [session]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialsMissing) {
      setMessage('Supabase credentials not configured. Authentication is disabled.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Check your email for the confirmation link!');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Unexpected error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialsMissing) {
      setMessage('Supabase credentials not configured. Authentication is disabled.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Successfully signed in!');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Unexpected error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (credentialsMissing) {
      setMessage('Supabase credentials not configured. Authentication is disabled.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await signOut();
      
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Successfully signed out!');
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Unexpected error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Prep login form elements
  const renderAuthForms = () => (
    <div className={styles.authForms}>
      <form onSubmit={handleSignUp} className={styles.authForm}>
        <h3>Sign Up</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={credentialsMissing || isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={credentialsMissing || isLoading}
        />
        <button type="submit" disabled={credentialsMissing || isLoading}>
          {isLoading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>

      <form onSubmit={handleSignIn} className={styles.authForm}>
        <h3>Log In</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={credentialsMissing || isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={credentialsMissing || isLoading}
        />
        <button type="submit" disabled={credentialsMissing || isLoading}>
          {isLoading ? 'Processing...' : 'Log In'}
        </button>
      </form>
    </div>
  );

  // Prep sign out button
  const renderSignOutButton = () => (
    <div className={styles.signOutContainer}>
      <button onClick={handleSignOut} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Log Out'}
      </button>
    </div>
  );

  return (
    <div className={styles.authContainer}>
      <h2>Authentication Testing</h2>
      
      {credentialsMissing && (
        <div className={`${styles.message} ${styles.warning}`}>
          <p>
            <strong>Login and registration are disabled</strong>
            <br />
            Supabase environment variables not configured
          </p>
          <p className={styles.smallText}>
            Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
          </p>
        </div>
      )}
      
      <div className={styles.authStatus}>
        <h3>Current Status</h3>
        {loading ? (
          <p>Loading authentication status...</p>
        ) : user ? (
          <div>
            <p>✅ Logged in as: {user.email}</p>
            <p>User ID: {user.id}</p>
            <p>Role: {userRole || 'Loading role...'}</p>
            <p>Session expires: {formatExpiryTime(session?.expires_at)}</p>
            <p>Time remaining: {getSessionTimeRemaining()}</p>
          </div>
        ) : (
          <p>❌ Not logged in</p>
        )}
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {user ? renderSignOutButton() : renderAuthForms()}
    </div>
  );
} 