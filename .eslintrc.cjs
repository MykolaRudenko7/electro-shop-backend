module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  overrides: [
    {
      env: {
        jest: true,
        node: true,
      },
      files: ['.eslintrc.{js,cjs}', '**/*.spec.js', '**/*.spec.jsx'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    camelcase: 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['#server', './server.js'],
          ['#utils', './src/utils'],
          ['#routes', './src/routes'],
          ['#middlewares', './src/middlewares'],
          ['#data', './src/data'],
          ['#models', './src/models'],
          ['#service', './src/service'],
          ['#exceptions', './src/exceptions'],
          ['#controllers', './src/controllers'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
}
