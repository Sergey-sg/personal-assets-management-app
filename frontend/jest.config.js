/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.svg$": "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest"
  },
  // roots: ["<rootDir>/src"],
  // setupFilesAfterEnv: [
  //   "@testing-library/react/cleanup-after-each",
  //   "@testing-library/jest-dom/extend-expect"
  // ],
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};