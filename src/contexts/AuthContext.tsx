import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const VALID_USERNAME = "chaitsv";
const VALID_PASSWORD = "temp123";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("auth") === "true");
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"));

  const login = (user: string, pass: string) => {
    if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setUsername(user);
      localStorage.setItem("auth", "true");
      localStorage.setItem("username", user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
