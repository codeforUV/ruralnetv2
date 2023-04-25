import mongoose from "mongoose";

// Data Models
const { Schema } = mongoose;
// Import these in any other svelte or js file to read/write to the db, e.g.
// import { SpeeedTest } from '$lib/models'
// const data = await SpeedTest.find({}).exec();

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
  userID: String,
  speedTestID: String,
  date: {
    type: String,
    default: Date.now(),
  },
  city: String,
  state: String,
  answers: [
    {
      questionId: String,
      answer: String,
    },
  ],
});

const SpeedTest =
  mongoose.models.SpeedTest || mongoose.model("SpeedTest", SpeedTestSchema);
const SurveySubmissions =
  mongoose.models.SurveySubmissions ||
  mongoose.model("SurveySubmissions", SurveySubmissionsSchema);
export { SpeedTest, SurveySubmissions };
