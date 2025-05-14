import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

interface JWTPayload {
  name: string;
  picture?: string;
  email: string;
  email_verified: boolean;
  sub: string;
  provider?: string;
  firebase?: {
    identities: {
      [key: string]: string[];
    };
    sign_in_provider: string;
  };
}

const MAIN_APP_URL = 'https://tatendamhakaprojects.web.app';
// const MAIN_APP_URL = 'http://localhost:3000';

export function parseToken(token: string): JWTPayload {
  try {
    // For development, we'll just decode the token without verification
    // In production, you should verify the token with the appropriate public key
    const decoded = jwt.decode(token) as JWTPayload;
    
    if (!decoded) {
      throw new Error('Invalid token format');
    }
    
    return decoded;
  } catch (error) {
    console.error('Error parsing token:', error);
    throw new Error('Failed to parse token');
  }
}

export function extractUserFromToken(token: string): Partial<User> {
  const payload = parseToken(token);
  
  // Extract provider from Firebase data if available
  const provider = payload.firebase?.sign_in_provider || 'federated';
  
  return {
    name: payload.name,
    email: payload.email,
    avatar: payload.picture || null,
    provider: provider,
    providerId: payload.sub,
    accessToken: token,
    tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
    scopes: 'profile email read:data',
    metadata: {
      emailVerified: payload.email_verified,
      connectedApps: 1,
      browser: 'Browser',
      os: 'Operating System',
      mainAppUrl: MAIN_APP_URL
    }
  };
} 