import { defineConfig } from "eslint/config";
import css from "@eslint/css";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import react from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    {
        files: ["**/*.{js,jsx,ts,tsx}"], // Only JS/TS files
        plugins: { react },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
        },
    },
    {
        extends: compat.extends("plugin:@next/next/recommended", "prettier", "next/core-web-vitals", "eslint:recommended"),
        files: ["**/*.{js,jsx,ts,tsx}"], // Only JS/TS files
        languageOptions: {
            globals: {
                JSX: "readonly",
            },
        },
        rules: {
            "no-undef": "off",
        },
    },
    {
        files: ["**/*.css"], // Only CSS files
        language: "css/css",
        plugins: { css },
        extends: ["css/recommended"]
    },
]);