import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Agere DS 7.0 is vendored as-is (src/components/README.md); it is linted and tested upstream.
  globalIgnores([
    "src/components/ui/**",
    "src/brand/**",
    "src/tokens/**",
    "src/lib/{dev,utils}.ts",
    "tailwind.preset.ts",
  ]),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**", "server.js", "server.cjs"]),
]);
