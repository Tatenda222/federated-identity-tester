import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogIn, Info, KeyRound } from "lucide-react";
import { useState } from "react";
import { FaGoogle, FaMicrosoft, FaGithub } from "react-icons/fa";

export default function Home() {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [loginProvider, setLoginProvider] = useState<string | null>(null);

  const handleFederatedLogin = async () => {
    setLoginProvider("federated");
    try {
      await login("federated");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Unable to authenticate with your application. Please try again.",
      });
      setLoginProvider(null);
    }
  };

  const handleProviderLogin = async (provider: string) => {
    setLoginProvider(provider);
    try {
      await login(provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || `Unable to authenticate with ${provider}. Please try again.`,
      });
      setLoginProvider(null);
    }
  };

  // If user is already authenticated, show a welcome card instead of login options
  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
            <CardDescription>You're already signed in as {user.name}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-6 text-center">
            <Button 
              className="mt-4 px-8"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-2 text-center pt-6 pb-2">
          <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <KeyRound className="h-8 w-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 text-transparent bg-clip-text">Identity Test Application</CardTitle>
          <CardDescription>Sign in to test federated authentication</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  This app demonstrates how your existing identity system works with third-party applications.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Button 
                className="w-full py-6 bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 text-white transition-all shadow-md" 
                onClick={handleFederatedLogin}
                disabled={isLoading}
              >
                {isLoading && loginProvider === "federated" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    <span>Continue with Your Main Application</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleProviderLogin('google')}
                disabled={isLoading}
              >
                {isLoading && loginProvider === "google" ? (
                  <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaGoogle className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleProviderLogin('microsoft')}
                disabled={isLoading}
              >
                {isLoading && loginProvider === "microsoft" ? (
                  <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaMicrosoft className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleProviderLogin('github')}
                disabled={isLoading}
              >
                {isLoading && loginProvider === "github" ? (
                  <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaGithub className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
