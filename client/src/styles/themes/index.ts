// src/styles/themes/index.ts
import { lightTheme } from './light.theme';
import { darkTheme } from './dark.theme';
import { hospitalTheme } from './hospital.theme';
import { highContrastTheme } from './high-contrast.theme';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  hospital: hospitalTheme,
  'high-contrast': highContrastTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeVars = typeof lightTheme.vars;

/**
 * Apply theme vars to :root (or any container)
 */
export function applyTheme(
  themeName: ThemeName,
  target: HTMLElement = document.documentElement
) {
  const theme = themes[themeName];
  Object.entries(theme.vars).forEach(([key, value]) => {
    target.style.setProperty(key, String(value));
  });
}
