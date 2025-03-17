'use client'

import { useState, useCallback } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import styles from '@/styles/AuthTesting.module.css';

export default function AuthTesting() {
  const { user, userRole, signUp, signIn, signOut, loading, session } = useAuth();
  
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

  return (
    <div className={styles.authContainer}>
      <h2>Authentication Testing</h2>
      
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

      {!user ? (
        <div className={styles.authForms}>
          <form onSubmit={handleSignUp} className={styles.authForm}>
            <h3>Sign Up</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit" disabled={isLoading}>
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
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Log In'}
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.signOutContainer}>
          <button onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Log Out'}
          </button>
        </div>
      )}
    </div>
  );
} 