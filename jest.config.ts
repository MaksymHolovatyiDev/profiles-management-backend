module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testSequences: ['./tests/auth.test.ts', './tests/users.test.ts'],
  moduleDirectories: ['node_modules', './src'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
