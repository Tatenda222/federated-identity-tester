import { apiRequest } from "./queryClient";
import { User, LoginResponse, OAuthCredentials } from "@/types/auth";

const MAIN_APP_URL = 'https://tatendamhakaprojects.web.app';

/**
 * Authenticate a user with a federated identity provider
 */
export async function authenticateWithProvider(
  provider: string,
  code?: string,
  state?: string
): Promise<User> {
  // If we have a code and state, we're completing an OAuth flow
  if (code && state) {
    const response = await apiRequest("POST", "/api/auth/callback", {
      provider,
      code,
      state,
    });
    
    const data: LoginResponse = await response.json();
    
    // Store the token in localStorage
    localStorage.setItem('auth_token', data.token);
    
    // After successful authentication, redirect to home
    window.location.href = "/home";
    return data.user;
  }
  
  // For federated login, redirect to the main application's identity provider
  if (provider === "federated") {
    // Get the current URL to use as the callback URL
    const callbackUrl = encodeURIComponent(window.location.origin + '/auth/callback');
    console.log('Login: Generated callback URL:', callbackUrl);
    
    // Redirect to the main application's identity provider with the callback URL
    const identityProviderUrl = `${MAIN_APP_URL}/sign-in?callback=${callbackUrl}`;
    console.log('Login: Redirecting to identity provider:', identityProviderUrl);
    
    // Store the current state in localStorage to restore it after callback
    localStorage.setItem('auth_state', JSON.stringify({
      provider,
      timestamp: Date.now()
    }));
    
    window.location.href = identityProviderUrl;
    return;
  }
  
  // For other providers, initiate the authentication flow
  const response = await apiRequest("POST", "/api/auth/login", { provider });
  
  // If the response is JSON, it means we're simulating the auth flow locally
  // In a real app, we would be redirected to the identity provider
  try {
    const data: LoginResponse = await response.json();
    return data.user;
  } catch (error) {
    // If the response isn't JSON, it means we've been redirected
    // This won't actually execute in the browser because we'll have navigated away
    throw new Error("Authentication failed. Please try again.");
  }
}

// Alias for backward compatibility
export const loginWithProvider = authenticateWithProvider;

/**
 * Fetch the currently authenticated user
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    console.log('Fetching current user...'); // Debug log
    const response = await apiRequest("GET", "/api/auth/me");
    const user = await response.json();
    console.log('Current user fetched:', user); // Debug log
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error); // Debug log
    // If we get a 401, the user is not authenticated
    if ((error as any).message.includes("401")) {
      console.log('User is not authenticated (401)'); // Debug log
      return null;
    }
    throw error;
  }
}

/**
 * Log out the current user
 */
export async function logoutUser(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

// Alias for backward compatibility
export const logout = logoutUser;

export const login = async (provider: string) => {
  try {
    console.log('Login: Starting authentication with provider:', provider);
    
    if (provider === "federated") {
      // Get the current URL to use as the callback URL
      const callbackUrl = encodeURIComponent(window.location.origin + '/auth/callback');
      console.log('Login: Generated callback URL:', callbackUrl);
      
      // Redirect to the main application's identity provider with the callback URL
      const identityProviderUrl = `${MAIN_APP_URL}/sign-in?callback=${callbackUrl}`;
      console.log('Login: Redirecting to identity provider:', identityProviderUrl);
      
      // Store the current state in localStorage to restore it after callback
      localStorage.setItem('auth_state', JSON.stringify({
        provider,
        timestamp: Date.now()
      }));
      
      window.location.href = identityProviderUrl;
      return;
    }

    console.log('Login: Making API request to /api/auth/login');
    const response = await apiRequest("POST", "/api/auth/login", {
      provider,
    });
    
    console.log('Login: API response received');
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    return await apiRequest("/auth/session");
  } catch (error) {
    console.error("Get session error:", error);
    throw error;
  }
};

export const auth = {
  async handleCallback(token: string) {
    try {
      console.log('Auth handleCallback: Starting...'); // Debug log
      
      // Store the token from the main application
      localStorage.setItem('main_app_token', token);
      console.log('Auth handleCallback: Main app token stored'); // Debug log
      
      // Call the backend to complete the authentication
      console.log('Auth handleCallback: Calling backend...'); // Debug log
      const response = await apiRequest("POST", "/api/auth/callback", {
        provider: "federated",
        token
      });
      
      const data: LoginResponse = await response.json();
      console.log('Auth handleCallback: Backend response received:', data); // Debug log
      
      // Store the auth token
      localStorage.setItem('auth_token', data.token);
      console.log('Auth handleCallback: Auth token stored'); // Debug log
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Auth handleCallback: User data stored'); // Debug log
      
      return data.user;
    } catch (error) {
      console.error('Auth handleCallback error:', error);
      // Clear any stored tokens on error
      localStorage.removeItem('auth_token');
      localStorage.removeItem('main_app_token');
      localStorage.removeItem('user');
      throw error;
    }
  }
};
