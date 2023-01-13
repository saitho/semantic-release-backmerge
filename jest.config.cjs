module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
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
