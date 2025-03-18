import { ApiStatus } from '@/components/ApiStatus';
import AuthTesting from '@/components/AuthTesting';
import styles from '@/styles/page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>BH Studio API Panel</h1>
      <ApiStatus />

      <AuthTesting />
    </main>
  );
}
