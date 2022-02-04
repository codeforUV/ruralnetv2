import cookie from "cookie";
import { v4 as uuid } from "@lukeed/uuid";
import { dev } from "$app/env";
import mongoose from "mongoose";

// First try reading the mongodb URI from the currently running node process
// This will have the correct value when running on heroku as the connection string was set in the admin panel
let { MONGODB_URI } = process.env;
// Replace the value of MONGODB_URI with the value in the .env.local if we're running the app locally
MONGODB_URI = dev ? import.meta.env.VITE_MONGODB_URI : MONGODB_URI;

export const handle = async ({ event, resolve }) => {
  // Establish database connection if we don't have one
  if (mongoose.connection.readyState !== 1) {
    console.log("Setting up new database connection for this session");

    // Establish connection to db
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
  }

  const cookies = cookie.parse(event.request.headers.get("cookie") || "");
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
