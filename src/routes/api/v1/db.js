// NOTE: We shouldn't leave this route unsecured, especially not for delete requests!
import { SpeedTest } from "$lib/models.js";

// get all speedtests
export async function get({ request, url, params, locals }) {
  try {
    const docs = await SpeedTest.find({}).exec();
    return {
      body: JSON.stringify({ docs }),
    };
  } catch (err) {
    console.log(err.stack);
    return {
      status: 500,
      body: JSON.stringify({ resp: err.stack }),
    };
  }
}

// delete an entry with given id
export async function del({ request, url, params, locals }) {
  try {
    const { id } = request.body;
    // NOTE: Commented out by default; uncomment while testing
    // await SpeedTest.deleteOne({ _id: id });
    return {
      body: JSON.stringify({ resp: "document sucessfully deleted" }),
    };
  } catch (err) {
    console.log(err.stack);
    return {
      status: 500,
      body: JSON.stringify({ resp: err.stack }),
    };
  }
}

export async function post({ request, url, params, locals }) {
  const data = request.body;
  try {
    let newTest, saved;
    // if _id is included, then this test is being updated
    if (data._id) {
      await SpeedTest.updateOne({ _id: data._id }, { $set: data }).exec();
      newTest = { _id: data._id };
      saved = newTest;
      // newTest and saved will both be undefined
      // if _id is not included, then it is a fresh new test. _id is automatically assigned by Mongo.
    } else {
      newTest = new SpeedTest(data);
      saved = await newTest.save();
    }
    if (saved === newTest) {
      return {
        body: JSON.stringify({
          resp: "Data saved successfully",
          entryId: newTest._id,
        }),
      };
    } else {
      return {
        status: 500,
        body: JSON.stringify({
          resp: "Probelm saving data",
        }),
      };
    }
  } catch (err) {
    console.log(err.stack);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ resp: err.stack }));
  }
}
