"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative tilted editor window for the hero.
 *
 * Static markup on purpose: a syntax highlighter (Shiki/Prism) would ship a
 * grammar engine to colour ~25 tokens that never change.
 */
const CODE_LINES: Array<Array<[string, string]>> = [
  [
    ["package", "kw"],
    [" main", "fg"],
  ],
  [],
  [
    ["import", "kw"],
    [" ", "fg"],
    ['"fmt"', "str"],
  ],
  [],
  [
    ["type", "kw"],
    [" ", "fg"],
    ["Dev", "ty"],
    [" struct{ Name, Role, Education ", "fg"],
    ["string", "ty"],
    [" }", "fg"],
  ],
  [],
  [
    ["func", "kw"],
    [" ", "fg"],
    ["main", "fn"],
    ["() {", "fg"],
  ],
  [
    ["  me := ", "fg"],
    ["Dev", "ty"],
    ["{", "fg"],
  ],
  [
    ["    Name:      ", "fg"],
    ['"Raihan"', "str"],
    [",", "fg"],
  ],
  [
    ["    Role:      ", "fg"],
    ['"Fullstack Dev"', "str"],
    [",", "fg"],
  ],
  [
    ["    Education: ", "fg"],
    ['"Telkom University"', "str"],
    [",", "fg"],
  ],
  [["  }", "fg"]],
  [
    ["  ", "fg"],
    ["fmt", "id"],
    [".Printf(", "fg"],
    ['"%s | %s @ %s\\n"', "str"],
    [",", "fg"],
  ],
  [["    me.Name, me.Role, me.Education)", "fg"]],
  [["}", "fg"]],
];

const TOKEN_CLASS: Record<string, string> = {
  kw: "text-primary-600 dark:text-primary-400",
  str: "text-gray-700 dark:text-gray-200",
  fn: "text-gray-900 dark:text-white",
  ty: "text-primary-600 dark:text-primary-300",
  id: "text-gray-900 dark:text-gray-50",
  num: "text-primary-600 dark:text-primary-300",
  fg: "text-gray-600 dark:text-gray-400",
};

export default function CodeWindow({ className = "" }: { className?: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--parallax-x", `${(-offsetY * 5).toFixed(2)}deg`);
        el.style.setProperty("--parallax-y", `${(offsetX * 5).toFixed(2)}deg`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-12 rounded-[50%] bg-gray-900/10 blur-2xl dark:bg-black/40" />

      <div className="animate-code-window-float [perspective:1600px] [transform-style:preserve-3d]">
        <div
          ref={tiltRef}
          className="relative [transform-style:preserve-3d] [transform:rotateX(calc(20deg_+_var(--parallax-x,0deg)))_rotateY(calc(-11deg_+_var(--parallax-y,0deg)))] transition-transform duration-300 ease-out"
        >
          <div className="absolute inset-0 rounded-xl border border-gray-900/10 bg-gray-900/5 [transform:translate3d(-44px,28px,-64px)] dark:border-white/10 dark:bg-gray-950/20" />
          <div className="absolute inset-0 rounded-xl border border-gray-900/10 bg-gray-900/8 [transform:translate3d(-22px,14px,-32px)] dark:border-white/10 dark:bg-gray-950/25" />

          <div className="relative overflow-hidden rounded-xl border-t border-gray-900/10 bg-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_-1px_0_0_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-gray-950/35 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_-1px_0_0_rgba(0,0,0,0.4)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(239,68,68,0.1),transparent_65%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(239,68,68,0.07),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-gray-900/3 via-transparent to-transparent dark:from-white/3" />

            <div className="relative flex items-center gap-2 border-b border-gray-900/8 px-4 py-3 dark:border-white/8">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-900/15 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-900/15 dark:bg-white/20" />
              <span className="ml-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                main.go
              </span>
            </div>

            <pre className="relative overflow-hidden px-4 py-4 font-mono text-[12px] leading-5 sm:text-[13px] sm:leading-6">
              <code>
                {CODE_LINES.map((tokens, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="w-3 shrink-0 select-none text-right text-gray-600">
                      {index + 1}
                    </span>
                    <span className="whitespace-pre">
                      {tokens.map(([text, kind], tokenIndex) => (
                        <span key={tokenIndex} className={TOKEN_CLASS[kind]}>
                          {text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
