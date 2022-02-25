export async function get({ url }) {
  // This route takes a coordinate pair and will return the name of the town + state
  // that the coordinate is (probably) in by doing a radius search using the Mapquest
  // API
  const latlng = url.searchParams.get("latlng");
  const numResults = url.searchParams.get("matches") || 3;
  if (latlng) {
    const key = import.meta.env.VITE_MAPQUEST_KEY;
    let url = `https://www.mapquestapi.com/search/v2/radius?key=${key}&origin=${latlng}&maxMatches=${numResults}`;
    let apiReq = await fetch(url);
    let searchResults = await apiReq.json();
    let cityCounts = {};
    // get the city, state and zip code of each result and count them
    searchResults.searchResults.forEach((result) => {
      let city = `${result.fields.city}, ${result.fields.state}, ${result.fields.postal_code}`;
      if (cityCounts[city]) {
        cityCounts[city] += 1;
      } else {
        cityCounts[city] = 1;
      }
    });
    // unpack the info into seprate keys and determine confidence in each result
    // confidence could also be determined via weighted means by giving smaller distances from the origin greater weights - result.distance in above forEach
    let output = {};
    let conf = 0;
    Object.keys(cityCounts).forEach((key) => {
      let chunkedAddress = key.split(", ");
      let confidence = cityCounts[key] / numResults; // just a percentage of the search results that came up in that city - high result the better right?
      if (confidence > conf) {
        conf = confidence;
        output = {
          city: chunkedAddress[0],
          state: chunkedAddress[1],
          zip: chunkedAddress[2],
        };
      }
    });
    return {
      status: 200,
      body: JSON.stringify(output),
    };
  } else {
    return {
      status: 400,
      body: JSON.stringify({
        reason: "please provide lat long coordinates as a URL query param",
      }),
    };
  }
}
