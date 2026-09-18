import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api';
import { getToken, setToken } from '../api/client';
import type { LoginPayload, RegisterPayload, User } from '../types';

type AuthValue = {
  user: User | null;
  /** true while we're checking the saved token on first page load */
  booting: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(true);

  // On a hard refresh the React state is gone but the token is still in
  // localStorage. Ask the server who that token belongs to.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setBooting(false);
      return;
    }
    api.auth
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setBooting(false));
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      booting,
      isAdmin: user?.role === 'ADMIN',
      async login(payload) {
        const res = await api.auth.login(payload);
        setToken(res.token);
        setUser(res.user);
      },
      async register(payload) {
        const res = await api.auth.register(payload);
        setToken(res.token);
        setUser(res.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [user, booting],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
