import { getRequestIP } from "$lib/helpers.js";

// this endpoint can be called from the frontend to relay a request to ipinfo.io for the end user
export async function get(req, res, next) {
  let reqIP = getRequestIP(req);
  console.log(reqIP);
  if (process.env.DEV_IP) {
    reqIP = process.env.DEV_IP;
  }
  try {
    const ipInfoReq = await fetch(
      `https://ipinfo.io/${reqIP}?token=${process.env.IPINFO_TOKEN}`
    );
    const ipInfo = await ipInfoReq.json();
    console.log(ipInfo);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(ipInfo));
  } catch (error) {
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        ipAddress: reqIP,
        err: "Probably exceeded ipinfo.io rate limit",
      })
    );
  }
}
