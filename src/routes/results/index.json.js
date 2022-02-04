import { SpeedTest } from "$lib/models";
export async function get({ params }) {
  const docs = await SpeedTest.find({}).exec();
  if (docs) {
    return {
      body: { docs },
    };
  }
  return {
    status: 404,
  };
}
