import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {ignores: ['dist/**']},
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    rules: {
      'array-bracket-spacing': 'warn',
      'comma-spacing': 'warn',
      eqeqeq: 'warn',
      'func-call-spacing': 'warn',
      'key-spacing': 'warn',
      'object-curly-spacing': 'warn',
      semi: 'warn',
    },
  },
];
