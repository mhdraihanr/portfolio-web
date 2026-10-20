import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        // No opacity modifier: diluting the base colour dropped light mode to
        // 1.47:1. The base must also leave headroom for the shimmer to read,
        // so dark mode sits at gray-400 (7.93:1) rather than gray-300, which
        // was too close to the white highlight to notice.
        "mx-auto max-w-md text-gray-600 dark:text-gray-400",

        // Shine effect
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/90 via-50% to-transparent dark:via-white",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
