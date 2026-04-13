import { createContext, ReactNode, useEffect, useState } from "react";
import { api, refreshSession, setAccessToken } from "../api/axiosClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent" | "client";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await refreshSession();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken("");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
