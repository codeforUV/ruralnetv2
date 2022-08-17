// Public API that saves a test result

export async function GET({ request }) {
  return new Response("This route is used for saving test data");
}

export async function POST(request) {
  if (resp.ok) {
    return new Response(await resp.json(), { status: resp.status });
  } else {
    return new Response(undefined, { status: resp.status });
  }
}
