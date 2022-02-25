import { parse } from "cookie";
import { v4 as uuid } from "@lukeed/uuid";
import { dev } from "$app/env";
import mongoose from "mongoose";

// First try reading the mongodb URI from the currently running node process
// This will have the correct value when running on heroku as the connection string was set in the admin panel
let { MONGODB_URI } = process.env;
// Replace the value of MONGODB_URI with the value in the .env.local if we're running the app locally
MONGODB_URI = dev ? import.meta.env.VITE_MONGODB_URI : MONGODB_URI;

// This function runs *every time* a request is made to the server. This allows us to
// see if we have a database connection and if not establish one. We also use this
// function to set or read a cookie for the user.
export const handle = async ({ event, resolve }) => {
  // Establish database connection if we don't have one
  if (mongoose.connection.readyState !== 1) {
    console.log("Setting up new database connection for this session");

    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
  }

  // This cookie checking and setting functionality came with the sveltekit template.
  // Leaving it here so we can adjust how we were doing cookies before to make them work
  // with sveltekit. See:
  // https://blog.logrocket.com/authentication-sveltekit-using-cookies/ for an example
  const cookies = parse(event.request.headers.get("cookie") || "");
  event.locals.userid = cookies.userid || uuid();

  const response = await resolve(event);

  if (!cookies.userid) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    response.headers.set(
      "set-cookie",
      cookie.serialize("userid", event.locals.userid, {
        path: "/",
        httpOnly: true,
      })
    );
  }

  return response;
};
