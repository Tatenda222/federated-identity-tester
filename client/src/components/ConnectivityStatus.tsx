import { Card, CardContent } from "@/components/ui/card";
import { Shield, LogOut, AppWindow } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ConnectivityStatus() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get connection data from user object
  const sessionExpires = user.sessionExpires || "In 60 minutes";
  const connectionCount = user.connectedApps || 1;
  
  return (
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
                <dt className="text-sm font-medium text-gray-500 truncate">Session Expires</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{sessionExpires}</div>
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
                  <div className="text-lg font-medium text-gray-900">{connectionCount}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}