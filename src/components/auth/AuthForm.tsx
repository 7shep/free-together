import { useState, type FormEvent } from 'react';
import type { AuthMode } from '../../hooks/useAuthRoute';
import { isSupabaseConfigured, requireSupabase } from '../../lib/supabase';
import LocalSetupNotice from '../LocalSetupNotice';
import { AppleIcon, BackChevron, GoogleIcon, LockIcon, MailIcon, UserIcon } from './icons';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
}

function buildEmailRedirectHash() {
  const hash = window.location.hash.trim();
  return hash.startsWith('#/join/') ? hash : '#/app';
}

export default function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const isLogin = mode === 'login';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone: 'error' | 'success' } | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    if (!isSupabaseConfigured) {
      setStatus({
        tone: 'error',
        text: 'Add your Supabase URL and publishable key to the Vite env before signing in.',
      });
      return;
    }

    setPending(true);
    setStatus(null);

    try {
      const supabase = requireSupabase();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        onSuccess();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}${window.location.pathname}${buildEmailRedirectHash()}`,
        },
      });

      if (error) throw error;

      if (data.session) {
        onSuccess();
        return;
      }

      setStatus({
        tone: 'success',
        text: 'Account created. Check your email to verify it, then sign in to open your calendar.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong while talking to Supabase.';
      setStatus({ tone: 'error', text: message });
    } finally {
      setPending(false);
    }
  };

  const submitLabel = pending ? 'One sec…' : isLogin ? 'Log in' : 'Create your account';

  return (
    <main className={styles.formside}>
      <a href="#top" className={styles.back}>
        <BackChevron />
        Back
      </a>

      <div className={styles.wrap}>
        <div className={styles.tabs} role="tablist" aria-label="Sign up or log in">
          <span
            className={`${styles.thumb} ${isLogin ? styles.thumbLogin : ''}`}
            aria-hidden="true"
          />
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`}
            onClick={() => onModeChange('signup')}
          >
            Sign up
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`}
            onClick={() => onModeChange('login')}
          >
            Log in
          </button>
        </div>

        <div className={styles.head}>
          <h2>{isLogin ? 'Welcome back' : 'Create your group'}</h2>
          <p>
            {isLogin
              ? 'Sign in with your real Supabase account to load your groups.'
              : 'Create an account, verify your email if required, and start syncing real availability.'}
          </p>
        </div>

        <div className={styles.social}>
          <button className={`${styles.sbtn} ${styles.sbtnDisabled}`} type="button" disabled>
            <GoogleIcon />
            Google soon
          </button>
          <button className={`${styles.sbtn} ${styles.sbtnDisabled}`} type="button" disabled>
            <AppleIcon />
            Apple soon
          </button>
        </div>

        <div className={styles.divider}>or with email</div>

        <form onSubmit={submit}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="auth-name">Your name</label>
              <div className={styles.inp}>
                <UserIcon />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Maya Rivera"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="auth-email">Email</label>
            <div className={styles.inp}>
              <MailIcon />
              <input
                id="auth-email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="auth-password">Password</label>
            <div className={styles.inp}>
              <LockIcon />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className={styles.togglePw}
                onClick={() => setShowPassword((value) => !value)}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <p className={styles.helper}>
            {isLogin
              ? 'Use the same email and password stored in Supabase Auth.'
              : 'After you sign up, Supabase may ask for email verification before the first real session starts.'}
          </p>

          {status && (
            <p
              className={
                status.tone === 'error'
                  ? `${styles.status} ${styles.error}`
                  : `${styles.status} ${styles.success}`
              }
            >
              {status.text}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={pending}>
            <span>{submitLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className={styles.swap}>
          {isLogin ? (
            <>
              New here?{' '}
              <b role="button" tabIndex={0} onClick={() => onModeChange('signup')}>
                Create your group
              </b>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <b role="button" tabIndex={0} onClick={() => onModeChange('login')}>
                Log in
              </b>
            </>
          )}
        </p>

        {!isLogin && (
          <p className={styles.terms}>
            By creating a group you agree to our <a href="/terms/">Terms</a> &amp;{' '}
            <a href="/privacy/">Privacy Policy</a>.
          </p>
        )}

        {!isSupabaseConfigured && <LocalSetupNotice compact />}
      </div>
    </main>
  );
}
