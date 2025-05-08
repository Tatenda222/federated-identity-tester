import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-gray-900 font-medium">IdentityHub</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Testing your federated identity management integration. &copy; {new Date().getFullYear()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Documentation
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Support
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}