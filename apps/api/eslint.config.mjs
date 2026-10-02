import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "no-unused-vars": "error",
      // typescript-eslint's no-undef is not type-aware and false-positives on
      // ambient namespaces (e.g. Express.Multer.File from @types/multer).
      // tsc already rejects genuinely undefined variables.
      "no-undef": "off",
      "prefer-const": "error",
      "no-console": "warn",
    },
  },
  {
    ignores: ["**/node_modules/", "**/dist/"],
  },
);
