export async function get(req, res, next) {
  // This route takes a coordinate pair and will return the name of the town + state that the coordinate is (probably) in
  // by doing a radius search
  const latlng = req.query.latlng;
  if (latlng) {
    const key = process.env.MAPQUEST_KEY;
    let url = `https://www.mapquestapi.com/search/v2/radius?key=${key}&origin=${latlng}&maxMatches=${
      req.query.matches || 3
    }`;
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
      let confidence = cityCounts[key] / (req.query.matches || 3); // just a percentage of the search results that came up in that city - high result the better right?
      if (confidence > conf) {
        conf = confidence;
        output = {
          city: chunkedAddress[0],
          state: chunkedAddress[1],
          zip: chunkedAddress[2],
        };
      }
    });
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(output));
  } else {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ reason: "please provide coordinates" }));
  }
}

async function post(req, res, next) {}
