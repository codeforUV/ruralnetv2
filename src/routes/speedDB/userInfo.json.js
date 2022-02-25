import { SpeedTest } from "$lib/models.js";
import { getRequestIP, getUserCookie } from "$lib/helpers.js";
import { parse } from "cookie";

export async function post({ request }) {
  const data = await request.json();
  const { userid } = parse(request.headers.get("cookie"));
  const { ip_address } = data;
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
      status: 404,
      body: JSON.stringify({
        ipAddress: ip_address,
        uniqueID: userid,
        err: "no tests from this IP address + user are stored in the database",
      }),
    };
  }
}
