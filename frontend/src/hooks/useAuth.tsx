import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {

    setIsLoading(true);

    try {

      const res = await authService.login({ email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return user; // ✅ return user so Login page can decide redirect

    } catch (error) {

      console.error("Login failed", error);
      throw error;

    } finally {

      setIsLoading(false);

    }
  };

  const register = async (name: string, email: string, password: string) => {

    setIsLoading(true);

    try {

      const res = await authService.register({ name, email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      navigate("/dashboard");

      return user;

    } catch (error) {

      console.error("Register failed", error);
      throw error;

    } finally {

      setIsLoading(false);

    }
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};