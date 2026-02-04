import dynamic from "next/dynamic";
import { ReactNode, CSSProperties } from "react";

// Dynamically import LogoLoop with no SSR to avoid hydration issues
const LogoLoopClient = dynamic(() => import("./LogoLoop.jsx"), {
  ssr: false,
  loading: () => <div className="w-full h-32 bg-transparent animate-pulse" />,
});

export interface LogoItem {
  node?: ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export default function LogoLoop(props: LogoLoopProps) {
  return <LogoLoopClient {...props} />;
}
