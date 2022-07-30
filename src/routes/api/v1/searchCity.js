// PUBLIC API that takes a coordinate pair and will return the name of the town + state
// that the coordinate is (probably) in by doing a radius search using the Mapquest
export async function GET({ request, url }) {
  const latlng = url.searchParams.get("latlng");
  const numResults = url.searchParams.get("matches") || 3;

  let apiReq, searchResults;
  let cityCounts = {};
  if (latlng) {
    const key = import.meta.env.DEV
      ? import.meta.env.VITE_MAPQUEST_KEY
      : process.env.MAPQUEST_KEY;
    let url = `https://www.mapquestapi.com/search/v2/radius?key=${key}&origin=${latlng}&maxMatches=${numResults}`;
    try {
      apiReq = await fetch(url);
      searchResults = await apiReq.json();
      searchResults.searchResults.forEach((result) => {
        let city = `${result.fields.city}, ${result.fields.state}, ${result.fields.postal_code}`;
        if (cityCounts[city]) {
          cityCounts[city] += 1;
        } else {
          cityCounts[city] = 1;
        }
      });
      // get the city, state and zip code of each result and count them
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
            error: null,
          };
        }
      });
      return {
        status: 200,
        body: JSON.stringify(output),
      };
    } catch (error) {
      return {
        status: 500,
        body: JSON.stringify({ error }),
      };
    }
  } else {
    return {
      status: 404,
      body: "latlng query param missing",
    };
  }
}
