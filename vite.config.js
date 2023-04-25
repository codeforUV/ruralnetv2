import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    hmr: {
      overlay: false,
    },
  },
};

export default config;
