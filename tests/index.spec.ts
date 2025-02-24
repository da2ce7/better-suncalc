import assert from "assert";
import {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  getPosition,
  getTimes,
} from "../src/index";

function near(val1: number, val2: number, margin: number = 1e-15): boolean {
  return Math.abs(val1 - val2) < margin;
}

const date = new Date("2013-03-05UTC"),
  lat = 50.5,
  lng = 30.5;

const testTimes: { [key: string]: string } = {
  solarNoon: "2013-03-05T10:10:57Z",
  nadir: "2013-03-05T22:10:57Z",
  sunrise: "2013-03-05T04:34:56Z",
  sunset: "2013-03-05T15:46:57Z",
  sunriseEnd: "2013-03-05T04:38:19Z",
  sunsetStart: "2013-03-05T15:43:34Z",
  dawn: "2013-03-05T04:02:17Z",
  dusk: "2013-03-05T16:19:36Z",
  nauticalDawn: "2013-03-05T03:24:31Z",
  nauticalDusk: "2013-03-05T16:57:22Z",
  nightEnd: "2013-03-05T02:46:17Z",
  night: "2013-03-05T17:35:36Z",
  goldenHourEnd: "2013-03-05T05:19:01Z",
  goldenHour: "2013-03-05T15:02:52Z",
};

it("getPosition returns azimuth and altitude for the given time and location", function () {
  const sunPos = getPosition(date, lat, lng);

  assert.ok(near(sunPos.azimuth, -2.5003175907168385), "azimuth");
  assert.ok(near(sunPos.altitude, -0.7000406838781611), "altitude");
});

it("getTimes returns sun phases for the given date and location", function () {
  const times = getTimes(date, lat, lng);

  for (const i in testTimes) {
    assert.strictEqual(
      new Date(testTimes[i]).toUTCString(),
      times[i].toUTCString(),
      i,
    );
  }
});

it("getMoonPosition returns moon position data given time and location", function () {
  const moonPos = getMoonPosition(date, lat, lng);

  assert.ok(near(moonPos.azimuth, -0.9783999522438226), "azimuth");
  assert.ok(near(moonPos.altitude, 0.014551482243892251), "altitude");
  assert.ok(near(moonPos.distance, 364121.37256256194), "distance");
});

it("getMoonIllumination returns fraction and angle of moon's illuminated limb and phase", function () {
  const moonIllum = getMoonIllumination(date);

  assert.ok(near(moonIllum.fraction, 0.4848068202456373), "fraction");
  assert.ok(near(moonIllum.phase, 0.7548368838538762), "phase");
  assert.ok(near(moonIllum.angle, 1.6732942678578346), "angle");
});

it("getMoonTimes returns moon rise and set times", function () {
  const moonTimes = getMoonTimes(new Date("2013-03-04UTC"), lat, lng, true);

  assert.strictEqual(
    moonTimes.rise?.toUTCString(),
    "Mon, 04 Mar 2013 23:54:29 GMT",
  );
  assert.strictEqual(
    moonTimes.set?.toUTCString(),
    "Mon, 04 Mar 2013 07:47:58 GMT",
  );
});
