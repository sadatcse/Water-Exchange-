'use client';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';

export const AuthContext = createContext(null);

const errorMessage = (err, fallback) => err?.response?.data?.message || fallback;

// Session for /admin and /dashboard. user = { _id, name, email, role, status, … }
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(
    () =>
      api
        .get('/auth/me', { withCredentials: true })
        .then((res) => {
          setUser(res.data.data.user);
          return res.data.data;
        })
        .catch(() => {
          setUser(null);
          return null;
        }),
    []
  );

  // Restore the session from the httpOnly cookie on first load
  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  // Returns { user, redirectTo }. captcha = { captchaToken, captchaAnswer } from the math question on /admin
  const signIn = useCallback(async (email, password, captcha = {}) => {
    try {
      const res = await api.post('/auth/sign-in', { email, password, ...captcha }, { withCredentials: true });
      setUser(res.data.data.user);
      return res.data.data;
    } catch (err) {
      throw new Error(errorMessage(err, 'Sign-in failed.'));
    }
  }, []);

  const logOut = useCallback(async () => {
    await api.post('/auth/logout', {}, { withCredentials: true }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, signIn, logOut, refresh, setUser }), [user, loading, signIn, logOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
