import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "build", "node_modules", ".react-router", "public"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      react,
    },
 rules: {
  ...reactHooks.configs.recommended.rules,
  ...react.configs.recommended.rules,
  "react/react-in-jsx-scope": "off",
  "no-console": ["error", { allow: ["warn", "error"] }],

  // Disable strict TS rules
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "@typescript-eslint/no-explicit-any": "off",
},


    settings: {
      react: {
        version: "detect",
      },
    },
  },
);
