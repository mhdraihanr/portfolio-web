pnpm dlx shadcn@latest add @react-bits/LightRays-JS-CSS

<div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
  <LightRays
    raysOrigin="right"
    raysColor="#ffffff"
    raysSpeed={1.5}
    lightSpread={1.5}
    rayLength={2.8}
    pulsating={false}
    fadeDistance={1}
    saturation={1}
    followMouse
    mouseInfluence={0.25}
    noiseAmount={0}
    distortion={0}
  />
</div>

//------LOOP CARD--------///
import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
{ node: <SiReact />, title: "React", href: "https://react.dev" },
{ node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
{ node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
{ node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources
const imageLogos = [
{ src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
{ src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
{ src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];

function App() {
return (

<div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
{/_ Basic horizontal loop _/}
<LogoLoop
        logos={techLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />

      {/* Vertical loop with deceleration on hover */}
      <LogoLoop
        logos={techLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={0}
        fadeOut

useCustomRender={false}
/>

</div>
);
}

//---------- ORB BACKGROUND FOR WORK EXPERIENCE SECTION ------////

pnpm dlx shadcn@latest add @react-bits/Orb-JS-CSS

<div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
  <Orb
    hue={206}
    hoverIntensity={0.35}
    rotateOnHover={false}
    forceHoverState
  />
</div>

// IMPLEMENTATION IN EXPERIENCE SECTION:
// File: app/(public)/components/experience-client.tsx
//
// "use client";
// import Orb from "@/components/Orb";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
//
// export function ExperienceClient({ experiences }) {
// const { theme, resolvedTheme } = useTheme();
// const [mounted, setMounted] = useState(false);
//
// // Prevent hydration mismatch
// useEffect(() => {
// const timer = setTimeout(() => setMounted(true), 0);
// return () => clearTimeout(timer);
// }, []);
//
// const currentTheme = mounted ? theme || resolvedTheme : "dark";
// const isDark = currentTheme === "dark";
// const bgClass = isDark ? "bg-gray-950" : "bg-white";
//
// return (
// <section className="relative pt-12 pb-20 overflow-hidden">
// {/_ Orb Background _/}
// <div className={`absolute inset-0 ${bgClass}`}>
// {mounted && (
// <Orb
// hue={206}
// hoverIntensity={0.35}
// rotateOnHover={false}
// forceHoverState
// backgroundColor={isDark ? "#030712" : "#ffffff"}
// className="w-full h-full"
// />
// )}
// </div>
//
// {/_ Content with z-10 _/}
// <div className="relative z-10 container mx-auto">
// {/_ Timeline content _/}
// </div>
// </section>
// );
// }
//
// KEY IMPLEMENTATION NOTES:
// 1. Split into Server (experience.tsx) and Client (experience-client.tsx) components
// 2. Server component fetches data, Client component renders Orb
// 3. Mounted state prevents hydration mismatch
// 4. Theme-aware background color (white for light, dark for dark mode)
// 5. forceHoverState keeps animation always active
// 6. className="w-full h-full" ensures Orb fills container
// 7. Content uses z-10 to stay above Orb background
