import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin rounded-full border-2 border-current", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-3",
      xl: "h-16 w-16 border-4",
    },
    variant: {
      primary: "text-primary-600 border-t-transparent dark:text-primary-400",
      secondary: "text-gray-600 border-t-transparent dark:text-gray-400",
      white: "text-white border-t-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(spinnerVariants({ size, variant }))}
          role="status"
          aria-label={label || "Loading"}
        >
          <span className="sr-only">{label || "Loading..."}</span>
        </div>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

// Loading component with text
export interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
  fullScreen?: boolean;
  className?: string;
}

export function Loading({
  text = "Loading...",
  size = "md",
  variant = "primary",
  fullScreen = false,
  className,
}: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={size} variant={variant} />
          {text && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 p-8", className)}>
      <Spinner size={size} variant={variant} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}

export { Spinner, spinnerVariants };
