import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': eslint,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            'import/no-anonymous-default-export': 'off',
        },
    },
    {
        files: ['**/*.tsx'],
        plugins: {
            react: reactPlugin,
        },
        rules: {
            'react/display-name': 'off',
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn', // instead of 'error'
        },
    }
];

export default eslintConfig;
