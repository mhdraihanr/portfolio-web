import dynamic from "next/dynamic";

// Dynamically import LightRays with no SSR - optimized for no flicker
const LightRaysClient = dynamic(() => import("./LightRays.jsx"), {
  ssr: false,
});

interface LightRaysProps {
  raysOrigin?:
    | "top-center"
    | "top-left"
    | "top-right"
    | "left"
    | "right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
  mounted?: boolean;
  onReady?: () => void;
}

export default function LightRays(props: LightRaysProps) {
  // Only render if mounted to prevent SSR issues
  if (!props.mounted) return null;
  return <LightRaysClient {...props} />;
}
