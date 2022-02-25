import Speedtest from "./speedtest.js";
const SPEEDTEST_SERVERS = [
  {
    name: "RuralNet Server",
    server: "/test/", //"https://192.168.1.13:3000/",  // /test/ will point to where the speed test backend routes are located in /src
    dlURL: "garbage.json",
    ulURL: "empty.json", // "empty.bin", // in speedtest docs, an empty file (like empty.bin) can be a suitable replacement for a real backend - perhaps this gets around heroku h18 503 error "empty.json",
    pingURL: "empty.json",
    getIpURL: "getIP.json",
  },
];
/**
 * A class to make using cookies in the front-end easy
 */
// TODO: Delete me?
export class CookieUtility {
  constructor() {
    let rawCookie = document.cookie;
    this._cookies = {};
    rawCookie.split(";").forEach((pair) => {
      let key, value;
      [key, value] = pair.split("=");
      this._cookies[key] = value;
    });
  }
  get allCookies() {
    return this._cookies;
  }
  getValue(cookieKey) {
    return this._cookies[cookieKey];
  }
  static agree() {
    window.localStorage.setItem("cookieConsent", "true");
    let recovery = CookieUtility.recoverUserCookie();
    if (!recovery) {
      CookieUtility.getNewCookie();
    }
  }
  static decline() {
    window.localStorage.setItem("cookieConsent", "false");
    window.localStorage.setItem("cookiesDeclined", new Date().getTime());
    let expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() - 1);
    document.cookie = "user=null; Path=/; Expires=" + expiredDate.toUTCString();
  }
  static async getNewCookie() {
    // await fetch("id/cookieMonster.json");
  }
  static recoverUserCookie() {
    let recentTest = window.localStorage.getItem("recentTest");
    if (recentTest !== null && CookieUtility.consentStatus().consented) {
      let testJSON = JSON.parse(recentTest);
      if (testJSON.userID) {
        document.cookie = `user=${testJSON.userID}; Path=/`;
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  static consentStatus() {
    if (window.localStorage.getItem("cookieConsent") === "true") {
      return { consented: true, askAgain: false, explicit: true };
    } else if (window.localStorage.getItem("cookieConsent") === "false") {
      return { consented: false, askAgain: false, explicit: true };
    } else {
      return { consented: true, askAgain: true, explicit: false };
    }
  }
}

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
  static emptyTestJson = {
    date: null,
    time: null,
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
  constructor(componentIds = null, logs = true, userid) {
    this.speedTest = new Speedtest();
    this.today = new Date();
    this.prepared = false;
    this.inProgress = false;
    this.finished = false;
    this._state = 0;
    this.chunkSize = 100;
    this.testOrder = "IPDU"; //order in which tests will be performed as a string. D=Download, U=Upload, P=Ping+Jitter, I=IP, _=1 second delay
    this.auth = import.meta.env.DEV
      ? import.meta.env.VITE_BACKEND_AUTH
      : process.env.BACKEND_AUTH;
    if (!componentIds) {
      componentIds = {
        // ids of elements that that speedtest wants to write information to
        result: "result",
        title: "title",
        done: "done",
        log: "log",
        testBtn: "test",
        cancelBtn: "cancel",
      };
    }
    this.pageInterface = new SpeedTestPageInterface(componentIds, logs);
    this.pageInterface.onPageLoad();
    this.testData = RuralTest.emptyTestJson;
    this.logging = logs;
    this.userID = userid;
  }
  get state() {
    return {
      prepared: this.prepared,
      finished: this.finished,
      inProgress: this.inProgress,
      stage: RuralTest.testStates[this._state],
    };
  }
  async getFinished() {
    console.log("blahhh");
    // return(this.finished)
  }
  toggleUpload() {
    // turn off
    if (this.testOrder.endsWith("_U")) {
      this.testOrder = this.testOrder.substring(0, 3);
      return false;
      // turn on
    } else {
      this.testOrder += "_U";
      return true;
    }
  }
  async prepare() {
    this.pageInterface.addLogMsg("BEGIN Speedtest preparation...");
    this.pageInterface.addLogMsg(
      "Getting user IP and approximate location from Abstract API"
    );
    const key = import.meta.env.DEV
      ? import.meta.env.VITE_ABSTRACT_API
      : ABSTRACT_API;
    const resp = await fetch(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=${key}`
    );
    const geolocationData = await resp.json();
    this.pageInterface.addLogMsg(
      "Checking db for existing test for this IP + userid"
    );
    const previousTestReq = await fetch(
      `/api/v1/findUser?ip=${geolocationData.ip_address}`
    );
    let prevTestMeta = await previousTestReq.json();
    if (!prevTestMeta.err) {
      this.pageInterface.addLogMsg(
        "Found existing document...copying metadata from last test"
      );
      this.testData.ipAddress = prevTestMeta.ipAddress;
      this.testData.internetProvider = prevTestMeta.internetProvider;
      this.testData.city = prevTestMeta.city;
      this.testData.latitude = prevTestMeta.latitude;
      this.testData.longitude = prevTestMeta.longitude;
    } else {
      this.pageInterface.addLogMsg(
        "No document found...setting up first time test"
      );
      this.testData.ipAddress = geolocationData.ip_address;
      this.testData.internetProvider = geolocationData.connection.isp_name;
      this.testData.latitude = parseFloat(geolocationData.latitude);
      this.testData.longitude = parseFloat(geolocationData.longitude);
      this.testData.city = `${geolocationData.city}, ${geolocationData.region_iso_code}`;

      // User Browser location API + Mapquest to try to get more reliable location
      let browserCoords;
      let cityreq, cityInfo;
      try {
        this.pageInterface.addLogMsg(
          "Trying browser location API to get more precise location"
        );
        browserCoords = await LocationUtility.browserLocation();
      } catch (error) {
        console.error(error);
      }
      if (browserCoords !== "geolocationFailed") {
        this.pageInterface.addLogMsg(
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
          this.pageInterface.addLogMsg("Found city...saving");
          this.testData.city = `${cityInfo.city}, ${cityInfo.state}`;
        } else {
          this.pageInterface.addLogMsg(
            "Could not find city, state in Mapquest"
          );
        }
      }
    }
    this.pageInterface.addLogMsg("Finishing preparations...");
    this.testData.date = this.today.toISOString().split("T")[0];
    this.testData.time = this.today.toISOString().split("T")[1].slice(0, -1);
    this.testData.userID = this.userID;
    this.prepared = true;
  }
  async startTest() {
    if (!this.prepared) {
      await this.prepare();
      this.pageInterface.addLogMsg(this.testData);
    }
    // this.inProgress = true;
    // this.pageInterface.addLogMsg("Finalizing Speedtest Configuration");
    // this.speedTest.setParameter("garbagePhp_chunkSize", this.chunkSize);
    // this.speedTest.setParameter("test_order", this.testOrder); // no need for IP check, removed upload test from Heroku deploy because it doesn't work w/ heroku
    // this.speedTest.setSelectedServer(SPEEDTEST_SERVERS[0]); // see template.html for SPEEDTEST_SERVERS - there is only one server
    // this.speedTest.onupdate = (data) => {
    //   this.onUpdate(data);
    // };
    // // this.speedTest.onend = (data) => { this.onEnd(data) };
    // this.pageInterface.addLogMsg("Starting Speedtest");
    // this.pageInterface.onStart();
    // this.speedTest.start();
    // this.speedTest.onend = (data) => {
    //   this.onEnd(data);
    // };
  }
  abortTest() {
    this.inProgress = false;
    this.speedTest.abort();
    this.speedTest = new Speedtest();
    this.pageInterface.onAbort();
  }
  onUpdate(data) {
    this.testData.downloadSpeed = data.dlStatus;
    this.testData.uploadSpeed = data.ulStatus;
    this.testData.ping = data.pingStatus;
    this._state = data.testState + 1;
    // this.pageInterface.onUpdate(this.toString(), this._state)
    this.pageInterface.onUpdate(this.testData, this._state);
  }
  onEnd(aborted) {
    this.finished = true;
    this.pageInterface.onEnd(aborted, this.testData);
    if (!aborted) {
      let testResults = new RuralTestResult(this.testData);
      testResults.postTest();
    }
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
  constructor(jsonContent = {}, getLocal = false, saveResults = true) {
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
    window.localStorage.setItem("recentTest", JSON.stringify(this._content));
    window.localStorage.setItem("recentTestDate", Date.now());
  }
  async postTest(update = false) {
    // TODO: Test me
    // const res = await fetch("/api/v1/saveTest", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(this._content)
    // })
    // if (res.ok) {
    //   let respJson = await res.json();
    //   this._content._id = respJson.entryId;
    //   if (this._saveResults && !update) {
    //     this.storeTestLocal();
    //   }
    //   return true;
    // }
    // return false;
  }
  toggleLocalResultSaving() {
    this._saveResults = !this._saveResults;
    return this._saveResults;
  }
  static retrieveTestLocal() {
    let lastTest = window.localStorage.getItem("recentTest");
    let testJson = null;
    if (lastTest) {
      let lastTestTime = parseInt(
        window.localStorage.getItem("recentTestDate")
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

/**
 * A wrapper class to make speed test interactions with the DOM cleaner
 * TODO: migrate pieces from speedtest
 */
export class SpeedTestPageInterface {
  constructor(elementIds, log = true) {
    this.elements = {};
    Object.keys(elementIds).forEach((key) => {
      this.elements[key] = document.getElementById(elementIds[key]);
    });
    this.lastState = "not started";
    this.logging = log;
    this.results = null;
  }
  getResults() {
    return this.results;
  }

  onPageLoad() {
    let prevResults = new RuralTestResult({}, true);
    if (prevResults._content && CookieUtility.consentStatus().consented) {
      this.results = prevResults._content;
      // const date = new Date(`${prevResults._content.date}T${prevResults._content.time}Z`)
      // this.elements.result.textContent = "Previous Results: " + prevResults.toString();
      // this.elements.done.textContent = `Last test taken on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
  }
  onStart() {
    if (this.logging) {
      // this.elements.title.textContent = "Speedtest in progress";
    }
    // this.elements.testBtn.disabled = true;
    // this.elements.cancelBtn.disabled = false;
  }
  onUpdate(resultProgress, stateIndex) {
    let presentState = RuralTest.testStates[stateIndex];
    if (presentState !== this.lastState) {
      this.addLogMsg(`Test ${presentState}...`);
      this.lastState = presentState;
      this.elements.done.textContent = presentState;
    }
    // this.elements.result.textContent = resultProgress;
    this.results = resultProgress;
  }
  onAbort() {
    this.addLogMsg("Test Aborted by user");
    // this.elements.cancelBtn.disabled = true;
    // this.elements.testBtn.disabled = false;
    this.elements.title.textContent = "Speedtest cancelled";
  }
  onEnd(aborted, data) {
    this.elements.done.textContent =
      "Finished" + (aborted ? " - Aborted" : "!");
    // this.elements.testBtn.textContent = 'Click to test again';
    if (!aborted) {
      this.addLogMsg("Test Complete!");
      // this.elements.cancelBtn.disabled = true;
      // this.elements.testBtn.disabled = false;
      // this.elements.title.textContent = 'Speedtest Results';
      // this.elements.result.innerHTML += `, <a href="https://google.com/maps/search/${data.latitude},${data.longitude}">Location: ${data.city}</a>`;
    }
  }
  toggleLogging() {
    this.logging = !this.logging;
    return this.logging;
  }
  addLogMsg(msg) {
    if (this.logging) {
      // Just replace with simple console logs so we don't need to presume what the DOM
      // looks like when the SpeedTest component is used
      console.log(msg);
    }
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
