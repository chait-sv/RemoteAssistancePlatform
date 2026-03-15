import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Pre-hashed credentials (SHA-256)
const VALID_USERNAME_HASH = "a4a0d47e441008268afc58a13c1f2af22e920e0e5602e77413e3634da0891417";
const VALID_PASSWORD_HASH = "b0399d2029f64d185783c969b40875e603a50aa4594f2fa1f9724d7b8355a55e";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("auth") === "true");
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("username"));

  const login = async (user: string, pass: string) => {
    const [userHash, passHash] = await Promise.all([sha256(user), sha256(pass)]);
    if (userHash === VALID_USERNAME_HASH && passHash === VALID_PASSWORD_HASH) {
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
