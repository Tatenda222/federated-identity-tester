import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Activity } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLog() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const activities: Activity[] = user.activities || [
    {
      id: "1",
      type: "login",
      description: "Successful login",
      time: "Just now",
      device: `${navigator.platform} (${navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0] || "Browser"})`,
      recent: true
    }
  ];

  return (
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
          {activities.filter(activity => activity.id !== "1").map((activity, index) => (
            <li key={activity.id || index}>
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
  );
}