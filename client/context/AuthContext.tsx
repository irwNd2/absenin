import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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
  authInfo: {
    id: number | null;
    email: string | null;
    name: string | null;
    role: string | null;
  };
}

const TOKEN_KEY = "my-app-token";
const AUTH_INFO = "auth-info";
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
  const [authInfo, setAuthInfo] = useState<{
    id: number | null;
    email: string | null;
    name: string | null;
    role: string | null;
  }>({
    id: null,
    email: null,
    name: null,
    role: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const data = await SecureStore.getItemAsync(TOKEN_KEY);
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
    const loadAuthInfo = async () => {
      const data = await SecureStore.getItemAsync(AUTH_INFO);
      if (data) {
        const object = JSON.parse(data);
        setAuthInfo({
          id: object.id,
          email: object.email,
          name: object.name,
          role: object.role,
        });
      }
    };
    loadAuthInfo();
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

      const decodedToken: any = jwtDecode(json.data.access_token);
      await SecureStore.setItemAsync(AUTH_INFO, JSON.stringify(decodedToken));
      setAuthInfo({
        id: decodedToken.id!,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
      });
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
    setAuthInfo({
      id: null,
      email: null,
      name: null,
      role: null,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
    initialized,
    authInfo,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
