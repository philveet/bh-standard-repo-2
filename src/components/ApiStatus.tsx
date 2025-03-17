'use client'

import { useState, useEffect } from 'react';
import styles from '@/styles/ApiStatus.module.css';
import { getApiStatusDynamic } from '@/lib/api/status-dynamic';

// Import types only, not implementations
import type { ApiStatusType } from '@/lib/api/status';

export function ApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use dynamic imports to avoid Node.js module issues on client side
  useEffect(() => {
    async function fetchApiStatus() {
      try {
        // Use the dynamic import wrapper
        const statuses = await getApiStatusDynamic();
        setApiStatuses(statuses);
      } catch (error) {
        console.error('Failed to fetch API statuses:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApiStatus();
  }, []);

  function handleRefresh() {
    setIsLoading(true);
    setApiStatuses([]);
    getApiStatusDynamic().then((statuses) => {
      setApiStatuses(statuses);
      setIsLoading(false);
    }).catch((error: Error) => {
      console.error('Failed to refresh API statuses:', error);
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
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>API</th>
            <th>Version</th>
            <th>Status</th>
            <th>Credentials</th>
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
                <span className={api.hasCredentials ? styles.configured : styles.missing}>
                  {api.hasCredentials ? 'Configured' : 'Missing'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 