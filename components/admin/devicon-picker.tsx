"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviconEntry {
  name: string;
  altnames: string[];
  tags: string[];
  versions: {
    svg: string[];
    font: string[];
  };
  color: string;
  aliases: { base: string; alias: string }[];
}

interface DeviconPickerProps {
  value?: string;
  valueSvg?: string;
  onSelect: (data: { icon: string; icon_svg: string }) => void;
}

const DEVICON_JSON_URL =
  "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export function DeviconPicker({
  value,
  valueSvg,
  onSelect,
}: DeviconPickerProps) {
  const [icons, setIcons] = useState<DeviconEntry[]>([]);
  const [filtered, setFiltered] = useState<DeviconEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    value || null,
  );
  const [selectedSvg, setSelectedSvg] = useState<string | null>(
    valueSvg || null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch devicon.json on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchIcons() {
      try {
        setLoading(true);
        const res = await fetch(DEVICON_JSON_URL);
        if (!res.ok) throw new Error("Failed to fetch devicon data");
        const data: DeviconEntry[] = await res.json();
        if (!cancelled) {
          setIcons(data);
          setFiltered(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load icons");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchIcons();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync external value changes
  useEffect(() => {
    setSelectedIcon(value || null);
    setSelectedSvg(valueSvg || null);
  }, [value, valueSvg]);

  // Filter icons based on search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(icons);
      return;
    }
    const query = search.toLowerCase();
    setFiltered(
      icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(query) ||
          icon.altnames.some((alt) => alt.toLowerCase().includes(query)) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(query)),
      ),
    );
  }, [search, icons]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const getIconClass = useCallback((icon: DeviconEntry): string => {
    // Prefer "original", then "plain", then first available
    const preferredVersions = ["original", "plain", "line"];
    for (const version of preferredVersions) {
      if (icon.versions.font.includes(version)) {
        return `devicon-${icon.name}-${version} colored`;
      }
    }
    if (icon.versions.font.length > 0) {
      return `devicon-${icon.name}-${icon.versions.font[0]} colored`;
    }
    return "";
  }, []);

  const getSvgUrl = useCallback((icon: DeviconEntry): string => {
    const preferredVersions = ["original", "plain", "line"];
    for (const version of preferredVersions) {
      if (icon.versions.svg.includes(version)) {
        return `${CDN_BASE}/${icon.name}/${icon.name}-${version}.svg`;
      }
    }
    if (icon.versions.svg.length > 0) {
      return `${CDN_BASE}/${icon.name}/${icon.name}-${icon.versions.svg[0]}.svg`;
    }
    return "";
  }, []);

  const handleSelect = useCallback(
    (icon: DeviconEntry) => {
      const iconClass = getIconClass(icon);
      const svgUrl = getSvgUrl(icon);
      setSelectedIcon(iconClass);
      setSelectedSvg(svgUrl);
      onSelect({ icon: iconClass, icon_svg: svgUrl });
      setIsOpen(false);
      setSearch("");
    },
    [getIconClass, getSvgUrl, onSelect],
  );

  const handleClear = useCallback(() => {
    setSelectedIcon(null);
    setSelectedSvg(null);
    onSelect({ icon: "", icon_svg: "" });
  }, [onSelect]);

  // Check if icon name matches the selected one
  const isSelected = useCallback(
    (icon: DeviconEntry) => {
      if (!selectedIcon) return false;
      return selectedIcon.includes(`devicon-${icon.name}-`);
    },
    [selectedIcon],
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Icon Preview / Trigger Button */}
      <div
        className="flex items-center gap-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIcon || selectedSvg ? (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedSvg ? (
                <img
                  src={selectedSvg}
                  alt="Selected icon"
                  className="w-6 h-6 dark:invert"
                />
              ) : selectedIcon ? (
                <i className={`${selectedIcon} text-2xl`}></i>
              ) : null}
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {selectedIcon || selectedSvg}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 flex-1">
            <Search className="w-4 h-4" />
            <span className="text-sm">
              Search & select an icon from Devicon...
            </span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[400px] flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search icons... (e.g., react, python, docker)"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {filtered.length} icons found
              {search && ` for "${search}"`}
            </p>
          </div>

          {/* Icon Grid */}
          <div className="overflow-y-auto flex-1 p-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-400">
                  Loading icons...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-500">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">
                  No icons found for &quot;{search}&quot;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                {filtered.slice(0, 120).map((icon) => {
                  const svgUrl = getSvgUrl(icon);
                  const iconClass = getIconClass(icon);
                  const selected = isSelected(icon);

                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => handleSelect(icon)}
                      title={icon.name}
                      className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selected
                          ? "bg-primary/10 dark:bg-primary/20 ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-0.5 right-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      {iconClass ? (
                        <i className={`${iconClass} text-2xl`}></i>
                      ) : svgUrl ? (
                        <img
                          src={svgUrl}
                          alt={icon.name}
                          className="w-6 h-6 dark:invert"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded" />
                      )}
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-center">
                        {icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {filtered.length > 120 && (
              <p className="text-xs text-center text-gray-400 mt-3">
                Showing first 120 results. Type to narrow down your search.
              </p>
            )}
          </div>

          {/* Footer with link to devicon.dev */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <a
              href="https://devicon.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Browse all icons on devicon.dev →
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
