import { availableApis } from '@/lib/api/core';
import { IconButton } from '@/components/ui/IconButton';
import { RefreshCw } from '@/lib/icons';
import Image from 'next/image';
import { ApiStatus } from '@/components/ApiStatus';
import AuthTesting from '@/components/AuthTesting';
import styles from './page.module.css';

interface ApiStatus {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
}

export default function Home() {
  // Define API versions
  const apiVersions: Record<string, string> = {
    replicate: 'v0.18.0',
    anthropic: 'v0.36.3',
    openai: 'v4.6.0',
    deepgram: 'v2.4.0',
    resend: 'v1.1.0',
    mediawiki: 'v6.4.1',
    'react-pdf': 'v3.1.12',
    stripe: 'v13.3.0',
    elevenlabs: 'v1.1.1',
  };

  // Get API statuses
  const apiStatuses: ApiStatus[] = Object.entries(availableApis).map(([name, api]) => ({
    name,
    version: apiVersions[name] || 'Unknown',
    isEnabled: api.isEnabled(),
    hasCredentials: process.env[`${name.toUpperCase()}_API_KEY`] !== undefined,
  }));

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Template project with Supabase Auth Integration
        </p>
        <div>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>
            Find in-depth information about Next.js features and&nbsp;API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL
            with&nbsp;Vercel.
          </p>
        </a>
      </div>

      <h1 className={styles.title}>API Status</h1>
      <ApiStatus />

      <AuthTesting />
    </main>
  );
}
