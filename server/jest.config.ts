import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],

  clearMocks: true,
  verbose: true,

  // ✅ correct options
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  testTimeout: 20000,
  forceExit: true,
};

export default config;
