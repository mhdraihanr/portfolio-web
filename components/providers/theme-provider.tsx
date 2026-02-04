"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider(props: Parameters<typeof NextThemesProvider>[0]) {
  return <NextThemesProvider {...props} />;
}
