// astro.test.ts
import {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  getPosition,
  getTimes,
} from "../src/index";

const date = new Date("2013-03-05UTC");
const lat = 50.5;
const lng = 30.5;

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

describe("Sun and Moon calculations", () => {
  test("getPosition returns azimuth and altitude for the given time and location", () => {
    const sunPos = getPosition(date, lat, lng);

    // Using Jest's toBeCloseTo since it handles floating point approximations
    expect(sunPos.azimuth).toBeCloseTo(-2.5003175907168385, 10);
    expect(sunPos.altitude).toBeCloseTo(-0.7000406838781611, 10);
  });

  test("getTimes returns sun phases for the given date and location", () => {
    const times = getTimes(date, lat, lng);

    // Loop over expected phases and compare their UTC string representations
    Object.keys(testTimes).forEach((phase) => {
      expect(new Date(testTimes[phase]).toUTCString()).toEqual(
        times[phase].toUTCString(),
      );
    });
  });

  test("getMoonPosition returns moon position data given time and location", () => {
    const moonPos = getMoonPosition(date, lat, lng);

    expect(moonPos.azimuth).toBeCloseTo(-0.9783999522438226, 10);
    expect(moonPos.altitude).toBeCloseTo(0.014551482243892251, 10);
    expect(moonPos.distance).toBeCloseTo(364121.37256256194, 10);
  });

  test("getMoonIllumination returns fraction and angle of moon's illuminated limb and phase", () => {
    const moonIllum = getMoonIllumination(date);

    expect(moonIllum.fraction).toBeCloseTo(0.4848068202456373, 10);
    expect(moonIllum.phase).toBeCloseTo(0.7548368838538762, 10);
    expect(moonIllum.angle).toBeCloseTo(1.6732942678578346, 10);
  });

  test("getMoonTimes returns moon rise and set times", () => {
    const moonTimes = getMoonTimes(new Date("2013-03-04UTC"), lat, lng, true);

    expect(moonTimes.rise?.toUTCString()).toBe("Mon, 04 Mar 2013 23:54:29 GMT");
    expect(moonTimes.set?.toUTCString()).toBe("Mon, 04 Mar 2013 07:47:58 GMT");
  });
});
