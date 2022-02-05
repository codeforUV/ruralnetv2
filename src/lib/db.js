// This uses the global db connection caching trick as demonstrated in the Vercel
// Next.js examples: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
import mongoose from "mongoose";
import { dev } from "$app/env";

// First try reading the mongodb URI from the currently running node process
// This will have the correct value when running on heroku as the connection string was set in the admin panel
let { MONGODB_URI } = process.env;
// Replace the value of MONGODB_URI with the value in the .env.local if we're running the app locally
MONGODB_URI = dev ? import.meta.env.VITE_MONGODB_URI : MONGODB_URI;
console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Reusing cached db connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Setting up db connection");
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
