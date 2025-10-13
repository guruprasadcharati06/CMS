import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { attachInterceptors } from '../../utils/apiClient.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'eventapp_token';
const USER_KEY = 'eventapp_user';

const parseStoredAuth = () => {
  try {
    const rawUser = window.localStorage.getItem(USER_KEY);
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token || !rawUser) return null;
    const user = JSON.parse(rawUser);
    return { token, user };
  } catch (error) {
    console.error('Failed to parse stored auth session', error);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => parseStoredAuth());
  const [expiresAt, setExpiresAt] = useState(() => null);
  const queryClient = useQueryClient();

  useEffect(() => {
    attachInterceptors(() => session?.token || null);
  }, [session?.token]);

  useEffect(() => {
    if (!session) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, session.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }, [session]);

  const login = ({ token, user, expiresInMinutes = 60 }) => {
    setSession({ token, user });
    setExpiresAt(dayjs().add(expiresInMinutes, 'minute').toISOString());
  };

  const logout = () => {
    setSession(null);
    setExpiresAt(null);
    queryClient.clear();
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.token),
      token: session?.token || null,
      user: session?.user || null,
      expiresAt,
      login,
      logout,
      setUser: (updater) => {
        setSession((prev) => {
          if (!prev) return prev;
          const nextUser = typeof updater === 'function' ? updater(prev.user) : updater;
          return { ...prev, user: nextUser };
        });
      },
    }),
    [session, expiresAt]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export default AuthProvider;
