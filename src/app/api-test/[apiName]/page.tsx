'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/ApiTest.module.css';

export default function ApiTestPage({ params }: { params: { apiName: string } }) {
  const router = useRouter();
  // Convert apiName from URL format to display format (e.g., "openai" to "OpenAI")
  const formattedApiName = params.apiName.charAt(0).toUpperCase() + params.apiName.slice(1);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          onClick={() => router.push('/')} 
          className={styles.backButton}
        >
          ← Back to API Panel
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Live test for {formattedApiName}</h1>
        <div className={styles.content}>
          {/* Empty test page content as requested */}
        </div>
      </main>
    </div>
  );
} 