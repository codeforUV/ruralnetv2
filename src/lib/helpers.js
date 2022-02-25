/**
 * Helper functions to use throughout the project backend
 * e.g. will only work in .json.js routes, not svelte routes
 */

function getRequestIP(req) {
  console.log(req.headers);
  let requestIP =
    req.headers["x-forwarded-for"] ||
    // req.connection.remoteAddress ||
    req.headers["HTTP_CLIENT_IP"] ||
    req.headers["X-Real-IP"] ||
    req.headers["HTTP_X_FORWARDED_FOR"];
  if (requestIP.substr(0, 7) === "::ffff:") {
    requestIP = requestIP.substr(7);
  }
  console.log(requestIP);
  return requestIP;
}

function getUserCookie(req) {
  if (req.headers.cookie) {
    return req.headers.cookie.split("=")[1];
  } else {
    return null;
  }
}

export { getRequestIP, getUserCookie };
