import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-white",
        muted: "text-gray-600 dark:text-gray-400",
        error: "text-red-600 dark:text-red-400",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      required: false,
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, required, className }))}
      {...props}
    />
  )
);

Label.displayName = "Label";

export { Label, labelVariants };
