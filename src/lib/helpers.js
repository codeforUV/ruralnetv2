/**
 * Helper functions to use throughout the project backend
 * e.g. will only work in .json.js routes, not svelte routes
 */

// Make an authenticated request against the /api/db endpoint by setting the value of
// the request header based on the BACKEND_AUTH key known only to the server
export const makeAuthenticatedReq = async (req, method) => {
  const endpoint = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : process.env.BACKEND_URL;

  const auth = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_AUTH
    : process.env.BACKEND_AUTH;

  const url = encodeURI(`${endpoint}/api/v1/db`);
  const options = {
    headers: {
      internal: auth,
      credentials: "same-origin",
    },
  };
  if (method === "POST") {
    options["method"] = method;
    options["body"] = await req.request.json();
    options.body = JSON.stringify(options.body);
  }
  return fetch(url, options);
};
