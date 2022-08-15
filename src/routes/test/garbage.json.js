// Required end-point by speedtest.js
// Modeled after original php code:
// https://github.com/librespeed/speedtest/blob/master/backend/garbage.php
// Since sveltekit doesn't suppport sending data streeams or multipler successive
// responses from the same end-point (e.g. res.write() in express) instead just follow
// the directions for librespeedtest and return a single 100mb file as suggested here:
// https://github.com/librespeed/speedtest/wiki/Alternative-backends
// If we decide we need a custom-backed specifically for all the routes in test/ see the
// guidelines in the sveltekit node-apapter docs: https://github.com/sveltejs/kit/tree/master/packages/adapter-node
import randomBytes from "random-bytes";

export async function GET({ request }) {
  const requestedSize = 100;
  let b;
  let cache = null;

  // NOTE: leaving this here as a way to try sending an async generator as a response as
  // suggested in this sveltekit issue: https://github.com/sveltejs/kit/issues/1563
  // In theory we could just do body: await sendBytes(), however this doesn't yet work
  // and will produce a server error
  // async function* sendBytes() {
  //   if (!cache) {
  //     b = await randomBytes(1048576);
  //     cache = b;
  //   } else {
  //     b = cache;
  //   }
  //   for (let i = 0; i < requestedSize; i++) {
  //     yield b;
  //   }
  // }

  return {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Description": "File Transfer",
      "Content-Disposition": "attachment; filename=random.dat",
      "Content-Transfer-Encoding": "binary",
      Pragma: "no-cache",
      "Cache-Control":
        "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0",
    },
    body: await randomBytes(1048576),
  };
}

export async function POST({ request }) {
  // do nothing
  return {
    status: 200,
    body: {},
  };
}
