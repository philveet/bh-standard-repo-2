import { useState, useEffect } from 'react';
import styles from '@/styles/ApiStatus.module.css';
import { getApiStatus } from '@/lib/api/status';

type ApiStatusType = {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
};

export function ApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApiStatus() {
      try {
        const statuses = await getApiStatus();
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
    getApiStatus().then((statuses: ApiStatusType[]) => {
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