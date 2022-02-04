import mongoose from "mongoose";

// Data Models
const { Schema } = mongoose;
// Import these in any other svelte or js file to read/write to the db, e.g.
// import { SpeeedTest } from '$lib/models'
// const data = await SpeedTest.find({}).exec();

const DummySchema = new Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const SpeedTestSchema = new Schema({
  // these keys match the keys of finalDataJson in speed.svelte - hopefully that makes adding data super easy as demoed in database.json.js
  userID: String,
  ipAddress: String,
  internetProvider: String,
  downloadSpeed: Number,
  uploadSpeed: Number,
  date: {
    type: String,
    default: Date.now(),
  },
  time: String,
  city: String,
  ping: Number,
  latitude: Number,
  longitude: Number,
});

const SurveySubmissionsSchema = new Schema({
  date: {
    type: String,
    default: Date.now(),
  },
  address: String,
  city: String,
  state: String,
  answers: [
    {
      questionId: String,
      answer: String,
    },
  ],
});

const Dummy = mongoose.model("Dummy", DummySchema);
const SpeedTest = mongoose.model("SpeedTest", SpeedTestSchema);
const SurveySubmissions = mongoose.model(
  "SurveySubmissions",
  SurveySubmissionsSchema
);
export { Dummy, SpeedTest, SurveySubmissions };
