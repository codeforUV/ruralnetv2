// Public API that saves a test result
import { makeAuthenticatedReq } from "$lib/helpers";

export async function get({ request }) {
  return {
    status: 200,
    body: "This route is used for saving test data",
  };
}

export async function post(request) {
  const resp = await makeAuthenticatedReq(request, "POST");
  if (resp.ok) {
    return {
      status: resp.status,
      body: await resp.json(),
    };
  } else {
    return {
      status: resp.status,
      resp: resp.resp,
    };
  }
}
