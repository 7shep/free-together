import { useEffect, useState } from 'react';
import type { AuthMode } from '../../hooks/useAuthRoute';
import AuthForm from './AuthForm';
import BrandPanel from './BrandPanel';
import styles from './AuthScreen.module.css';

interface AuthScreenProps {
  /** Mode the screen opens in, derived from the route (`#/auth` vs `#/auth/login`). */
  initialMode: AuthMode;
}

/**
 * Split-screen sign-up / log-in page: a dark brand panel on the left, the
 * mode-toggling form on the right. The mint accent + Bricolage display face are
 * scoped to this screen (see the module), so the landing page keeps its own
 * coral + Fredoka system.
 */
export default function AuthScreen({ initialMode }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Resync when the screen is opened via a different link while already mounted.
  useEffect(() => setMode(initialMode), [initialMode]);

  // Open at the top rather than wherever the landing page was scrolled.
  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    document.title =
      mode === 'login' ? 'Free Together — log in' : 'Free Together — create your group';
  }, [mode]);

  const changeMode = (next: AuthMode) => {
    setMode(next);
    // Keep the URL honest without stacking a history entry per toggle.
    window.history.replaceState(null, '', next === 'login' ? '#/auth/login' : '#/auth');
  };

  return (
    <div className={styles.auth}>
      <BrandPanel />
      <AuthForm mode={mode} onModeChange={changeMode} />
    </div>
  );
}
