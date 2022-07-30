// Public API that saves a test result

export async function GET({ request }) {
  return {
    status: 200,
    body: "This route is used for saving test data",
  };
}

export async function POST(request) {
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
