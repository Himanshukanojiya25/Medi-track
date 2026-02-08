// src/styles/responsive/breakpoints.ts

export const breakpoints = {
  xs: 480,   // small phones
  sm: 640,   // phones
  md: 768,   // tablets
  lg: 1024,  // laptops
  xl: 1280,  // desktops
  xxl: 1536, // large screens
} as const;

export type Breakpoint = keyof typeof breakpoints;
