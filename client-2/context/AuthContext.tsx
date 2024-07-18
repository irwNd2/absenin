import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthProps {
  authState: {
    token: string | null;
    authenticated: boolean | null;
    user_id: string | null;
  };
  onLogin: (
    email: string,
    password: string,
    role: "teacher" | "student" | "parent"
  ) => Promise<any>;
  onLogout: () => Promise<any>;
  initialized: boolean;
}

const TOKEN_KEY = "my-app-token";
const API_URL = process.env.EXPO_PUBLIC_API;
const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user_id: string | null;
  }>({
    token: null,
    authenticated: null,
    user_id: null,
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const data = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log(data);
      if (data) {
        const object = JSON.parse(data);
        setAuthState({
          token: object.data.access_token,
          authenticated: true,
          user_id: object.data.user_id,
        });
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "teacher" | "student" | "parent"
  ) => {
    try {
      const loginUrl = `${API_URL}/v1/${role}/login`;
      const result = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (result.status !== 200) throw Error(result.statusText);

      const json = await result.json();

      setAuthState({
        token: json.data.access_token,
        authenticated: true,
        user_id: json.data.user_id,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(json));
    } catch (error) {
      throw Error();
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    setAuthState({
      token: null,
      authenticated: false,
      user_id: null,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
    initialized,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
