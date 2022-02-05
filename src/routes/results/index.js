// import dbConnect from "$lib/db";
import { SpeedTest } from "$lib/models";

export async function get({ params }) {
  try {
    // await dbConnect();

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
