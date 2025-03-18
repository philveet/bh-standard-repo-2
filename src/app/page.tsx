import { ApiStatus } from '@/components/ApiStatus';
import AuthTesting from '@/components/AuthTesting';
import Link from 'next/link';
import { Beaker } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>BH Studio API Overview</h1>
        <Link href="/test" className={styles.testHubLink}>
          <Beaker className={styles.testIcon} size={18} />
          <span>API Testing</span>
        </Link>
      </div>
      <ApiStatus />

      <AuthTesting />
    </main>
  );
}
