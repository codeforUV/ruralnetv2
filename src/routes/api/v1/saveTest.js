// Public API that saves a test result

export async function get({ request }) {
  return {
    status: 200,
    body: "This route is used for saving test data",
  };
}

export async function post(request) {
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
