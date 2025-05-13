import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, UserCheck, ShieldCheck } from "lucide-react";

export default function UserProfileCard() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <Card className="mb-6 animate-in fade-in-50 duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                className="h-12 w-12 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <ShieldCheck className="h-4 w-4 mr-1" />
              {user.provider || "federated"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}