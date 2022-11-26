module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    "indent": ["error", 2],
  },
};