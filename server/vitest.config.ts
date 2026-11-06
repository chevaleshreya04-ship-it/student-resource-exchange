import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: "./tests/setup.ts",
    coverage: {
      include: ["**/*.ts"],
      exclude: [
        "tests/**",
        "vitest.config.ts",
        "seed.ts",
        "server.ts",
        "dummyResources.ts",
        "types/**",
        "dist/**",
      ],
    },
  },
});
