import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "@": decodeURIComponent(new URL("../src", import.meta.url).pathname),
      },
    }
    viteConfig.plugins ??= []
    viteConfig.plugins.push(tailwindcss())
    viteConfig.css = {
      ...viteConfig.css,
      postcss: {
        plugins: [],
      },
    }
    return viteConfig
  },
}

export default config
