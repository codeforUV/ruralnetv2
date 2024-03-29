// Public API to search for a user in the db given ip address as a query param and a
// cookie with their userid
import { SpeedTest } from "$lib/models.js";
import { parse } from "cookie";

export async function GET({ request, url }) {
  const { userid } = parse(request.headers.get("cookie"));
  const ip_address = url.searchParams.get("ip") || "";
  if (userid && ip_address) {
    const prevTest = await SpeedTest.findOne({
      ipAddress: ip_address,
      userID: userid,
    });
    if (prevTest && userid) {
      return new Response(JSON.stringify({
  ipAddress: ip_address,
  internetProvider: prevTest.internetProvider,
  city: prevTest.city,
  latitude: prevTest.latitude,
  longitude: prevTest.longitude,
  cookie: prevTest.userID,
  err: null,
}));
    } else {
      return new Response(JSON.stringify({
  ipAddress: ip_address,
  uniqueID: userid,
  err: "no tests from this IP address + user are stored in the database",
}));
    }
  } else {
    return new Response("ip_address query param and cookie missing", { status: 404 });
  }
}
