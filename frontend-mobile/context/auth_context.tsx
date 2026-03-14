import { createContext, useContext, useEffect, useState } from 'react';
import { saveTokens, loadTokens, deleteTokens } from '@/utils/token_storage';
import Constants from 'expo-constants';
import ApiService from '@/services/api';

const api_url = Constants.expoConfig?.extra?.api_url;

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  login: (access_token: string, refresh_token: string) => Promise<void>;
  logout: () => Promise<void>;
  login_modal_visible: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [refresh_token, setRefreshToken] = useState<string | null>(null);
  const [login_modal_visible, setLoginModalVisible] = useState(false);

  const showLoginModal = () => setLoginModalVisible(true);
  const hideLoginModal = () => setLoginModalVisible(false);

  useEffect(() => {
    (async () => {
      const stored = await loadTokens();
      if (!stored.access_token || !stored.refresh_token) return;

      setAccessToken(stored.access_token);
      setRefreshToken(stored.refresh_token);

      try {
        const res = await fetch(`${api_url}/users/me`, {
          headers: {
            Authorization: `Bearer ${stored.access_token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          const refreshed = await ApiService.refreshToken(stored.refresh_token);

          await saveTokens(refreshed.access_token, refreshed.refresh_token);
          setAccessToken(refreshed.access_token);
          setRefreshToken(refreshed.refresh_token);

          const meRes = await fetch(`${api_url}/users/me`, {
            headers: {
              Authorization: `Bearer ${refreshed.access_token}`,
            },
          });
          const meData = await meRes.json();
          setUser(meData.user);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error('Failed to restore auth state', e);
      }
    })();
  }, []);

  async function login(access_token_value: string, refresh_token_value: string) {
    await saveTokens(access_token_value, refresh_token_value);
    setAccessToken(access_token_value);
    setRefreshToken(refresh_token_value);

    try {
      const res = await fetch(`${api_url}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token_value}`,
        },
      });
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error('Failed to fetch user after login', e);
    }

    hideLoginModal();
  }

  async function logout() {
    if (refresh_token) {
      try {
        await ApiService.logout(refresh_token);
      } catch (e) {
        console.error('Failed to logout from API', e);
      }
    }

    await deleteTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        access_token,
        refresh_token,
        login,
        logout,
        login_modal_visible,
        showLoginModal,
        hideLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
