import { createContext, useContext, useEffect, useState } from 'react';
import { me as fetchMe } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMe();
        setUser(res?.user || null);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 👇 expose loading as well
  const value = { user, setUser, loading };

  // ❌ don’t return null while loading — let children decide what to show
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
