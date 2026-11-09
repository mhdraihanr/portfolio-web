"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // aria-modal is a promise that focus stays inside; keep it true and hand focus
  // back to the trigger on close so keyboard users do not land on <body>.
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen || !mounted) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={panelRef}
        className={cn(
          "relative z-50 w-full my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-lg",
          "animate-in zoom-in-95 duration-200",
          sizeClasses[size],
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex flex-shrink-0 items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-4"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Modal Header component for custom headers
export const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-4 border-b border-gray-200 dark:border-gray-800",
      className,
    )}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

// Modal Footer component for action buttons
export const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 p-6 pt-4 border-t border-gray-200 dark:border-gray-800",
      className,
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";
