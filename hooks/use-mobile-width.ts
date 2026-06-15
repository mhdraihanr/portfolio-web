"use client";

import { useSyncExternalStore } from "react";

const MOBILE_WIDTH_QUERY = "(width <= 767px)";

export function useMobileWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(MOBILE_WIDTH_QUERY);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(MOBILE_WIDTH_QUERY).matches,
    () => false,
  );
}
