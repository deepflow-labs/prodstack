import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "convex",
          include: ["convex/__tests__/**/*.test.ts"],
          // NOTE: reverted to "node" — "edge-runtime" requires @edge-runtime/vm which is not installed.
          // convex-test works fine with "node"; "edge-runtime" is optional for closer Convex fidelity.
          environment: "node",
          globals: true,
          setupFiles: ["./test-setup.ts"],
          fileParallelism: false,
          env: {
            OPENAI_API_KEY: "",
          },
        },
      },
      {
        extends: true,
        test: {
          name: "frontend",
          include: ["app/**/__tests__/**/*.test.tsx", "components/__tests__/**/*.test.tsx"],
          environment: "happy-dom",
          globals: true,
          setupFiles: ["./test-utils/setup.ts"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
