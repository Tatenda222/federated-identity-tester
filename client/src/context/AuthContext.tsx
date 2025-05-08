import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, AuthState, AuthContextType } from "@/types/auth";
import { authenticateWithProvider, fetchCurrentUser, logoutUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

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
      setState((prev) => ({ ...prev, isLoading: true }));
      const user = await fetchCurrentUser();
      
      if (user) {
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Failed to verify authentication status",
      });
    }
  }, []);

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Parse the URL for OAuth callbacks
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    
    if (code && state) {
      // Handle OAuth callback
      const provider = localStorage.getItem("oauth_provider") || "federated";
      
      // Remove OAuth parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Complete the OAuth flow
      login(provider, code, state);
    } else if (error) {
      // Handle OAuth error
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: url.searchParams.get("error_description") || "Failed to authenticate",
      });
      
      // Remove error parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = async (provider: string, code?: string, state?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Store the provider for OAuth callback handling
      localStorage.setItem("oauth_provider", provider);
      
      // Call the authentication API
      const user = await authenticateWithProvider(provider, code, state);
      
      setState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Authentication Successful",
        description: `You've been successfully authenticated with ${provider}.`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Authentication failed. Please try again.",
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await logoutUser();
      localStorage.removeItem("oauth_provider");
      
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setState((prev) => ({
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
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
