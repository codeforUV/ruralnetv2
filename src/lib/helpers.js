/**
 * Helper functions to use throughout the project backend
 * e.g. will only work in .json.js routes, not svelte routes
 */

 import { parse, serialize } from "cookie";
 import { cookies } from "$lib/stores";


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

const useCookiesFunctions = () => {

  /**
   * 
   * @param {Boolean} status Accepts Boolean values for if Cookies have been accepted. 'true' mean Cookies have been accepted. 'false' means Cookies have been declined.
   */
  const setCookieStatus = (status) => {

    if (status === true || status === false) {
      document.cookie = `_rn_cookie_status=${status}`
      cookies.accepted = status
    } else {
      console.error("Invalid value for cookie status. Must be 'true' or 'false'.")
    }

  }
  /**
   * 
   * @returns {Boolean} Returns 'true' or 'false' in relation to Cookies being accepted. 'true' mean Cookies have been accepted. 'false' means Cookies have been declined.
   */
  const getCookieStatus = () => {
    let cookiesObj
    try {
        cookiesObj = parse(document.cookie)
      
      
      if (cookiesObj._rn_cookie_status === 'true') {
        return true
      } else if (cookiesObj._rn_cookie_status === 'false') {
        return false
      } else {
        return true
      }

    } catch (error) { //Catch in case 'document' is not accessible, then default to store
      
      if (cookies.accepted === true) {
        return true
      } else if (cookies.accepted === false) {
        return false
      } else {
        return false
      }
    }
  }

  return {
    setCookieStatus: setCookieStatus,
    getCookieStatus: getCookieStatus,
  }
}

export const useCookies = useCookiesFunctions()