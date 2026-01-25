import type { Config } from "jest";

const config: Config = {
  /* =========================
     CORE
  ========================= */
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".", // 🔥 VERY IMPORTANT for relative paths

  /* =========================
     TEST DISCOVERY
  ========================= */
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],

  /* =========================
     TYPESCRIPT
  ========================= */
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
      isolatedModules: true,
    },
  },

  /* =========================
     MODULE RESOLUTION
     (NO @, ONLY RELATIVE)
  ========================= */
  moduleDirectories: ["node_modules", "<rootDir>"],

  /* =========================
     ISOLATION & SAFETY
  ========================= */
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  /* =========================
     STABILITY (Mongo / Mongoose)
  ========================= */
  testTimeout: 30000,
  detectOpenHandles: true,
  maxWorkers: 1, // 🔥 REQUIRED for mongoose

  /* =========================
     SETUP
  ========================= */
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],

  /* =========================
     COVERAGE (DISABLED FOR NOW)
  ========================= */
  collectCoverage: false,
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
    "!src/config/**",
    "!src/types/**",
  ],
  coverageThreshold: undefined,

  /* =========================
     OUTPUT
  ========================= */
  verbose: false,

  /* =========================
     EXIT BEHAVIOR
  ========================= */
  forceExit: false,
};

export default config;
