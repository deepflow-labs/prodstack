import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async config =>
    mergeConfig(config, {
      plugins: [tsconfigPaths()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../"),
        },
      },
      esbuild: {
        jsx: "automatic",
      },
    }),
};

export default config;
