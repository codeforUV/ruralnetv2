// You can load global information from the server side here, and allow it to
// be accessible to pages through the `parent` context
// See: https://github.com/sveltejs/kit/discussions/5883


import { parse, serialize } from "cookie";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request, setHeaders }) {

    const cookie = parse(request.headers.get('cookie'))

    return {
        userid: cookie.userid
      };
    
  }