import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute, Link } from "wouter";
import { 
  Shield, 
  Home, 
  AppWindow, 
  UserCheck, 
  Settings, 
  Mail, 
  LogOut,
  Lock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

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
              
              {/* User Profile Card */}
              <Card className="mb-6 animate-in fade-in-50 duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user.avatar ? (
                        <img src={user.avatar} className="h-full w-full rounded-full" alt={`${user.name}'s avatar`} />
                      ) : (
                        <UserCheck className="h-8 w-8" />
                      )}
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">{user.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Mail className="mr-1.5 h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <ShieldCheck className="mr-1.5 h-4 w-4 text-green-500" />
                        <span>Authenticated via Federated Identity</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6 animate-in fade-in-50 duration-500 delay-200">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                        <Shield className="text-primary-600 h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">1</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <LogOut className="text-green-600 h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Last Login</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">Just now</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <AppWindow className="text-blue-600 h-6 w-6" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Connected Apps</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{user.connectedApps || 1}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Protected Content */}
              <Card className="mb-6 animate-in fade-in-50 duration-700 delay-300">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Protected Content</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">This section is only visible to authenticated users.</p>
                </div>
                <CardContent className="p-6">
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lock className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Identity Information</h3>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Your account is securely authenticated through our federated identity system.</p>
                          <p className="mt-2">You have access to this test application through your credentials from the main application.</p>
                        </div>
                        <div className="mt-4">
                          <div className="-mx-2 -my-1.5 flex">
                            <Button variant="ghost" className="text-primary-600 hover:bg-primary-50">
                              View Identity Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Token Information Section */}
                  <div className="mt-6">
                    <h4 className="text-base font-medium text-gray-900 mb-3">Authentication Details</h4>
                    <div className="bg-gray-50 rounded-md p-5 shadow-sm">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Identity Provider</dt>
                          <dd className="mt-1 text-sm text-gray-900">{user.provider || "Main Application IDP"}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Authentication Method</dt>
                          <dd className="mt-1 text-sm text-gray-900">OAuth 2.0 / OIDC</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Session Expires</dt>
                          <dd className="mt-1 text-sm text-gray-900">{user.sessionExpires || "In 59 minutes"}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Scopes Granted</dt>
                          <dd className="mt-1 text-sm text-gray-900">{user.scopes || "profile, email, read:data"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="animate-in fade-in-50 duration-700 delay-500">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your authentication history across connected applications.</p>
                </div>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-200">
                    <li>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <LogOut className="text-green-500 h-5 w-5 mr-2" />
                            <p className="text-sm font-medium text-primary-600 truncate">Successful login</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Just now
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                              </svg>
                              {user.browser || "Browser"} on {user.os || "Operating System"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                    {user.activities && user.activities.map((activity, index) => (
                      <li key={index}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <LogOut className={`${activity.type === 'login' ? 'text-green-500' : 'text-gray-500'} h-5 w-5 mr-2`} />
                              <p className={`text-sm font-medium ${activity.type === 'login' ? 'text-primary-600' : 'text-gray-600'} truncate`}>
                                {activity.description}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.recent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {activity.time}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                                {activity.device}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
