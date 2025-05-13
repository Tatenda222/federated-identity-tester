import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User as AuthUser, AuthState, AuthContextType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { loginWithProvider, logout } from "@/lib/auth";
import { fetchCurrentUser } from "@/lib/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('Checking auth status...'); // Debug log
      setState(prev => ({ ...prev, isLoading: true }));
      const user = await fetchCurrentUser();
      console.log('Auth status check result:', user); // Debug log
      setState({
        isAuthenticated: !!user,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Auth status check error:', error); // Debug log
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Failed to check authentication status",
      });
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (provider: string) => {
    try {
      console.log('Login: Starting...'); // Debug log
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Call authentication
      await loginWithProvider(provider);
      
      // Check auth status after login
      await checkAuthStatus();
      
      toast({
        title: "Authentication Successful",
        description: `You've been successfully authenticated with ${provider}.`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Authentication failed. Please try again.",
      }));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await logout();
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Logout failed. Please try again.",
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout: handleLogout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
