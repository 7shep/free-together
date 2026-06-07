import styles from './LocalSetupNotice.module.css';

interface LocalSetupNoticeProps {
  compact?: boolean;
}

export default function LocalSetupNotice({ compact = false }: LocalSetupNoticeProps) {
  return (
    <aside className={`${styles.notice} ${compact ? styles.compact : ''}`} role="status">
      <p className={styles.title}>Local setup incomplete</p>
      <p className={styles.copy}>
        Create <code>.env.local</code> from <code>.env.example</code>, set{' '}
        <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, then
        restart Vite.
      </p>
    </aside>
  );
}
