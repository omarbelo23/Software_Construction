export default {
    testEnvironment: "node",
  
    // Only run unit tests
    testMatch: ["**/tests/unit/**/*.test.js"],
  
    // ESM project -> no transforms needed
    transform: {},
  
    verbose: true,
  
    collectCoverageFrom: [
      "src/**/*.js",
      "!src/**/*.test.js"
    ],
    coverageDirectory: "coverage-unit"
  };