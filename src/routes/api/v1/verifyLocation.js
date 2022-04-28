/* PUBLIC API that will take a location and verify that its actually a location
 * if good, returns location and lat/long
 * if bad, returns error json
 */
export async function get({ request, url, params, locals }) {
  const key = import.meta.env.DEV
    ? import.meta.env.VITE_MAPQUEST_KEY
    : process.env.MAPQUEST_KEY;
  let location = url.searchParams.get("location");
  if (location) {
    const mapquest = `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&maxResults=1&location=${location}`;
    let apiReq = await fetch(mapquest);
    let locationinfo = await apiReq.json();
    let result = locationinfo.results[0].locations[0];
    let formattedResult = (result.adminArea5 + "," + result.adminArea3)
      .toLowerCase()
      .replace(/\s+/g, ""); //no whitespace and all lowercase for uniformity with input
    let verified, userInput, city, latlng, checkedAgainst;
    if (
      location === result.postalCode ||
      location.toLowerCase() == formattedResult
    ) {
      // good outcome, the user query matched the search result
      verified = true;
      city = result.adminArea5 + ", " + result.adminArea3;
      latlng = result.latLng;
    } else {
      // bad result, user entered garbage
      verified = false;
      userInput = location;
      checkedAgainst = [result.postalCode, formattedResult];
    }
    return {
      body: JSON.stringify({
        verified,
        userInput,
        city,
        latlng,
        checkedAgainst,
      }),
    };
  } else {
    return {
      status: 404,
      body: "location query param missing",
    };
  }
}
