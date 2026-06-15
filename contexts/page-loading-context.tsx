"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface PageLoadingContextType {
  isLoading: boolean;
  setPageReady: () => void;
}

const PageLoadingContext = createContext<PageLoadingContextType | undefined>(
  undefined,
);

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Track mounting state with fallback timeout
  useEffect(() => {
    // Set a fallback timeout in case setPageReady isn't called
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const setPageReady = () => {
    setIsLoading(false);
  };

  return (
    <PageLoadingContext.Provider value={{ isLoading, setPageReady }}>
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext);
  if (context === undefined) {
    throw new Error("usePageLoading must be used within PageLoadingProvider");
  }
  return context;
}
