import AuthScreen from './components/auth/AuthScreen';
import Landing from './components/Landing';
import { useAuthRoute } from './hooks/useAuthRoute';

/** Routes between the landing page and the auth screen via the URL hash. */
export default function App() {
  const route = useAuthRoute();

  if (route.view === 'auth') {
    return <AuthScreen initialMode={route.mode} />;
  }

  return <Landing />;
}
