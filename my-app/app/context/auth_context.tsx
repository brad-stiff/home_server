import { createContext, useContext, useEffect, useState } from 'react';
import { saveToken, loadToken, deleteToken } from '../utils/token_storage';
import Constants from 'expo-constants';

const api_url = Constants.expoConfig?.extra?.api_url;

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  login_modal_visible: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [login_modal_visible, setLoginModalVisible] = useState(false);

  const showLoginModal = () => setLoginModalVisible(true);
  const hideLoginModal = () => setLoginModalVisible(false);

  useEffect(() => {
    (async () => {
      const stored = await loadToken();
      if (!stored) return;
      //if (stored) {
      //  setToken(stored);
      //  setUser({ id: '123', name: 'Brad' }); // Replace with real fetch/decode
      //}

      setToken(stored);
      const res = await fetch(`${api_url}/users/me`, {
        headers: {
          Authorization: `Bearer ${stored}`,
        },
      });
      const data = await res.json();
      setUser(data.user);
    })();
  }, []);

  async function login(jwt: string) {
    await saveToken(jwt);
    setToken(jwt);

    // Fetch real user data
    const res = await fetch(`${api_url}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await res.json();

    setUser(data.user); // Replace with real fetch/decode
    hideLoginModal();
  }

  async function logout() {
    await deleteToken();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
