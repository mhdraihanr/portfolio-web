"use client";

import { Button } from "@/components/ui";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import LightRays from "@/components/effects/light-rays";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { usePageLoading } from "@/contexts/page-loading-context";
import { useMobileWidth } from "@/hooks/use-mobile-width";
import type { Profile } from "@/types/profile";

// Code-split, and preloaded on mount so the title paints immediately.
const BlurText = dynamic(() => import("@/components/effects/blur-text"), {
  ssr: false,
});

// Import Delargo DT font
const delargoDT = localFont({
  src: "../../../../public/fonts/fonnts.com-DelargoDTCond-Bold.otf",
  display: "swap",
  variable: "--font-delargo",
});

interface HeroClientProps {
  profile: Profile | null;
}

export function HeroClient({ profile }: HeroClientProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLightRays, setShowLightRays] = useState(false);
  const [lightRaysReady, setLightRaysReady] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const pageReadySignaledRef = useRef(false);
  const { setPageReady } = usePageLoading();
  const isMobileWidth = useMobileWidth();

  useEffect(() => {
    setMounted(true);
    void import("@/components/effects/blur-text");
  }, []);

  // Paint the static hero first, then load WebGL.
  useEffect(() => {
    if (!mounted) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const frameId = requestAnimationFrame(() => {
      timeoutId = setTimeout(
        () => setShowLightRays(true),
        isMobileWidth ? 450 : 120,
      );
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mounted, isMobileWidth]);

  // Let the hero text drive perceived readiness so LCP does not wait for WebGL.
  useEffect(() => {
    if (!mounted || pageReadySignaledRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const frameId = requestAnimationFrame(() => {
      timeoutId = setTimeout(
        () => {
          pageReadySignaledRef.current = true;
          setPageReady();
          setAnimationsReady(true);
        },
        isMobileWidth ? 0 : 80,
      );
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mounted, isMobileWidth, setPageReady]);

  // WebGL readiness only controls the decorative background fade-in.
  const handleBackgroundReady = useCallback(() => {
    setLightRaysReady(true);
  }, []);

  // Theme-based configurations
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  // LightRays multiplies raysColor into an additive glow, so a dark color on
  // white reads as smoke. Light mode uses a dimmed brand-tinted ray instead.
  const lightRaysStyle = isDark
    ? {
        raysColor: "#ffffff",
        lightSpread: 2.5,
        rayLength: 2.8,
        saturation: 1,
        distortion: 0,
        fadeDistance: 1,
      }
    : {
        // Additive glow blooms wider on white than on black, so the beam is
        // narrowed here and dimmed with layer opacity (fadeDistance is clamped).
        raysColor: "#ef4444", // primary-500
        lightSpread: 0.55,
        rayLength: 0.7,
        saturation: 0.22,
        distortion: 0.1,
        fadeDistance: 1,
      };
  const bgClass = isDark ? "bg-gray-950" : "bg-white";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textTagline = isDark ? "text-gray-200" : "text-gray-900";
  const socialBg = isDark ? "bg-white/15" : "bg-gray-900/5";
  const socialBorder = isDark ? "border-white/30" : "border-gray-900/20";
  const socialHoverBg = isDark ? "hover:bg-white/25" : "hover:bg-gray-900/15";
  const socialText = isDark ? "text-white" : "text-gray-900";
  const socialHoverText = isDark
    ? "hover:text-primary-500"
    : "hover:text-primary-700";
  // Solid chips, not glass: blur had no visible effect on a smooth gradient
  // but still cost a compositing layer each (antislop R-10).
  const socialLink = `p-3 rounded-full ${socialBg} border-2 ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText}`;

  // Solid brand core + translucent casing (inset bevel, top sheen, halo).
  // No backdrop-filter: nothing behind the CTA to refract, and it keeps the
  // page at the R-10 cap of 2 blur elements.
  // Sheen is primary-400, not white: white sheen desaturates the red and drops
  // text contrast below AA. Hover darkens to primary-700 (6.47:1).
  const ctaButton = [
    "group relative overflow-hidden rounded-full px-8",
    "bg-primary-600",
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2",
    "before:bg-linear-to-b before:from-primary-400/14 before:to-transparent",
    "before:content-['']",
    "transition-all duration-300 ease-out",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_0_0_rgba(0,0,0,0.18),0_10px_30px_-10px_rgba(239,68,68,0.55)]",
    "hover:-translate-y-0.5 hover:bg-primary-700",
    "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.38),inset_0_-1px_0_0_rgba(0,0,0,0.18),0_16px_38px_-12px_rgba(239,68,68,0.7)]",
    "active:translate-y-0 active:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.24),inset_0_-1px_0_0_rgba(0,0,0,0.18),0_6px_18px_-10px_rgba(239,68,68,0.5)]",
    "focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2",
  ].join(" ");
  const ctaShade = isDark ? "ring-offset-gray-950" : "ring-offset-white";

  // Falls back to "Hello, I'm {first name}" when hero_greeting is empty.
  const greeting =
    profile?.hero_greeting?.trim() ||
    (() => {
      const firstName = profile?.full_name?.trim().split(" ")[0];
      return firstName ? `Hello, I'm ${firstName}` : "Hello, I'm Raihan";
    })();

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center overflow-hidden py-12 md:py-0"
    >
      {/* LightRays Background */}
      <div className={`absolute inset-0 ${bgClass}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            lightRaysReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <LightRays
            raysOrigin={isDark ? "right" : "top-right"}
            raysColor={lightRaysStyle.raysColor}
            raysSpeed={1.2}
            lightSpread={lightRaysStyle.lightSpread}
            rayLength={lightRaysStyle.rayLength}
            pulsating={false}
            fadeDistance={lightRaysStyle.fadeDistance}
            saturation={lightRaysStyle.saturation}
            followMouse={!isMobileWidth}
            mouseInfluence={isMobileWidth ? 0 : 0.15}
            noiseAmount={0}
            distortion={lightRaysStyle.distortion}
            className={`w-full h-full ${isDark ? "opacity-100" : "opacity-35"}`}
            mounted={showLightRays}
            onReady={handleBackgroundReady}
          />
        </div>
      </div>

      {/* Smooth Gradient Fade to Next Section */}
      <div
        className={`absolute inset-x-0 bottom-0 h-16 md:h-32 ${isDark ? "bg-linear-to-t from-gray-950 to-transparent" : "bg-linear-to-t from-white to-transparent"} pointer-events-none z-20`}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Greeting with Shiny Text Animation */}
          <div
            className={
              isMobileWidth
                ? "opacity-100 animate-mobile-soft-in-down"
                : `transition-opacity duration-700 ${
                    animationsReady
                      ? "opacity-100 animate-fade-in-down delay-200"
                      : "opacity-0"
                  }`
            }
          >
            <AnimatedShinyText
              className="text-lg md:text-xl font-medium inline-block"
              shimmerWidth={220}
            >
              {greeting}
            </AnimatedShinyText>
          </div>

          {/* Main Title with Blur Text Animation */}
          <div
            className={`transition-opacity duration-500 ${
              animationsReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {animationsReady && (
              <BlurText
                text={
                  profile?.hero_title ??
                  "Fullstack Developer turning ideas into working products."
                }
                delay={isMobileWidth ? 60 : 120}
                stepDuration={isMobileWidth ? 0.55 : 1}
                animateBy="words"
                direction="top"
                once
                className={`text-5xl md:text-6xl lg:text-7xl font-bold ${textTitle} leading-tight ${delargoDT.className}`}
              />
            )}
          </div>

          {/* Tagline & CTA Button - Horizontal Layout */}
          <div
            className={
              isMobileWidth
                ? "flex flex-col md:flex-row items-start gap-6 pt-10 opacity-100 animate-mobile-soft-in-up"
                : `flex flex-col md:flex-row items-start gap-6 pt-10 transition-opacity duration-700 ${
                    animationsReady
                      ? "opacity-100 animate-fade-in-up delay-600"
                      : "opacity-0"
                  }`
            }
          >
            {/* CTA Button - Left */}
            <div className="order-2 md:order-1">
              {profile?.cv_url ? (
                <Link href={profile.cv_url} target="_blank">
                  <Button
                    size="lg"
                    className={`${ctaButton} ${ctaShade}`}
                    rightIcon={
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:scale-105">
                        <FileText className="h-4 w-4" />
                      </span>
                    }
                  >
                    See My CV
                  </Button>
                </Link>
              ) : null}
            </div>

            {/* Tagline - Right */}
            <div className="order-1 md:order-2 md:text-right md:pl-16 flex-1">
              <p className={`text-base ${textTagline} leading-relaxed`}>
                {profile?.hero_tagline ??
                  "I'm a Fullstack Developer passionate about building web applications that are fast, responsive and easy to use. From designing interfaces to structuring backend systems, focus on writing clean code and using modern tools to bring ideas to life."}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div
            className={
              isMobileWidth
                ? `flex gap-4 pt-4 opacity-100 animate-mobile-soft-in-up delay-200 ${socialText}`
                : `flex gap-4 pt-4 transition-opacity duration-700 ${
                    animationsReady
                      ? "opacity-100 animate-fade-in-up delay-800"
                      : "opacity-0"
                  }`
            }
          >
            <a
              href="https://github.com/mhdraihanr"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLink}
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/mhdraihanr09"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLink}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:raihanrafliansyah1234@gmail.com"
              className={socialLink}
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
