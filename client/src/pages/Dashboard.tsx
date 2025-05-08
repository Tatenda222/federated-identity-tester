import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute, Link } from "wouter";
import { 
  Shield, 
  Home, 
  AppWindow, 
  Settings
} from "lucide-react";
import { useEffect } from "react";
import UserProfileCard from "@/components/UserProfileCard";
import ConnectivityStatus from "@/components/ConnectivityStatus";
import IdentityInformation from "@/components/IdentityInformation";
import ActivityLog from "@/components/ActivityLog";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/dashboard/:tab");
  const activeTab = params?.tab || "home";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Shield className="text-primary-600 h-6 w-6 mr-2" />
                <span className="font-semibold text-lg">IdentityHub</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <Link href="/dashboard" className={`${activeTab === 'home' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    <Home className={`${activeTab === 'home' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-6 w-6`} />
                    Home
                </Link>
                <Link href="/dashboard/applications" className={`${activeTab === 'applications' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    <AppWindow className={`${activeTab === 'applications' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-6 w-6`} />
                    Applications
                </Link>
                <Link href="/dashboard/identity" className={`${activeTab === 'identity' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    <Shield className={`${activeTab === 'identity' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-6 w-6`} />
                    Identity
                </Link>
                <Link href="/dashboard/settings" className={`${activeTab === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    <Settings className={`${activeTab === 'settings' ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0 h-6 w-6`} />
                    Settings
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full text-left text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary-700 to-blue-700 text-transparent bg-clip-text">Welcome to IdentityHub Dashboard</h1>
              <p className="text-gray-500 mt-1">Testing your federated identity management integration</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <UserProfileCard />
              <ConnectivityStatus />
              <IdentityInformation />
              <ActivityLog />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}