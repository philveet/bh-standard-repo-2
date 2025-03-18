'use client'

import { useState, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';
import styles from '@/styles/ApiStatus.module.css';
import { getApiStatusDynamic } from '@/lib/api/status-dynamic';

// Import types only, not implementations
import type { ApiStatusType } from '@/lib/api/status';

// Error boundary to catch any runtime errors
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('API Status component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback UI when API status fails
function ApiStatusFallback() {
  return (
    <div className={styles.apiStatusContainer}>
      <div className={styles.error}>
        <p>Could not load API status information.</p>
        <p>This is likely due to missing dependencies or environment variables.</p>
      </div>
      <div className={styles.fallbackInfo}>
        <h3>API Status Summary</h3>
        <p>API Status: <span className={styles.disabled}>Unavailable</span></p>
      </div>
    </div>
  );
}

// Main component wrapped with error boundary
export function ApiStatus() {
  return (
    <ErrorBoundary fallback={<ApiStatusFallback />}>
      <ApiStatusContent />
    </ErrorBoundary>
  );
}

// Actual API status content
function ApiStatusContent() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use dynamic imports to avoid Node.js module issues on client side
  useEffect(() => {
    async function fetchApiStatus() {
      try {
        // Use the dynamic import wrapper
        const statuses = await getApiStatusDynamic();
        setApiStatuses(statuses);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch API statuses:', error);
        setError('Could not load API status information');
        // Set minimal fallback data
        setApiStatuses([
          {
            name: 'Supabase',
            version: 'N/A',
            isEnabled: false,
            hasCredentials: false
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApiStatus();
  }, []);

  function handleRefresh() {
    setIsLoading(true);
    setApiStatuses([]);
    setError(null);
    getApiStatusDynamic().then((statuses) => {
      setApiStatuses(statuses);
      setIsLoading(false);
    }).catch((error: Error) => {
      console.error('Failed to refresh API statuses:', error);
      setError('Could not refresh API status information');
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading API statuses...</div>;
  }

  return (
    <div className={styles.apiStatusContainer}>
      <div className={styles.header}>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          Refresh
        </button>
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      {apiStatuses.length > 0 ? (
        <table className={styles.apiTable}>
          <thead>
            <tr>
              <th>API</th>
              <th>Version</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiStatuses.map((api) => (
              <tr key={api.name}>
                <td>{api.name}</td>
                <td>{api.version}</td>
                <td>
                  <span className={api.isEnabled ? styles.enabled : styles.disabled}>
                    {api.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <Link 
                    href={`/api-test/${api.name.toLowerCase()}`}
                    className={styles.testButton}
                  >
                    Test API
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noData}>No API information available</div>
      )}
    </div>
  );
} 