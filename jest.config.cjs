const { defaults } = require("jest-config");

module.exports = {};

module.exports = {
  ...defaults,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [],
  globals: {
    "ts-jest": {
      // Konfigurasi TypeScript jika digunakan
    },
    __DEV__: true,
  },
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
};
