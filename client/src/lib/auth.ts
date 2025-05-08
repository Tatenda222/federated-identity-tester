import { apiRequest } from "./queryClient";
import { User, LoginResponse, OAuthCredentials } from "@/types/auth";

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
    return data.user;
  }
  
  // Otherwise, initiate the authentication flow
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

/**
 * Fetch the currently authenticated user
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/auth/me");
    return await response.json();
  } catch (error) {
    // If we get a 401, the user is not authenticated
    if ((error as any).message.includes("401")) {
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
