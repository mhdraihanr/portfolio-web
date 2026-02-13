"use client";

import { Button } from "@/components/ui";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import LightRays from "@/components/LightRays";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import BlurText from "@/components/BlurText";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { usePageLoading } from "@/contexts/PageLoadingContext";

// Import Delargo DT font
const delargoDT = localFont({
  src: "../../../public/fonts/fonnts.com-DelargoDTCond-Bold.otf",
  display: "swap",
  variable: "--font-delargo",
});

export function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const { setPageReady } = usePageLoading();

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Trigger animations after a delay when page is ready
  const handleBackgroundReady = () => {
    setPageReady();
    // Wait for loading indicator to fade out, then start animations
    setTimeout(() => {
      setAnimationsReady(true);
    }, 400);
  };

  // Theme-based configurations
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  const raysColor = isDark ? "#ffffff" : "#1f2937"; // white for dark, gray-800 for light
  const bgClass = isDark ? "bg-gray-950" : "bg-white";
  const textGreeting = isDark ? "text-gray-300" : "text-gray-600";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textTagline = isDark ? "text-gray-200" : "text-gray-900";
  const socialBg = isDark ? "bg-white/15" : "bg-gray-900/5";
  const socialBorder = isDark ? "border-white/30" : "border-gray-900/70";
  const socialHoverBg = isDark ? "hover:bg-white/25" : "hover:bg-gray-900/15";
  const socialText = isDark ? "text-white" : "text-gray-900";
  const socialHoverText = isDark
    ? "hover:text-primary-500"
    : "hover:text-primary-700";

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center overflow-hidden py-12 md:py-0"
    >
      {/* LightRays Background */}
      <div className={`absolute inset-0 ${bgClass}`}>
        <LightRays
          raysOrigin="right"
          raysColor={raysColor}
          raysSpeed={1.2}
          lightSpread={2.5}
          rayLength={2.8}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0}
          distortion={0}
          className="w-full h-full"
          mounted={mounted}
          onReady={handleBackgroundReady}
        />
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
            className={`transition-opacity duration-700 ${
              animationsReady
                ? "opacity-100 animate-fade-in-down delay-200"
                : "opacity-0"
            }`}
          >
            <AnimatedShinyText
              className={`text-lg md:text-xl ${textGreeting} font-medium inline-block`}
              shimmerWidth={150}
            >
              Hello, I&apos;m Raihan
            </AnimatedShinyText>
          </div>

          {/* Main Title with Blur Text Animation */}
          <div
            className={`transition-opacity duration-500 ${
              animationsReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <BlurText
              text="Fullstack Developer ━ designing clarity inside powerful systems"
              delay={120}
              animateBy="words"
              direction="top"
              className={`text-5xl md:text-6xl lg:text-7xl font-bold ${textTitle} leading-tight ${delargoDT.className}`}
            />
          </div>

          {/* Tagline & CTA Button - Horizontal Layout */}
          <div
            className={`flex flex-col md:flex-row items-start gap-6 pt-10 transition-opacity duration-700 ${
              animationsReady
                ? "opacity-100 animate-fade-in-up delay-600"
                : "opacity-0"
            }`}
          >
            {/* CTA Button - Left */}
            <div className="order-2 md:order-1">
              <Link
                href="https://drive.google.com/file/d/1VXDuHuFYlxPYEE_akyG5me4bSjPm9GQS/view?usp=sharing"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8"
                  rightIcon={<FileText className="h-5 w-5" />}
                >
                  See My CV
                </Button>
              </Link>
            </div>

            {/* Tagline - Right */}
            <div className="order-1 md:order-2 md:text-right md:pl-16 flex-1">
              <p className={`text-base ${textTagline} leading-relaxed`}>
                I&apos;m a Fullstack Developer passionate about building web
                applications that are fast, responsive and
                <br />
                easy to use. From designing interfaces to structuring backend
                systems, focus on writing clean
                <br /> code and using modern tools to bring ideas to life.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div
            className={`flex gap-4 pt-4 transition-opacity duration-700 ${
              animationsReady
                ? "opacity-100 animate-fade-in-up delay-800"
                : "opacity-0"
            }`}
          >
            <a
              href="https://github.com/mhdraihanr"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-md border-2 ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText} shadow-lg`}
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/mhdraihanr09"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-md border-2 ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText} shadow-lg`}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:raihanrafliansyah1234@gmail.com"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-md border-2 ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText} shadow-lg`}
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
