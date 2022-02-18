import { SpeedTest } from "$lib/models.js";
import { getRequestIP, getUserCookie } from "$lib/helpers.js";

// this route uses ip address as a key to get info from previous tests, sparing api calls
export async function get({ request }) {
  let requestIP = getRequestIP(request);
  if (process.env.DEV) {
    // requestIP = "199.21.137.7";
    requestIP = process.env.DEV_IP;
  }
  const userID = getUserCookie(req);
  console.log(`IP:USER: ${requestIP} | ${userID}`);
  const prevTest = await SpeedTest.findOne({ ipAddress: requestIP, userID });
  if (prevTest && userID) {
    return {
      status: 200,
      body: JSON.stringify({
        ipAddress: requestIP,
        internetProvider: prevTest.internetProvider,
        city: prevTest.city,
        latitude: prevTest.latitude,
        longitude: prevTest.longitude,
        cookie: prevTest.userID,
        err: null,
      }),
    };
  } else {
    return {
      status: 404,
      body: JSON.stringify({
        ipAddress: requestIP,
        uniqueID: userID,
        err: "no tests from this IP address + user are stored in the database",
      }),
    };
  }
}
