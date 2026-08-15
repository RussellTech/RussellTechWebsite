import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,mjs}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["functions/**/*.ts", "src/data/services.ts"],
      exclude: ["**/*.d.ts"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 85,
        lines: 80,
      },
    },
  },
});
