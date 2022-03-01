module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  clearMocks: true,
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/test/**/*.test.ts'
  ],

  // Code Coverage
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
}
