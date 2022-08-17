// Required end-point by speedtest.js
// Modeled after original php code: https://github.com/librespeed/speedtest/blob/master/backend/empty.php
export async function GET({ request }) {
  return new Response(undefined, {
    headers: {
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Encoding, Content-Type",
      Pragma: "no-cache",
      "Cache-Control":
        "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0",
    }
  });
}

export async function POST({ request }) {
  return new Response(undefined, {
    headers: {
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Encoding, Content-Type",
      Pragma: "no-cache",
      "Cache-Control":
        "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0",
    }
  });
}
