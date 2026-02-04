"use client";

import { Button } from "@/components/ui";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import LightRays from "@/components/LightRays";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

// Import Delargo DT font
const delargoDT = localFont({
  src: "../../../public/fonts/fonnts.com-DelargoDTCond-Bold.otf",
  display: "swap",
  variable: "--font-delargo",
});

export function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Theme-based configurations
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  const raysColor = isDark ? "#ffffff" : "#1f2937"; // white for dark, gray-800 for light
  const bgClass = isDark ? "bg-gray-950" : "bg-white";
  const textGreeting = isDark ? "text-gray-300" : "text-gray-600";
  const textTitle = isDark ? "text-white" : "text-gray-900";
  const textTagline = isDark ? "text-gray-200" : "text-gray-700";
  const socialBg = isDark ? "bg-white/10" : "bg-gray-900/10";
  const socialBorder = isDark ? "border-white/20" : "border-gray-900/20";
  const socialHoverBg = isDark ? "hover:bg-white/20" : "hover:bg-gray-900/20";
  const socialText = isDark ? "text-white" : "text-gray-900";
  const socialHoverText = isDark
    ? "hover:text-primary-400"
    : "hover:text-primary-600";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center overflow-hidden py-12 md:py-0">
      {/* LightRays Background */}
      <div className={`absolute inset-0 ${bgClass}`}>
        {mounted && (
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
          />
        )}
      </div>

      {/* Smooth Gradient Fade to Next Section */}
      <div
        className={`absolute inset-x-0 bottom-0 h-16 md:h-32 ${isDark ? "bg-linear-to-t from-gray-950 to-transparent" : "bg-linear-to-t from-white to-transparent"} pointer-events-none z-20`}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl space-y-4">
          {/* Greeting */}
          <div className="animate-fade-in-up">
            <p className={`text-lg md:text-xl ${textGreeting} font-medium`}>
              Hello, I&apos;m Raihan
            </p>
          </div>

          {/* Main Title */}
          <div className="animate-fade-in-up delay-200">
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold ${textTitle} leading-tight ${delargoDT.className}`}
            >
              Fullstack Developer
            </h1>
          </div>

          {/* Tagline */}
          <div className="pt-2 animate-fade-in-up delay-400">
            <p
              className={`text-lg md:text-xl lg:text-2xl ${textTagline} max-w-3xl leading-relaxed`}
            >
              Building modern web applications with passion.
              <br />
              Turning ideas into elegant, scalable solutions.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-start pt-6 animate-fade-in-up delay-600">
            <Link href="/cv.pdf" target="_blank" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full"
                rightIcon={<FileText className="h-5 w-5" />}
              >
                See My CV
              </Button>
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-4 animate-fade-in-up delay-800">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-sm border ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText}`}
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-sm border ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText}`}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:your.email@example.com"
              className={`p-3 rounded-full ${socialBg} backdrop-blur-sm border ${socialBorder} ${socialHoverBg} hover:scale-110 transition-all duration-300 ${socialText} ${socialHoverText}`}
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
