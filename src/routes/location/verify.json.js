// TODO: Rewrite in sveltekit endpoint style
export async function get(req, res, next) {
  /* this route will take a location and verify that its actually a location
   * if good, returns location and lat/long
   * if bad, returns error json
   */
  const key = process.env.MAPQUEST_KEY;
  const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&maxResults=1&location=`;
  let location = req.query.location;
  let apiReq = await fetch(url + location);
  let locationinfo = await apiReq.json();
  let result = locationinfo.results[0].locations[0];
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  let formattedResult = (result.adminArea5 + "," + result.adminArea3)
    .toLowerCase()
    .replace(/\s+/g, ""); //no whitespace and all lowercase for uniformity with input
  if (
    location === result.postalCode ||
    location.toLowerCase() == formattedResult
  ) {
    // good outcome, the user query matched the search result
    res.end(
      JSON.stringify({
        verified: true,
        city: result.adminArea5 + ", " + result.adminArea3,
        latlng: result.latLng,
      })
    );
  } else {
    // bad result, user entered garbage
    res.end(
      JSON.stringify({
        verified: false,
        userInput: location,
        checkedAgainst: [result.postalCode, formattedResult],
      })
    );
  }
}
