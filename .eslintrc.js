module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  plugins: ['import', '@typescript-eslint'],
  env: {
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.js'],
      },
    },
  },
  rules: {
    quotes: [0, 'single'],
    camelcase: 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        ts: 'never',
      },
    ],
    'max-len': ['error', { code: 120 }],
    'implicit-arrow-linebreak': 'off',
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'no-mixed-operators': 'off',
    'consistent-return': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'newline-per-chained-call': 'off',
    'arrow-body-style': ['error', 'as-needed'],
  },
};
