import { SpeedTest } from "$lib/models";
import { dev } from "$app/env";



export async function get({ params }) {


  try {
    const docs = await SpeedTest.find({}).exec();

    return {
      status: 200,
      body: { docs },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: { error },
    };
  }
}
