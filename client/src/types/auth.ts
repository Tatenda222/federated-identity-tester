export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  scopes?: string;
  sessionExpires?: string;
  connectedApps?: number;
  activities?: Activity[];
  browser?: string;
  os?: string;
}

export interface Activity {
  id: string;
  type: 'login' | 'logout' | 'other';
  description: string;
  time: string;
  device: string;
  recent: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface OAuthCredentials {
  provider: string;
  code?: string;
  state?: string;
}
