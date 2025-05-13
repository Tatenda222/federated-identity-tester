import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function IdentityInformation() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get provider info
  const provider = user.provider || "federated";
  const scopes = user.scopes || "profile, email, read:data";
  const sessionExpires = user.sessionExpires || "In 60 minutes";
  
  return (
    <Card className="mb-6 animate-in fade-in-50 duration-700 delay-300">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Protected Content</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">This section is only visible to authenticated users.</p>
      </div>
      <CardContent className="p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Authentication Provider</dt>
            <dd className="mt-1 text-sm text-gray-900">{provider}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Session Expires</dt>
            <dd className="mt-1 text-sm text-gray-900">{sessionExpires}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Granted Scopes</dt>
            <dd className="mt-1 text-sm text-gray-900">{scopes}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}