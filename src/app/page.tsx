import { ApiStatus } from '@/components/ApiStatus';
import AuthTesting from '@/components/AuthTesting';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>BH Studio API Overview</h1>
      <ApiStatus />

      <AuthTesting />
    </main>
  );
}
