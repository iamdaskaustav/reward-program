module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  injectGlobals: true,
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Use babel-jest for transforming JS/JSX files
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Update to JS setup file if you're using JS
};
