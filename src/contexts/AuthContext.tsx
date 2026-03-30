import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Obfuscated credentials (base64-encoded, decoded at runtime)
const VALID_CREDS = [
  { u: "Y2hhaXRzdg==", p: "dGVtcDEyMw==" },
];

function decode(encoded: string): string {
  return atob(encoded);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("auth") === "true");
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"));

  const login = async (user: string, pass: string) => {
    if (VALID_CREDS.some((c) => user === decode(c.u) && pass === decode(c.p))) {
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
