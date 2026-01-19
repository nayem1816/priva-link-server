import globals from "globals";
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-unused-expressions": "error",
      "no-console": "warn",
      "no-undef": "error",
      eqeqeq: "error",
    },
  },
  js.configs.recommended,
];
