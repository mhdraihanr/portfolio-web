import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      xl: "max-w-[1400px]",
      full: "max-w-full",
    },
    padding: {
      none: "",
      sm: "px-4",
      md: "px-4 md:px-6",
      lg: "px-4 md:px-8 lg:px-12",
    },
  },
  defaultVariants: {
    size: "lg",
    padding: "md",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, className }))}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

// Section component for page sections
const sectionVariants = cva("w-full", {
  variants: {
    padding: {
      none: "",
      sm: "py-8",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-20 lg:py-24",
      xl: "py-20 md:py-28 lg:py-32",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  containerPadding?: "none" | "sm" | "md" | "lg";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      padding,
      containerSize = "lg",
      containerPadding = "md",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ padding, className }))}
        {...props}
      >
        <Container size={containerSize} padding={containerPadding}>
          {children}
        </Container>
      </section>
    );
  }
);

Section.displayName = "Section";

export { Container, Section, containerVariants, sectionVariants };
