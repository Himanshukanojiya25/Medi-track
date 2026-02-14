// src/styles/responsive/breakpoints.ts

export const breakpoints = {
  xs: 480,   // small phones
  sm: 640,   // phones
  md: 768,   // tablets
  lg: 1024,  // laptops
  xl: 1280,  // desktops
  xxl: 1536, // large screens
} as const;

export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
  xxl: `@media (max-width: ${breakpoints.xxl}px)`,
  
  // Min-width queries
  minXs: `@media (min-width: ${breakpoints.xs}px)`,
  minSm: `@media (min-width: ${breakpoints.sm}px)`,
  minMd: `@media (min-width: ${breakpoints.md}px)`,
  minLg: `@media (min-width: ${breakpoints.lg}px)`,
  minXl: `@media (min-width: ${breakpoints.xl}px)`,
  minXxl: `@media (min-width: ${breakpoints.xxl}px)`,
  
  // Range queries
  smOnly: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  mdOnly: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lgOnly: `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = keyof typeof mediaQueries;