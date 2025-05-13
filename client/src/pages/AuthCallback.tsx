import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Starting auth callback process...'); // Debug log
        
        // Get token from URL using URLSearchParams
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        console.log('Token received:', token); // Debug log

        if (!token) {
          console.error('No token found in URL');
          setLocation('/');
          return;
        }

        // Store the token immediately
        localStorage.setItem('auth_token', token);
        console.log('Token stored in localStorage'); // Debug log

        // Process the token
        console.log('Processing token...'); // Debug log
        const user = await auth.handleCallback(token);
        console.log('Token processed successfully, user:', user); // Debug log
        
        // Update auth state
        console.log('Checking auth status...'); // Debug log
        await checkAuthStatus();
        console.log('Auth status updated'); // Debug log
        
        // Redirect to dashboard after successful authentication
        console.log('Redirecting to dashboard...'); // Debug log
        setLocation('/dashboard');
      } catch (error) {
        console.error('Error handling auth callback:', error);
        // Clear any stored tokens on error
        localStorage.removeItem('auth_token');
        localStorage.removeItem('main_app_token');
        setLocation('/');
      }
    };

    handleCallback();
  }, [setLocation, checkAuthStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Processing authentication...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 