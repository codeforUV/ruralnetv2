import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      env: {
        origin: "ORIGIN",
        headers: {
          protocol: "PROTOCOL_HEADER",
          host: "HOST_HEADER",
        },
      },
    }),
    vite: {
      define: {
        "process.env": process.env,
      },
    },
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

export default config;
