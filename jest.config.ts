/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export default config;
