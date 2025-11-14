import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,             // describe, it, expect disponibles sin import
    environment: "jsdom",      // simula navegador para React
    setupFiles: "./vitest.setup.ts", // setup global de jest-dom
    include: ["**/*.test.{ts,tsx}"], // pattern para los tests
  },
});
