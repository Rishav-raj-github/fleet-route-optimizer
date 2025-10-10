const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import-x');

module.exports = [
  {
    ignores: ['dist/**', 'coverage/**', 'docs/**', 'build/**'],
  },
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'import/extensions': ['error', 'ignorePackages'],
      'no-undef': 'off',
      'no-console': 'off',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      curly: 'error',
    },
  },
];
