import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: {globals: globals.node}},
  pluginJs.configs.recommended,
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
