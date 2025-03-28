export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    // Handle module aliases (if you're using them in vite.config.js)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
