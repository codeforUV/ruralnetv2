import Speedtest from "./speedtest.js";
import { currentTest } from "$lib/stores";

/**
 * RuralTest is a custom wrapper class for LibreSpeed SpeedTest class
 */
export class RuralTest {
  static testStates = [
    "not started",
    "started",
    "download",
    "ping and jitter",
    "upload",
    "finished",
    "aborted",
  ];

  // See more options and explanations here: https://github.com/librespeed/speedtest/wiki/Making-a-custom-front-end
  static SPEEDTEST_SERVERS = [
    {
      name: "RuralNet Server",
      server: "/test/", // our backend route to run the test
      dlURL: "garbage.json", // generates 100mb of garbage data for testing
      ulURL: "empty.json", // sends an empty response with specific headers
      pingURL: "empty.json",
      getIpURL: "getIP.json", // unused so doesn't exist
    },
  ];

  static emptyTestJson = {
    date: null,
    time: null,
    localDateTimeString: null,
    userID: null,
    ipAddress: null,
    internetProvider: null,
    uploadSpeed: null,
    downloadSpeed: null,
    ping: null,
    city: null,
    latitude: null,
    longitude: null,
  };

  constructor(logging = true, upload = true, userid) {
    this.speedTest = new Speedtest();
    this.today = new Date();
    this.prepared = false;
    this.inProgress = false;
    this.finished = false;
    this._state = 0;
    this.chunkSize = 100;
    this.testOrder = "PDU"; // order in which tests will be performed as a string. D=Download, U=Upload, P=Ping+Jitter, I=IP, _=1 second delay. Skip IP since we do it using the abstract API
    this.testData = RuralTest.emptyTestJson;
    this.logging = logging;
    this.upload = upload;
    this.userID = userid;
    // Hard-coding the abstract API key in the front-end...not great but also not a huge
    // security issue for now because we don't have any billing associated with it or
    // other account info. Worse case we run out of free monthly quota
    // Replace this when we get easily get client request IP in sveltekit. See:
    // https://github.com/sveltejs/kit/pull/3993
    this.ABSTRACT_API = "de24077830ea4d369cb85de93599c45c";
  }

  addLogMsg(msg) {
    if (this.logging) {
      console.log(msg);
    }
  }

  checkLocalForPrevTest() {
    let prevResults = new RuralTestResult({}, true);
    if (prevResults._content) {
      this.addLogMsg("Loading previous local test result");
      prevResults._content["isPrevTest"] = true;
      this.testData = prevResults._content;
      currentTest.set(prevResults._content);
    } else {
      this.addLogMsg("No local test results found");
    }
  }

