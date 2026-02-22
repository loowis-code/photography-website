import { defineConfig } from 'eslint/config'
import css from '@eslint/css'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import react from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: { react },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        extends: compat.extends('prettier', 'eslint:recommended'),
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                JSX: 'readonly',
            },
        },
        rules: {
            'no-undef': 'off',
        },
    },
    {
        files: ['**/*.css'],
        language: 'css/css',
        plugins: { css },
        extends: ['css/recommended'],
    },
])
