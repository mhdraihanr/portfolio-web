import dynamic from 'next/dynamic';

// Dynamically import LightRays with no SSR to avoid hydration issues
const LightRaysClient = dynamic(() => import('./LightRays.jsx'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-950 dark:bg-black" />
  ),
});

interface LightRaysProps {
  raysOrigin?: 'top-center' | 'top-left' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
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
}

export default function LightRays(props: LightRaysProps) {
  return <LightRaysClient {...props} />;
}
