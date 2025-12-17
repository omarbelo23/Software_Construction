export default {
  testEnvironment: "node",

  // Only run integration tests
  testMatch: ["**/tests/integration/**/*.test.js"],

  // No transforms needed (pure Node + ESM)
  transform: {},

  // Clear output so evaluators can read results
  verbose: true,

  testTimeout: 60000,

  // Optional: coverage (nice to have, not required)
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  coverageDirectory: "coverage"
};
