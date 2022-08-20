// You can load global information from the server side here, and allow it to
// be accessible to pages through the `parent` context
// See: https://github.com/sveltejs/kit/discussions/5883


import { parse, serialize } from "cookie";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request, setHeaders }) {
    const cookieString = request.headers.get('cookie')

    const cookie = cookieString ? parse(cookieString.toString()) : null
    let _userid = ''
    if (cookie) {
        _userid = cookie.userid
    }

    return {
        userid: _userid
      };
    
  }