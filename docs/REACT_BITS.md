pnpm dlx shadcn@latest add @react-bits/LightRays-JS-CSS

## Hero LightRays Performance Notes

The homepage hero keeps the React Bits `LightRays` WebGL background and `BlurText` title animation, but the startup path is optimized for Lighthouse performance metrics:

- `Hero` paints first, then starts the text animation readiness path after the next frame.
- Global loading is released by hero text readiness instead of waiting for the decorative WebGL background.
- `Hero` mounts `LightRays` after the initial paint path and fades it in after the first WebGL frame is ready.
- `BlurText` is still used for the hero title; it is not removed or downgraded.
- `LightRays` caps device pixel ratio at `1.5` to reduce canvas fill-rate and GPU work.
- `LightRays` uses passive `resize` and `mousemove` listeners.
- The animation loop pauses rendering work while `document.hidden` is true.
- Users with `prefers-reduced-motion: reduce` skip WebGL initialization and are marked ready after a frame.

These changes target high Total Blocking Time, Speed Index, and "minimize main-thread work" diagnostics without removing the global loader or the WebGL visual style.

## Priority 3 Approach A: Hero Text/WebGL Decoupling

The latest performance pass decouples the largest above-the-fold text from `LightRays` readiness:

- `BlurText` and surrounding hero content now start from a lightweight hero-readiness timer after initial paint.
- `LightRays` readiness no longer blocks `setPageReady()` or the hero title animation.
- The WebGL canvas uses an opacity transition so it can appear smoothly after the text is already visible.
- This improves the LCP and Speed Index path because the visible hero copy is no longer held behind shader compilation and the first WebGL render.
- Visual quality remains: `BlurText`, global loading, and `LightRays` are all retained.

## Mobile Hero LCP Animation Phase 1 Notes

The mobile hero keeps the `BlurText` title animation and still avoids rendering the title before the client readiness gate. To reduce mobile LCP pressure without changing that visual constraint:

- Mobile `BlurText` uses shorter per-word delay, shorter step duration, smaller blur, and smaller vertical travel.
- Desktop `BlurText` timing and animation distance remain unchanged.
- Mobile `GlobalLoader` no longer renders as a full-screen blocker, so it cannot cover the hero while the client starts the animation.
- Mobile `LightRays` starts later than desktop, giving the main thread more room to hydrate and start the title animation first.
- The title is not replaced with a static fallback; the animated reveal remains the mobile title path.

## Below-the-fold Lazy Loading Notes

The homepage keeps the hero interactive path isolated from lower sections:

- `app/(public)/page.tsx` imports `Hero` directly instead of importing every public section from the barrel file.
- `app/(public)/components/lazy-home-client-sections.tsx` uses `next/dynamic` inside a Client Component, matching Next.js guidance that Client Component lazy loading and `ssr: false` should live in Client Components.
- `About` is now server-first for skills data. `app/(public)/components/about.tsx` fetches cached visible skills on the server, while `app/(public)/components/about-client.tsx` keeps the existing `SplitText`, `ScrollReveal`, and icon UI.
- `Certificates` is loaded only near the viewport so React Bits `LogoLoop` and certificate card animation work are deferred.
- `Work Experience` keeps server-side cached Supabase data fetching, but `app/(public)/components/lazy-experience-client.tsx` defers the client timeline, theme hook, and React Bits `Orb` WebGL code until the section is near the viewport.
- Lightweight blank placeholders reserve vertical space to limit layout shift while the deferred sections load.

This is Priority 2 Approach A: reduce initial JavaScript, boot-up work, Total Blocking Time, and main-thread pressure without changing the hero `BlurText`, global WebGL loader, or visual content.

## Package Import Optimization Notes

The Next.js config enables `experimental.optimizePackageImports` for `lucide-react`:

- This keeps the approved Phase 1 scope limited to package import optimization.
- The icon package has many exports and is used across public/admin UI, so optimizing imports can reduce package import overhead.
- Font-display and Devicon CDN behavior are intentionally unchanged in this pass.

## Mobile ScrollReveal Notes

`components/shared/scroll-reveal.tsx` keeps repeatable scroll reveal animations on non-mobile widths, but phone/mobile widths now animate each reveal only once:

- Mobile detection uses `window.matchMedia("(width <= 767px)")`, matching the Tailwind `md` boundary.
- On mobile, the observer stops after the first intersection so elements stay visible when the user scrolls away and back.
- On desktop/tablet widths above 767px, existing repeatable behavior remains unchanged unless a component explicitly passes `once`.
- `prefers-reduced-motion` behavior remains unchanged.

## Mobile Runtime Simplification Notes

The latest mobile performance pass reduces below-the-fold client runtime and layout work without removing the hero `BlurText` animation:

- `components/shared/scroll-reveal.tsx` now disables reveal animation styles entirely on phone/mobile widths, so mobile sections render visible without `opacity`/`transform` transition work.
- `app/(public)/components/certificates.tsx` keeps the animated React Bits `LogoLoop` on non-mobile widths, but phone/mobile widths render a static certificate card grid instead of the scrolling loop.
- `app/(public)/components/experience-client.tsx` keeps the React Bits `Orb` background on non-mobile widths, but skips mounting it on phone/mobile widths.
- The hero still retains mobile `BlurText`, while heavier decorative animation work is pushed out of the mobile critical path.
- A Chrome DevTools mobile trace after these changes showed forced reflow dropping to roughly `162 ms`, while the remaining render-blocking requests were narrowed to two internal CSS assets and the largest remaining third-party transfer stayed the Devicon SVG traffic from JSDelivr.

## Cache Lifetime and LCP Phase 1-2 Notes

The homepage now targets Lighthouse's "Use efficient cache lifetimes" audit without changing the React Bits visual style:

- Public static assets that are safe to cache now receive `Cache-Control: public, max-age=31536000, immutable` from `next.config.ts`.
- Covered paths include local font files under `/fonts/:path*`, the current `/profile.jpg`, and root public SVG assets.
- Next.js generated assets under `/_next/static/*` already had immutable cache headers and remain handled by Next.js.
- The About profile image no longer uses `priority`, because it is below the hero path and should not compete with the largest-contentful-paint candidate.
- The About profile image keeps explicit dimensions and now declares responsive `sizes` so `next/image` can select an appropriate optimized width.
- Future admin-managed profile image replacement should use versioned URLs before relying on immutable caching, so browsers do not keep stale overwritten images.

## Priority 4B: Homepage TTFB Cache Notes

The homepage keeps `Projects` and `Work Experience` server-rendered for SEO, but their public Supabase reads no longer use request cookies in the hot path:

- `lib/supabase/public-data.ts` creates a public anon Supabase client without `cookies()`.
- Featured projects, work experience, and visible skills queries are wrapped in Next.js cross-request cache with 5-minute revalidation.
- The UI in `app/(public)/components/projects.tsx` stays server-rendered, while `Experience` and `About` now split server data from client-only visual/interactivity code.
- This targets Lighthouse/Chrome DevTools `Server responded slowly` / document latency without moving SEO-relevant sections to client-only rendering.

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
