
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
    const { userid } = await parent();
    // ...
  }