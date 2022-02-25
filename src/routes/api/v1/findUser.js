// This route handles a POST request where it's passed a object containing the output of
// a call to the Abstract API to get a user's ip address and approximate location
// We only use their ip address in this end-point along with their user id to see if we
// have a test for them in the database
import { SpeedTest } from "$lib/models.js";
import { parse } from "cookie";

export async function get({ request, url }) {
  const { userid } = parse(request.headers.get("cookie"));
  const ip_address = url.searchParams.get("ip") || "";
  const prevTest = await SpeedTest.findOne({
    ipAddress: ip_address,
    userID: userid,
  });
  if (prevTest && userid) {
    return {
      status: 200,
      body: JSON.stringify({
        ipAddress: ip_address,
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
      status: 200,
      body: JSON.stringify({
        ipAddress: ip_address,
        uniqueID: userid,
        err: "no tests from this IP address + user are stored in the database",
      }),
    };
  }
}
