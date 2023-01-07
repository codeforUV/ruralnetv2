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

/** @type {import('@sveltejs/kit').Config} */
// const config = {
//   kit: {
//     adapter: adapter({
//       envPrefix: '',

//     }),
//     // vite: {
//     //   define: {
//     //     "process.env": process.env,
//     //   },
//     // },
//   },

//   preprocess: [
//     preprocess({
//       postcss: true,
//     }),
//   ],
// };

//export default config;
