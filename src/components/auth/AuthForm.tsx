import { useState, type FormEvent } from 'react';
import type { AuthMode } from '../../hooks/useAuthRoute';
import {
  AppleIcon,
  BackChevron,
  CheckSmall,
  GoogleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from './icons';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

/**
 * Right half of the auth screen. A sliding pill tab switches between Sign up and
 * Log in; the heading, fields, and CTA copy follow the active mode. Submitting
 * shows a brief pending label — there's no backend yet, so it just resets.
 */
export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const isLogin = mode === 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    window.setTimeout(() => setPending(false), 1400);
  };

  const submitLabel = pending ? 'One sec…' : isLogin ? 'Log in' : 'Create your group';

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
              ? 'Log in to see when your crew is free.'
              : 'Free forever. No card, no app to download.'}
          </p>
        </div>

        <div className={styles.social}>
          <button className={styles.sbtn} type="button">
            <GoogleIcon />
            Continue with Google
          </button>
          <button className={styles.sbtn} type="button">
            <AppleIcon />
            Continue with Apple
          </button>
        </div>

        <div className={styles.divider}>or with email</div>

        <form onSubmit={submit}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="auth-name">Your name</label>
              <div className={styles.inp}>
                <UserIcon />
                <input id="auth-name" type="text" placeholder="Maya Rivera" autoComplete="name" />
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
              />
              <button
                type="button"
                className={styles.togglePw}
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className={styles.rowBetween}>
              <label className={styles.remember}>
                <input type="checkbox" />
                <span className={styles.box}>
                  <CheckSmall />
                </span>
                Remember me
              </label>
              <a href="#" className={styles.forgot}>
                Forgot password?
              </a>
            </div>
          )}

          <button className={styles.submit} type="submit">
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
            By creating a group you agree to our <a href="#">Terms</a> &amp;{' '}
            <a href="#">Privacy Policy</a>.
          </p>
        )}
      </div>
    </main>
  );
}
