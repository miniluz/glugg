// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import rootConfig from '../../eslint.config.mjs';

export default tseslint.config(
  ...rootConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
