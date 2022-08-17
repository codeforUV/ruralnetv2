/* PUBLIC API that will take a location and verify that its actually a location
 * if good, returns location and lat/long
 * if bad, returns error json
 */
export async function GET({ request, url, params, locals }) {
  const key = import.meta.env.DEV
    ? import.meta.env.VITE_MAPQUEST_KEY
    : process.env.MAPQUEST_KEY;
  let location = url.searchParams.get("location");
  if (location) {
    const mapquest = `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&maxResults=1&location=${location}`;
    let apiReq = await fetch(mapquest);
    let locationinfo = await apiReq.json();
    // Split user input to city, state to compare to resp
    const userInputCity = location.split(",")[0].trim().toLowerCase();
    const userInputState = location.split(",")[1].trim().toLowerCase();

    // Parse mapquest response
    let result = locationinfo.results[0].locations[0];
    const userResultCity = result.adminArea5.trim().toLowerCase();
    const userResultState = result.adminArea3.trim().toLowerCase();
    let verified, userInput, city, latlng, checkedAgainst;
    if (
      userResultCity === userInputCity &&
      userResultState === userInputState
    ) {
      // good outcome, the user query matched the search result
      verified = true;
      city = result.adminArea5 + ", " + result.adminArea3;
      latlng = result.latLng;
    } else {
      // bad result, user entered garbage
      verified = false;
      userInput = location;
      checkedAgainst = `${userResultCity},${userResultState}`;
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
