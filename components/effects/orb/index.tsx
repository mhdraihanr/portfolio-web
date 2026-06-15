import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
  className?: string;
}

// Dynamically import Orb with no SSR to avoid hydration issues
const OrbClient = dynamic(
  () => import("./orb.jsx") as Promise<{ default: ComponentType<OrbProps> }>,
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
  },
);

export default function Orb(props: OrbProps) {
  return <OrbClient {...props} />;
}
