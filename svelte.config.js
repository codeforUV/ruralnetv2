import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";
import appengine from "svelte-adapter-appengine";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: appengine(),
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};
