"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-top-full fade-in",
  {
    variants: {
      variant: {
        default:
          "bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
        success:
          "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100",
        error:
          "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
        warning:
          "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100",
        info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onClose,
}: ToastProps) {
  const Icon = iconMap[variant || "default"];

  return (
    <div className={cn(toastVariants({ variant }))} role="alert">
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && (
          <div className="text-sm opacity-90 mt-1">{description}</div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  position?:
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
}

const positionClasses = {
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
};

export function ToastContainer({
  toasts,
  position = "top-right",
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2 p-4 pointer-events-none",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Toast Hook
type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

let toastIdCounter = 0;
const listeners: Set<(toasts: ToastProps[]) => void> = new Set();
let toasts: ToastProps[] = [];

function emitChange() {
  listeners.forEach((listener) => listener([...toasts]));
}

function addToast(options: ToastOptions) {
  const id = String(++toastIdCounter);
  const duration = options.duration ?? 3000;

  const toast: ToastProps = {
    id,
    ...options,
    onClose: () => removeToast(id),
  };

  toasts = [...toasts, toast];
  emitChange();

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

export function useToast() {
  const [state, setState] = React.useState<ToastProps[]>([]);

  React.useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    toasts: state,
    toast: {
      show: (options: ToastOptions) => addToast(options),
      success: (title: string, description?: string) =>
        addToast({ title, description, variant: "success" }),
      error: (title: string, description?: string) =>
        addToast({ title, description, variant: "error" }),
      warning: (title: string, description?: string) =>
        addToast({ title, description, variant: "warning" }),
      info: (title: string, description?: string) =>
        addToast({ title, description, variant: "info" }),
      dismiss: (id: string) => removeToast(id),
    },
  };
}

// Toaster - Self-contained component untuk di root layout
export function Toaster() {
  const { toasts } = useToast();
  return <ToastContainer toasts={toasts} position="top-right" />;
}
