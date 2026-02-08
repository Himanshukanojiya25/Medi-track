// src/styles/animations/motion.tokens.ts

export const motion = {
  duration: {
    instant: '80ms',
    fast: '120ms',
    normal: '180ms',
    slow: '260ms',
  },

  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  distance: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
} as const;

export type MotionTokens = typeof motion;
