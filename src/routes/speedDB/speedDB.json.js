import { SpeedTest } from "$lib/models.js";

// get all speedtests
export async function get(req, res, next) {
  try {
    const data = await SpeedTest.find({}).exec();
    res.writeHead(200).end(JSON.stringify({ docs: data }));
  } catch (err) {
    console.log(SpeedTest);
    console.log(err.stack);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ resp: err.stack }));
  }
}

// delete an entry with given id
export async function del(req, res, next) {
  try {
    const { id } = req.body;
    await SpeedTest.deleteOne({ _id: id });
    res
      .writeHead(200)
      .end(JSON.stringify({ resp: "document deleted succesfully" }));
  } catch (err) {
    console.log(err.stack);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ resp: err.stack }));
  }
}

export async function post(req, res, next) {
  const data = req.body;
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
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          resp: "Data saved successfully",
          entryId: newTest._id,
        })
      ); // possibly not smart but stick with me or rembember this spot
    } else {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ resp: "Problem saving data" }));
    }
    if (saved === newTest) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({ msg: "Data saved successfully", entryId: newTest._id })
      ); // possibly not smart but stick with me or rembember this spot
    } else {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ resp: "Problem saving data" }));
    }
  } catch (err) {
    console.log(err.stack);
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ resp: err.stack }));
  }
}
