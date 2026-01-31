module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/index.{js}',
    '!src/migrations/**/*.js',
    '!src/seeders/**/*.js',
    '!src/routes/**/*.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', 'src/controllers/testController/test.js'],
};
