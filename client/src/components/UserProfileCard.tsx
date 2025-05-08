import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, UserCheck, ShieldCheck } from "lucide-react";
import { useUserData } from "@/hooks/useFirestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileCard() {
  const { user } = useAuth();
  const { document: userData, loading } = useUserData();
  
  if (!user) return null;
  
  // Merge Firebase auth user with Firestore user data if available
  const displayName = userData?.displayName || user.name;
  const email = user.email;
  const avatar = userData?.photoURL || user.avatar;
  const provider = userData?.provider || user.provider;
  
  return (
    <Card className="mb-6 animate-in fade-in-50 duration-300">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {loading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : avatar ? (
              <img src={avatar} className="h-full w-full rounded-full object-cover" alt={`${displayName}'s avatar`} />
            ) : (
              <UserCheck className="h-8 w-8" />
            )}
          </div>
          <div className="ml-5">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-52" />
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium leading-6 text-gray-900">{displayName}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Mail className="mr-1.5 h-4 w-4" />
                  <span>{email}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <ShieldCheck className="mr-1.5 h-4 w-4 text-green-500" />
                  <span>Authenticated via {provider}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}