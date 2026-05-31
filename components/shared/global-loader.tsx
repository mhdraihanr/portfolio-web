interface GlobalLoaderProps {
  isDark: boolean;
}

export function GlobalLoader({ isDark }: GlobalLoaderProps) {
  const backgroundClass = isDark ? "bg-gray-950" : "bg-white";
  const ringClass = isDark
    ? "border-white/20 border-t-white"
    : "border-gray-900/20 border-t-gray-900";
  const dotClass = isDark ? "bg-white" : "bg-gray-900";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${backgroundClass}`}
      role="status"
      aria-live="polite"
      aria-label="Preparing visual effects"
    >
      <div className="flex items-center justify-center">
        <div className="relative h-16 w-16">
          <div
            className={`h-16 w-16 rounded-full border-4 ${ringClass} animate-spin`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-2.5 w-2.5 rounded-full ${dotClass} animate-pulse`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
