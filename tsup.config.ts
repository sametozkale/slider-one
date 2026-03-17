import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "tsconfig.build.json",
  entry: { index: "src/index.ts" },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "framer-motion",
  ],
  banner: { js: '"use client";' },
});
