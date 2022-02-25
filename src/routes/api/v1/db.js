import { SpeedTest } from "$lib/models.js";

/* To guard against direct database read/write/delete access using REST calls to
/api/v1/db we used a verifyAuth helper function. This function checks to see whether the
request is coming from a server-endpoint rather than directly from the client, by
checking for the field "internal" in the request header. This field is set server-side
by an end-point based on the value in the .env.local or process.env.local, thus making
it unavailable on the client. If we were to set the header from within a fetch() call in
the client then it would be publicly visible and fail to guard this endpoint.

To perform CRUD operations on the db, use makeAuthenticatedReq() from helpers.js either
within a get() or post() of an endpoint or within load() inside a <script
context="module"> in a svelte file.

Of course this is an imperfect solution since we don't actually have user accounts,
login, and true authentication. That means that any endpoints that perform db operations
*directly* should be assumed to be available from the client and can theoretically be abused, e.g. /api/v1/findUser

*/
const verifyAuth = (request) => {
  const key = request.headers.get("internal");
  const auth = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_AUTH
    : process.env.BACKEND_AUTH;
  return key === auth;
};

// get all speedtests
export async function get({ request, url, params, locals }) {
  if (verifyAuth(request)) {
    try {
      const docs = await SpeedTest.find({}).exec();
      return {
        status: 200,
        body: { docs },
      };
    } catch (err) {
      console.log(err.stack);
      return {
        status: 500,
        resp: JSON.stringify({ resp: err.stack }),
      };
    }
  } else {
    return {
      status: 403,
      body: "This is not a public API",
    };
  }
}

// delete an entry with given id
export async function del({ request, url, params, locals }) {
  if (verifyAuth(request)) {
    try {
      const { id } = request.body;
      // NOTE: Commented out by default; uncomment while testing
      // await SpeedTest.deleteOne({ _id: id });
      return {
        resp: JSON.stringify({ resp: "document sucessfully deleted" }),
      };
    } catch (err) {
      console.log(err.stack);
      return {
        status: 500,
        resp: JSON.stringify({ resp: err.stack }),
      };
    }
  } else {
    return {
      status: 403,
      body: "This is not a public API",
    };
  }
}

export async function post({ request, url, params, locals }) {
  if (verifyAuth(request)) {
    const data = request.body;
    try {
      let newTest, saved;
      // if _id is included, then this test is being updated
      if (data._id) {
        await SpeedTest.updateOne({ _id: data._id }, { $set: data }).exec();
        newTest = { _id: data._id };
        saved = newTest;
        // newTest and saved will both be undefined
        // if _id is not included, then it is a fresh new test. _id is automatically assigned by Mongo.
      } else {
        newTest = new SpeedTest(data);
        saved = await newTest.save();
      }
      if (saved === newTest) {
        return {
          body: JSON.stringify({
            resp: "Data saved successfully",
            entryId: newTest._id,
          }),
        };
      } else {
        return {
          status: 500,
          resp: JSON.stringify({
            resp: "Probelm saving data",
          }),
        };
      }
    } catch (err) {
      console.log(err.stack);
      return {
        status: 500,
        resp: JSON.stringify({ resp: err.stack }),
      };
    }
  } else {
    return {
      status: 403,
      body: "This is not a public API",
    };
  }
}
