import React, { createContext, useContext } from "react";

type ThemeMode = "light" | "dark";

const ThemeContext = createContext<ThemeMode>("light");

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={mode}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
