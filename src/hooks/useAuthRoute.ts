import { useEffect, useState } from 'react';

export type AuthMode = 'signup' | 'login';

/** Either the marketing landing page or the auth screen in one of its modes. */
export type Route =
  | { view: 'landing' }
  | { view: 'auth'; mode: AuthMode }
  | { view: 'app' }
  | { view: 'chat'; groupId?: string }
  | { view: 'join'; code: string };

/**
 * Hash routing mirrors the prototype's `#signup` / `#login` modes without
 * pulling in a router. The auth screen lives under `#/auth`; everything else
 * (including the landing page's `#how` / `#features` scroll anchors) is the
 * landing view.
 */
function parse(): Route {
  const hash = window.location.hash;
  if (hash.startsWith('#/join/')) {
    const code = decodeURIComponent(hash.slice('#/join/'.length)).trim();
    return code ? { view: 'join', code } : { view: 'landing' };
  }
  if (hash.startsWith('#/app/chat')) {
    const groupId = decodeURIComponent(hash.slice('#/app/chat/'.length)).trim();
    return groupId ? { view: 'chat', groupId } : { view: 'chat' };
  }
  if (hash.startsWith('#/app')) {
    return { view: 'app' };
  }
  if (hash.startsWith('#/auth')) {
    return { view: 'auth', mode: hash === '#/auth/login' ? 'login' : 'signup' };
  }
  return { view: 'landing' };
}

export function useAuthRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);

  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}
