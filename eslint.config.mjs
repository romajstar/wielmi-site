import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: path.dirname(require.resolve("eslint-config-next/package.json")),
});

const config = [
  {
    ignores: ["**/.next/**", "**/out/**", "**/node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default config;
