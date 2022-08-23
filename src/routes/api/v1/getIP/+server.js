export async function GET(event) {
  return new Response(JSON.stringify(event.clientAddress));
}
