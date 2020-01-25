module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        },
    },
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [
        '**/test/**/*.test.ts',
    ],

    // Code Coverage
    coverageReporters: ['lcovonly', 'text'],
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
};