import AppHome from './components/app/AppHome';
import AuthScreen from './components/auth/AuthScreen';
import Landing from './components/Landing';
import { useAuthRoute } from './hooks/useAuthRoute';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { isSupabaseConfigured } from './lib/supabase';

function AppLoading() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          padding: '20px 24px',
          background: 'var(--surface)',
          border: 'var(--border) solid var(--ink)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow)',
          fontWeight: 600,
        }}
      >
        Syncing your calendar…
      </div>
    </main>
  );
}

/** Routes between the landing page and the auth screen via the URL hash. */
export default function App() {
  const route = useAuthRoute();
  const { user, loading } = useSupabaseSession();
  const appHash = route.view === 'chat' ? `#/app/chat${route.groupId ? `/${encodeURIComponent(route.groupId)}` : ''}` : '#/app';

  if (loading && route.view !== 'landing') {
    return <AppLoading />;
  }

  if (route.view === 'auth' && !user) {
    return <AuthScreen initialMode={route.mode} onSuccess={() => (window.location.hash = '#/app')} />;
  }

  if (route.view === 'join' && !user) {
    return <AuthScreen initialMode="signup" onSuccess={() => {}} preserveHashOnModeChange />;
  }

  if (route.view === 'app' || route.view === 'chat') {
    if (!isSupabaseConfigured) {
      return <AuthScreen initialMode="login" onSuccess={() => (window.location.hash = appHash)} />;
    }

    if (!user) {
      return <AuthScreen initialMode="login" onSuccess={() => (window.location.hash = appHash)} />;
    }

    return <AppHome chatGroupId={route.view === 'chat' ? route.groupId : undefined} user={user} />;
  }

  if (route.view === 'join') {
    if (!isSupabaseConfigured) {
      return <AuthScreen initialMode="signup" onSuccess={() => {}} preserveHashOnModeChange />;
    }

    return <AppHome user={user!} joinInviteCode={route.code} />;
  }

  if (user && route.view === 'auth') {
    return <AppHome user={user} />;
  }

  return <Landing />;
}
