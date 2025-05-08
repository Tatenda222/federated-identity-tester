import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User as AuthUser, AuthState, AuthContextType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { auth, loginWithProvider, logout as firebaseLogout } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

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

// Transform Firebase user to our app's user format
const transformFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "User",
    email: firebaseUser.email || "user@example.com",
    avatar: firebaseUser.photoURL || undefined,
    provider: firebaseUser.providerData[0]?.providerId || "firebase",
    scopes: "profile email read:data",
    sessionExpires: "In 60 minutes",
    connectedApps: 1,
    browser: navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0] || "Browser",
    os: navigator.platform || "Operating System",
    activities: [
      {
        id: "1",
        type: "login",
        description: "Successful login",
        time: "Just now",
        device: `${navigator.platform} (${navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0] || "Browser"})`,
        recent: true
      }
    ]
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  // Set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user = transformFirebaseUser(firebaseUser);
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } else {
        // User is signed out
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    // No need to do anything here, Firebase's onAuthStateChanged will handle this
    return;
  }, []);

  const login = async (provider: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Call Firebase authentication
      await loginWithProvider(provider);
      
      // The auth state change will be caught by onAuthStateChanged
      
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
      await firebaseLogout();
      
      // The auth state change will be caught by onAuthStateChanged
      
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
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
