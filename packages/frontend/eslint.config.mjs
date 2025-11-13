// @ts-check
import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';
import rootConfig from '../../eslint.config.mjs';

const eslintConfig = defineConfig([
  ...rootConfig,
  ...nextVitals,
  ...nextTs,
  tseslint.config({
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })[0],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/unbound-method': 'off',
    },
  },
]);

export default eslintConfig;
