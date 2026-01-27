import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for server-side (Node.js) packages.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/__tests__/**/*"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
