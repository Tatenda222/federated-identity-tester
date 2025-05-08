import { Github, File, HeadphonesIcon, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
            <span className="sr-only">Documentation</span>
            <File className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
            <span className="sr-only">GitHub</span>
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
            <span className="sr-only">Support</span>
            <HeadphonesIcon className="h-5 w-5" />
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1 flex items-center">
          <ShieldCheck className="h-5 w-5 text-primary-500 mr-2" />
          <p className="text-center text-base text-gray-500">
            &copy; {currentYear} IdentityHub Test Application
          </p>
        </div>
      </div>
    </footer>
  );
}
