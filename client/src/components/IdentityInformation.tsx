import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useFirestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function IdentityInformation() {
  const { user } = useAuth();
  const { document: userData, loading } = useUserData();
  
  if (!user) return null;
  
  // Get provider info
  const provider = userData?.provider || user.provider || "federated";
  const scopes = user.scopes || "profile, email, read:data";
  const sessionExpires = user.sessionExpires || "In 60 minutes";
  
  return (
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
                <dd className="mt-1 text-sm text-gray-900">
                  {loading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    provider
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Authentication Method</dt>
                <dd className="mt-1 text-sm text-gray-900">OAuth 2.0 / OIDC</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Session Expires</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    sessionExpires
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Scopes Granted</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loading ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    scopes
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}