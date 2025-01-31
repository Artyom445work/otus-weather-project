// @ts-check
import globals from "globals";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.jest, ...globals.node },
      },
      // languageOptions: { globals: globals.jest  },
      rules: {
          // "no-unused-vars": "error",
          "@typescript-eslint/no-unused-vars": "error",
          "@typescript-eslint/no-explicit-any": "off",
          "no-undef": "error",
          "no-useless-escape": "off"
      },
        ignores: ['./webpack.config.js']
    },
    {
        files: ["webpack.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        },
    },
);