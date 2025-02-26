import {
  dateToJulian,
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  getPosition,
  getTimes,
  julianToDate,
} from "../src/index";

// Define moon phases as a union type
type MoonPhase = "New Moon" | "First Quarter" | "Full Moon" | "Last Quarter";

// Define dates with proper ISO 8601 UTC format for different moon phases
const moonTestDates: { name: MoonPhase; date: Date }[] = [
  { name: "New Moon", date: new Date("2013-02-10T00:00:00Z") }, // Approx new moon
  { name: "First Quarter", date: new Date("2013-02-17T00:00:00Z") }, // Approx first quarter
  { name: "Full Moon", date: new Date("2013-02-25T00:00:00Z") }, // Approx full moon
  { name: "Last Quarter", date: new Date("2013-03-04T00:00:00Z") }, // Approx last quarter
];

// Observer locations
const locations = [
  { name: "Kyiv", lat: 50.5, lng: 30.5 }, // Original location
  { name: "Equator", lat: 0, lng: 0 }, // Equatorial
  { name: "Sydney", lat: -33.8688, lng: 151.2093 }, // Southern hemisphere
];

// Original sun test date
const sunDate = new Date("2013-03-05T00:00:00Z"); // March 5, 2013, 00:00 UTC

// Expected sun phase times (unchanged from original)
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

// Expected moon times for Kyiv (lat: 50.5, lng: 30.5) based on approximate calculations
const expectedMoonTimes: Record<MoonPhase, { rise: string; set: string }> = {
  "New Moon": {
    rise: "2013-02-10T06:00:00Z", // Approximate
    set: "2013-02-10T17:00:00Z", // Approximate
  },
  "First Quarter": {
    rise: "2013-02-17T12:00:00Z", // Approximate
    set: "2013-02-18T01:00:00Z", // Approximate
  },
  "Full Moon": {
    rise: "2013-02-25T17:00:00Z", // Approximate
    set: "2013-02-26T06:00:00Z", // Approximate
  },
  "Last Quarter": {
    rise: "2013-03-04T23:54:29Z", // From original test
    set: "2013-03-04T07:47:58Z", // From original test
  },
};

describe("Sun and Moon calculations", () => {
  // Sun-related tests (unchanged)
  const sunJD = dateToJulian(sunDate);
  const lat = 50.5;
  const lng = 30.5;

  test("getPosition returns azimuth and altitude for the given time and location", () => {
    const sunPos = getPosition(sunJD, lat, lng);
    expect(sunPos.azimuth).toBeCloseTo(-2.5003175907168385, 10);
    expect(sunPos.altitude).toBeCloseTo(-0.7000406838781611, 10);
  });

  test("getTimes returns sun phases for the given date and location", () => {
    const times = getTimes(sunJD, lat, lng);
    Object.keys(testTimes).forEach((phase) => {
      const actualDate = julianToDate(times[phase]);
      const expectedDate = new Date(testTimes[phase]);
      expect(actualDate.toUTCString()).toEqual(expectedDate.toUTCString());
    });
  });

  // Moon-related tests with additional cases
  describe("Moon calculations across phases and locations", () => {
    moonTestDates.forEach(({ name: phaseName, date }) => {
      const jd = dateToJulian(date);

      describe(`Moon calculations for ${phaseName}`, () => {
        locations.forEach(({ name: locName, lat, lng }) => {
          test(`getMoonPosition for ${locName}`, () => {
            const moonPos = getMoonPosition(jd, lat, lng);
            expect(moonPos.azimuth).toBeDefined();
            expect(moonPos.altitude).toBeDefined();
            expect(moonPos.distance).toBeGreaterThan(356000); // Min distance to moon (km)
            expect(moonPos.distance).toBeLessThan(406000); // Max distance to moon (km)
          });

          if (locName === "Kyiv") {
            test(`getMoonTimes for ${locName}`, () => {
              const moonTimes = getMoonTimes(jd, lat, lng);
              const expected = expectedMoonTimes[phaseName];
              const expectedRise = new Date(expected.rise);
              const expectedSet = new Date(expected.set);

              if (moonTimes.rise) {
                expect(julianToDate(moonTimes.rise).toUTCString()).toBe(
                  expectedRise.toUTCString(),
                );
              }
              if (moonTimes.set) {
                expect(julianToDate(moonTimes.set).toUTCString()).toBe(
                  expectedSet.toUTCString(),
                );
              }
            });
          }

          if (locName === "Kyiv" && phaseName === "Last Quarter") {
            test(`getMoonIllumination for ${phaseName}`, () => {
              const moonIllum = getMoonIllumination(jd);
              expect(moonIllum.fraction).toBeCloseTo(0.4848068202456373, 10);
              expect(moonIllum.phase).toBeCloseTo(0.7548368838538762, 10);
              expect(moonIllum.angle).toBeCloseTo(1.6732942678578346, 10);
            });

            test(`getMoonPosition for ${locName} (specific values)`, () => {
              const moonPos = getMoonPosition(jd, lat, lng);
              expect(moonPos.azimuth).toBeCloseTo(-0.9783999522438226, 10);
              expect(moonPos.altitude).toBeCloseTo(0.014551482243892251, 10);
              expect(moonPos.distance).toBeCloseTo(364121.37256256194, 10);
            });
          } else {
            test(`getMoonIllumination for ${phaseName} at ${locName} (basic check)`, () => {
              const moonIllum = getMoonIllumination(jd);
              expect(moonIllum.fraction).toBeGreaterThanOrEqual(0);
              expect(moonIllum.fraction).toBeLessThanOrEqual(1);
              expect(moonIllum.phase).toBeGreaterThanOrEqual(0);
              expect(moonIllum.phase).toBeLessThanOrEqual(1);
              expect(moonIllum.angle).toBeDefined();
            });
          }
        });
      });
    });
  });
});
