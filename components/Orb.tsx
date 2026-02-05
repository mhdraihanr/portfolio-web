import dynamic from "next/dynamic";

// Dynamically import Orb with no SSR to avoid hydration issues
const OrbClient = dynamic(() => import("./Orb.jsx"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
  className?: string;
}

export default function Orb(props: OrbProps) {
  return <OrbClient {...props} />;
}
