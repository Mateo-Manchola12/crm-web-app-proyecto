import { defineConfig } from "eslint/config";
import clientConfig from "./client/eslint.config.js";
import serverConfig from "./server/eslint.config.mjs";
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
    {
        rules: {
            "comma-dangle": ["error", "always-multiline"],
        },
    },
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
        files: ["./client/**/*.{astro}"],
        extends: [clientConfig],
    },
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.astro/**"],
        files: ["**/*.{js,ts,jsx,tsx}"],
        extends: [serverConfig],
    },
    eslintConfigPrettier,

]);
