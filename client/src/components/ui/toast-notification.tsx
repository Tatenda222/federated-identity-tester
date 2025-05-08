import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cva } from "class-variance-authority";

type ToastVariant = "success" | "error";

interface ToastProps {
  variant: ToastVariant;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastVariants = cva(
  "transform transition-all duration-300 mb-4 pointer-events-auto p-4 rounded-md shadow-lg border flex items-center",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-100",
        error: "bg-red-50 border-red-100",
      },
      visible: {
        true: "translate-y-0 opacity-100",
        false: "translate-y-8 opacity-0",
      },
    },
    defaultVariants: {
      variant: "success",
      visible: false,
    },
  }
);

export function ToastNotification({
  variant,
  message,
  visible,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div className={toastVariants({ variant, visible: isVisible })}>
      <div className="flex-shrink-0">
        {variant === "success" ? (
          <CheckCircle className="text-green-400 h-5 w-5" />
        ) : (
          <AlertCircle className="text-red-400 h-5 w-5" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <p
          className={`text-sm font-medium ${
            variant === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>
      </div>
      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            className={`inline-flex ${
              variant === "success"
                ? "text-green-500 hover:bg-green-100"
                : "text-red-500 hover:bg-red-100"
            } p-1.5 rounded-md focus:outline-none`}
            onClick={handleClose}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 p-4 w-full md:max-w-sm z-50">
      {children}
    </div>
  );
}
