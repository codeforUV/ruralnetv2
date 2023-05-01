// Make an authenticated request to the /api/db route and just send the sanitized data
// back the client, rather than giving the client direct read access to the entire db
export async function load({ fetch }) {
  const resp = await fetch("/api/v1/db");
  const { docs } = await resp.json();
  // Only send the info we need to generate the map to the client rather than
  // ip_address and potentially other identifiable info
  const data = [];
  docs.forEach(
    ({ latitude, longitude, downloadSpeed, uploadSpeed, ping, city }) => {
      data.push({
        latitude,
        longitude,
        downloadSpeed,
        uploadSpeed,
        ping,
        city,
      });
    }
  );

  return { data };
}