  async getIPAndApproxLocation() {
    // NOTE: We actually have access to the request headers when the app is deployed
    // live using the node-adapter on Heroku. It's available in
    // request.headers['x-forwarded-for']. However, during the local dev server doesn't
    // return this info in the response header, so this is a workaround to hit the
    // abstract API which also gives us some approximate location info
    this.addLogMsg(
      "Getting user IP and approximate location from Abstract API"
    );
    try {
      const resp = await fetch(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${this.ABSTRACT_API}`
      );
      this.geolocationData = await resp.json();
      return true;
    } catch (error) {
      this.testData.errorText = `Failed to get IP and approximate location from abstract API: ${error}`;
      return false;
    }
  }

  async checkDBForPrevTest() {
    this.addLogMsg("Checking db for existing test for this IP + userid");
    try {
      const previousTestReq = await fetch(
        `/api/v1/findUser?ip=${this.geolocationData.ip_address}`
      );
      let prevTestMeta = await previousTestReq.json();
      if (!prevTestMeta.err) {
        this.addLogMsg(
          "Found existing document...copying metadata from last test"
        );
        this.testData.ipAddress = prevTestMeta.ipAddress;
        this.testData.internetProvider = prevTestMeta.internetProvider;
        this.testData.city = prevTestMeta.city;
        this.testData.latitude = prevTestMeta.latitude;
        this.testData.longitude = prevTestMeta.longitude;
      } else {
        this.addLogMsg("No document found...setting up first time test");
        this.testData.ipAddress = this.geolocationData.ip_address;
        this.testData.internetProvider =
          this.geolocationData.connection.isp_name;
        this.testData.latitude = parseFloat(this.geolocationData.latitude);
        this.testData.longitude = parseFloat(this.geolocationData.longitude);
        this.testData.city = `${this.geolocationData.city}, ${this.geolocationData.region_iso_code}`;
      }
      return true;
    } catch (error) {
      this.testData.errorText = `Failed to look up existing test in db; ${error}`;
      return false;
    }
  }

  async getPreciseLocation() {
    // User Browser location API + Mapquest to try to get more reliable location
    let browserCoords;
    let cityreq, cityInfo;
    try {
      this.addLogMsg(
        "Trying browser location API to get more precise location"
      );
      browserCoords = await LocationUtility.browserLocation();
      if (browserCoords !== "geolocationFailed") {
        this.addLogMsg(
          "Got browser lat long...looking up city, state in Mapquest"
        );
        this.testData.latitude = browserCoords.latitude;
        this.testData.longitude = browserCoords.longitude;
        cityreq = await fetch(
          `/api/v1/searchCity?latlng=${this.testData.latitude},${this.testData.longitude}`
        );
        cityInfo = await cityreq.json();
        if (cityInfo.error) {
          console.error(cityInfo.error);
        }
        if (JSON.stringify(cityInfo) !== "{}") {
          this.addLogMsg("Found city...saving");
          this.testData.city = `${cityInfo.city}, ${cityInfo.state}`;
          this.testData.locationPrecision = "precise";
        } else {
          this.addLogMsg("Could not find city, state in Mapquest");
          this.testData.locationPrecision = "error";
        }
      }
    } catch (error) {
      if (error != "geolocationFailed") {
        console.error(error);
      }
      this.testData.locationPrecision = "approximate";
    }
  }

  async prepare() {
    this.addLogMsg("START");
    this.addLogMsg("BEGIN Speedtest preparation");
    this.testData.date = this.today.toISOString().split("T")[0];
    this.testData.time = this.today.toISOString().split("T")[1].slice(0, -1);
    this.testData.localDateTimeString = this.today.toString();
    this.testData.userID = this.userID;
    let success = await this.getIPAndApproxLocation();
    if (success) {
      success = await this.checkDBForPrevTest();
    }
    if (success) {
      await this.getPreciseLocation();
      // CONFIG SPEED TEST
      this.speedTest.setParameter("garbagePhp_chunkSize", this.chunkSize);
      this.speedTest.setParameter("test_order", this.testOrder);
      this.speedTest.setParameter("getIp_ispInfo", false);
      this.speedTest.setParameter("getIp_ispInfo_distance", false);
      this.speedTest.setSelectedServer(RuralTest.SPEEDTEST_SERVERS[0]);
      // Each time we get new data from a running speed test, update the svelte store
      // And the class attributes
      this.speedTest.onupdate = (data) => {
        this.testData["downloadSpeed"] = Math.round(data.dlStatus * 10) / 10;
        this.testData["uploadSpeed"] = Math.round(data.ulStatus * 10) / 10;
        this.testData["ping"] = Math.round(data.pingStatus * 10) / 10;
        this.testData["state"] = RuralTest.testStates[data.testState + 1];
        this.testData["isPrevTest"] = false;

        currentTest.set(this.testData);
      };
      // When the speedtest ends call our own onEnd() method
      this.speedTest.onend = async (data) => {
        await this.onEnd(data);
      };
      this.prepared = true;
      this.addLogMsg("END Speedtest preparation");
    }
  }

  async startTest() {
    if (!this.prepared) {
      await this.prepare();
      if (!this.prepared) {
        this.testData.error = true;
        console.error(this.testData.errorText);
        console.error("FAILED Speedtest preparation...aborting");
        currentTest.set(this.testData);
      } else {
        this.addLogMsg("BEGIN Test");
        this.inProgress = true;
        this.speedTest.start();
      }
    }
  }

  abortTest() {
    this.inProgress = false;
    this.speedTest.abort();
    this.speedTest = new Speedtest();
    this.pageInterface.onAbort();
  }

  async onEnd(aborted) {
    this.addLogMsg("END Test");
    this.finished = true;
    let testResults = new RuralTestResult(this.testData);
    // Always store local test results
    this.addLogMsg("Saving result locally to browser...");
    testResults.storeTestLocal();
    if (this.upload) {
      if (!aborted) {
        this.addLogMsg("Saving result to db...");
        await testResults.postTest();
      } else {
        this.addLogMsg("test aborted");
      }
    } else {
      this.addLogMsg("Skipping save result to db...");
    }
    this.addLogMsg("DONE!");
  }

  toString() {
    return new RuralTestResult(this.testData).toString();
  }

  getResult() {
    return new RuralTestResult(this.testData);
  }
}

/**
 * RuralTestResults provides containerization for data generated from a speed test
 */
export class RuralTestResult {
  static MILLIDAY = 86400000;
  static TEST_EXPIRY_DAYS = 7;
  constructor(
    jsonContent = {},
    getLocal = false,
    saveResults = true,
    logging = false
  ) {
    if (getLocal) {
      // get from local window.localStorage
      this._content = RuralTestResult.retrieveTestLocal();
    } else if (jsonContent) {
      // get jsonContent to given json object
      this._content = jsonContent;
    } else {
      this._content = {};
    }
    this._saveResults = saveResults;
    this.logging = logging;
  }
  logMsg(msg) {
    if (this.logging) {
      console.log(msg);
    }
  }
  get indentifiers() {
    return {
      ip: this._content.ipAddress,
      user: this._content.userID,
    };
  }
  set location(locationObj) {
    this._content.city = locationObj.city;
    this._content.latitude = locationObj.latlng.lat;
    this._content.longitude = locationObj.latlng.lng;
  }
  set content(testResult) {
    if (!this._content) {
      this._content = testResult;
    }
  }
  storeTestLocal() {
    window.localStorage.setItem(
      "ruralnet-recentTest",
      JSON.stringify(this._content)
    );
    window.localStorage.setItem("ruralnet-recentTestDate", Date.now());
  }
  async postTest(update = false) {
    this.logMsg("Uploading to db...");
    try {
      const res = await fetch("/api/v1/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this._content),
      });

      let respJson = await res.json();
      if (res.ok) {
        this._content._id = respJson.entryId;
        if (this._saveResults && !update) {
          this.storeTestLocal();
        }
        this.logMsg("Upload successful");
        return true;
      } else {
        this.logMsg("Upload failed");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  toggleLocalResultSaving() {
    this._saveResults = !this._saveResults;
    return this._saveResults;
  }
  static retrieveTestLocal() {
    let lastTest = window.localStorage.getItem("ruralnet-recentTest");
    let testJson = null;
    if (lastTest) {
      let lastTestTime = parseInt(
        window.localStorage.getItem("ruralnet-recentTestDate")
      );
      if (
        Date.now() <
        RuralTestResult.MILLIDAY * RuralTestResult.TEST_EXPIRY_DAYS +
          lastTestTime
      ) {
        try {
          testJson = JSON.parse(lastTest);
        } catch (error) {
          window.localStorage.clear();
        }
      } else {
        window.localStorage.clear();
      }
    }
    return testJson;
  }
  toString() {
    return `Ping: ${this._content.ping} ms, Down: ${
      this._content.downloadSpeed || "N/A"
    } Mbps, Up: ${this._content.uploadSpeed || "N/A"} Mbps`;
  }
  metaDataString() {
    return `${this._content.internetProvider}, ${
      this._content.city
    } on ${new Date(`${this._content.date}T${this._content.time}Z`)}`;
  }
}

/**
 * LocationUtility provides a wrapper for location-based operations for a given RuralTestResults instance
 */
export class LocationUtility {
  constructor(results) {
    this.results = results; // a SpeedTestResults instance
  }
  get location() {
    console.log("TODO");
  }
  set location(userInput) {
    console.log("TODO");
  }
  static browserLocation() {
    let geo = navigator.geolocation;
    return new Promise((resolve, reject) => {
      function successCB(position) {
        resolve(position.coords);
      }
      function errorCB(error) {
        reject("geolocationFailed");
      }
      const options = {
        enableHighAccuracy: true, // removed timeout browsers like Edge are SLOW on geoloaction.
        maximumAge: 0, // result must be newer than 5 seconds prior to location request
      };
      try {
        geo.getCurrentPosition(successCB, errorCB, options);
      } catch (error) {
        reject("geolocationFailed");
      }
    });
  }
  // TODO: Whenever we build the component for letting a user update their location
  // manually, we can recycle some of the logic here. So leaving this class
  async updateLocation(newLocation) {
    // given a test ID and newLocation (zip code or city, state)
    // verify that newLocation is valid
    // update the test result in the DB w/ lat + long
    // newLocation can be either a zipcode "12345" or town/state string "Bradford, VT"
    let goodFormat = false;
    let zip = parseInt(newLocation);
    if (zip < 100000 && newLocation.length === 5) {
      goodFormat = true;
    } else if (newLocation.split(",").length === 2) {
      goodFormat = true;
      newLocation = newLocation.replaceAll(/\s+/g, "").toLowerCase();
    }
    if (goodFormat) {
      let location = await LocationUtility.verifyLocationInput(newLocation);
      if (location.verified) {
        this.results.location = location;
        this.results.postTest(true);
        return true;
      } else {
        return false; // user input a good format but had a typo or invalid zip code
      }
    } else {
      return false; // user did not input a good format
    }
  }
  static async verifyLocationInput(userLocationStr) {
    // use internal API to verify that the user has entered a valid location
    // return valid/invalid + coords if valid?
    // let verifyReq = await fetch(/api/v1/verifyLocation?location=${userLocationStr}`
    // );
    // let verification = await verifyReq.json();
    // if (verification.verified) {
    //   console.log("Verified!");
    //   console.log(verification);
    //   return verification;
    // } else {
    //   console.log("Not Verified!");
    //   console.log(verification);
    //   return null;
    // }
  }
}

export class ArcGISController {
  constructor(targetContainer) {
    require([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Locate",

      "esri/widgets/Track",
      "esri/Graphic",
    ], function (
      esriConfig,
      Map,
      MapView,
      Locate,

      Track,
      Graphic
    ) {
      esriConfig.apiKey =
        "AAPK465a177b01b849219d7dbf20b61f9723BkAlush_BsVf8cawsGe_ChUG4NBJrUju6ENhasX38WdCdagW4qK7LTPzHZcqS1VA";

      this.map = new Map({
        basemap: "arcgis-navigation", // Basemap layer service
      });

      this.view = new MapView({
        container: targetContainer,
        map: map,
        center: [-40, 28],
        zoom: 2,
      });
    });
  }
}
