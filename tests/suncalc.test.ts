/**
 * suncalc.test.ts
 *
 * Tests for the SunCalc library, covering utility functions, solar coordinate calculations,
 * solar position calculations, and solar event time calculations.
 *
 * @see {@link ../src/suncalc.ts}
 * @see {@link ../src/utils.ts}
 */

import {
  addTime,
  approxJulianCycle,
  approxTransit,
  declination,
  DEGREES_TO_RADIANS,
  EARTH_OBLIQUITY_J2000,
  eclipticLongitude,
  getPosition,
  getPreciseJulianCycle,
  getPreciseTransitForCycle,
  getTimes,
  hourAngle,
  JULIAN_EPOCH_J2000,
  longitudeToRadWest,
  PI,
  rightAscension,
  siderealTime,
  solarMeanAnomaly,
  sunCoords,
} from "../src";

const PLACEHOLDER_JD_CYCLE = 0;
const PLACEHOLDER_JD_TRANSIT = 0;

// Precision thresholds
const JD_PRECISION = 6; // Days for Julian Dates (~0.0864 seconds)
const JD_PRECISION_ESTIMATE = 0; // Days for Julian Dates (~1 day)
const ANGLE_PRECISION = 1e-6; // Radians for angles

// Helper function to convert Date to Julian Day in Terrestrial Time (TT)
function dateToJDTT(date: Date): number {
  const jd_utc = date.getTime() / 86400000 + 2440587.5; // JD in UTC
  const deltaT = 64 / 86400; // Approximate ΔT for year 2000 (~64 seconds), adjust as needed
  return jd_utc + deltaT; // JD TT = JD UTC + ΔT
}

describe("SunCalc Tests", () => {
  // Shared constants
  const lwGreenwich = longitudeToRadWest(0); // Greenwich longitude in radians
  const lw90E = longitudeToRadWest(-90); // 90°E longitude in radians
  const epsilon = 0.0001; // Small time offset (~8.64 seconds)

  // Base transit times for Greenwich
  const transit_0 = getPreciseTransitForCycle(0, lwGreenwich);
  const transit_1 = getPreciseTransitForCycle(1, lwGreenwich);
  const transit_2 = getPreciseTransitForCycle(2, lwGreenwich);

  // Midpoints for Greenwich
  const midpoint_0_1 = (transit_0 + transit_1) / 2;
  const midpoint_1_2 = (transit_1 + transit_2) / 2;

  ///### Utility Functions
  describe("Utility Functions", () => {
    describe("approxJulianCycle", () => {
      test("at J2000 for Greenwich", () => {
        const jd_tt = JULIAN_EPOCH_J2000;
        const lw = 0;
        const julianCycle = approxJulianCycle(jd_tt, lw);
        const transitJD = approxTransit(0, lw, julianCycle);

        expect(julianCycle).toBeGreaterThan(0 - 1);
        expect(julianCycle).toBeLessThan(1 + 1);
        expect(transitJD).toBeGreaterThan(JULIAN_EPOCH_J2000 - 1);
        expect(transitJD).toBeLessThan(JULIAN_EPOCH_J2000 + 1);
      });

      test("one day after J2000 for Greenwich", () => {
        const jd_tt = JULIAN_EPOCH_J2000 + 1;
        const lw = 0;
        const julianCycle = approxJulianCycle(jd_tt, lw);
        const transitJD = approxTransit(0, lw, julianCycle);

        expect(julianCycle).toBeCloseTo(
          PLACEHOLDER_JD_CYCLE,
          JD_PRECISION_ESTIMATE,
        );
        expect(transitJD).toBeCloseTo(
          PLACEHOLDER_JD_TRANSIT,
          JD_PRECISION_ESTIMATE,
        );
      });
    });
    describe("getPreciseJulianCycle", () => {
      test("returns correct cycle and transit JD for exact transit time at Greenwich", () => {
        const { julianCycle, transitJD } = getPreciseJulianCycle(
          transit_1,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("selects next cycle when slightly after midpoint between transits", () => {
        const jd_tt = midpoint_0_1 + epsilon;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("selects current cycle when slightly before midpoint between transits", () => {
        const jd_tt = midpoint_1_2 - epsilon;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("selects previous cycle when slightly before midpoint between transits", () => {
        const jd_tt = midpoint_0_1 - epsilon;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("selects next cycle when slightly after midpoint between transits", () => {
        const jd_tt = midpoint_1_2 + epsilon;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("at J2000 for Greenwich", () => {
        const jd_tt = JULIAN_EPOCH_J2000;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("one day after J2000 for Greenwich", () => {
        const jd_tt = JULIAN_EPOCH_J2000 + 1;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);
      });

      test("transit time has hour angle close to zero at Greenwich", () => {
        const transitJD = getPreciseTransitForCycle(1, lwGreenwich);
        const evaluator = (jd_tt: number): number => {
          const c = sunCoords(jd_tt);
          const gmst = siderealTime(jd_tt, 0);
          const lst = gmst - lwGreenwich;
          return lst - c.ra; // Hour angle
        };
        const hourAngleValue = evaluator(transitJD);
        expect(hourAngleValue).toBeCloseTo(0, 6); // At transit, hour angle should be near zero
      });

      test("at J2000 for 90°E", () => {
        const jd_tt = JULIAN_EPOCH_J2000;

        const { julianCycle, transitJD } = getPreciseJulianCycle(jd_tt, lw90E);

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);

        const transit_1_90E = getPreciseTransitForCycle(julianCycle, lw90E);
        expect(Math.abs(transitJD - JULIAN_EPOCH_J2000)).toBeLessThan(0.5);
        expect(transitJD).toBeCloseTo(transit_1_90E, JD_PRECISION);
      });

      test("negative JD (100 days before J2000)", () => {
        const jd_tt = JULIAN_EPOCH_J2000 - 100;

        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);

        expect(Math.abs(julianCycle + 100)).toBeLessThan(2);
      });

      test("far future JD (1000 days after J2000)", () => {
        const jd_tt = JULIAN_EPOCH_J2000 + 1000;
        const { julianCycle, transitJD } = getPreciseJulianCycle(
          jd_tt,
          lwGreenwich,
        );

        expect(julianCycle).toBeCloseTo(PLACEHOLDER_JD_CYCLE, JD_PRECISION);
        expect(transitJD).toBeCloseTo(PLACEHOLDER_JD_TRANSIT, JD_PRECISION);

        expect(Math.abs(julianCycle - 1000)).toBeLessThan(2);
      });

      test.each([
        [-2, PLACEHOLDER_JD_CYCLE, PLACEHOLDER_JD_TRANSIT],
        [-1, PLACEHOLDER_JD_CYCLE, PLACEHOLDER_JD_TRANSIT],
        [0, PLACEHOLDER_JD_CYCLE, PLACEHOLDER_JD_TRANSIT],
        [1, PLACEHOLDER_JD_CYCLE, PLACEHOLDER_JD_TRANSIT],
        [2, PLACEHOLDER_JD_CYCLE, PLACEHOLDER_JD_TRANSIT],
      ])(
        "multiple cycles: transit_1 + %i days returns cycle %i",
        (offset, expectedCycle, expectedTransit) => {
          const jd_tt = transit_1 + offset;
          const { julianCycle, transitJD } = getPreciseJulianCycle(
            jd_tt,
            lwGreenwich,
          );
          expect(julianCycle).toBeCloseTo(expectedCycle, JD_PRECISION);
          expect(transitJD).toBeCloseTo(expectedTransit, JD_PRECISION);
        },
      );

      test("near midpoint_0_1 with tiny epsilon", () => {
        const tinyEpsilon = 1e-6; // ~0.0864 seconds
        const jd_before = midpoint_0_1 - tinyEpsilon;
        const jd_after = midpoint_0_1 + tinyEpsilon;
        const cycle_before = getPreciseJulianCycle(
          jd_before,
          lwGreenwich,
        ).julianCycle;
        const cycle_after = getPreciseJulianCycle(
          jd_after,
          lwGreenwich,
        ).julianCycle;
        expect(cycle_before).toBe(0);
        expect(cycle_after).toBe(1);
      });
    });
  });

  ///### Solar Coordinate Calculations
  describe("Solar Coordinate Calculations", () => {
    describe("rightAscension", () => {
      test("ecliptic longitude 0°, latitude 0°", () => {
        const l = 0;
        const b = 0;
        expect(rightAscension(l, b)).toBeCloseTo(0, ANGLE_PRECISION);
      });

      test("ecliptic longitude 90°, latitude 0°", () => {
        const l = 90 * DEGREES_TO_RADIANS;
        const b = 0;
        const expected = Math.atan2(
          Math.sin(l) * Math.cos(EARTH_OBLIQUITY_J2000),
          Math.cos(l),
        );
        expect(rightAscension(l, b)).toBeCloseTo(expected, ANGLE_PRECISION);
      });
    });

    describe("declination", () => {
      test("ecliptic longitude 0°, latitude 0°", () => {
        const l = 0;
        const b = 0;
        expect(declination(l, b)).toBeCloseTo(0, ANGLE_PRECISION);
      });

      test("ecliptic longitude 90°, latitude 0°", () => {
        const l = 90 * DEGREES_TO_RADIANS;
        const b = 0;
        const expected = Math.asin(
          Math.cos(b) * Math.sin(EARTH_OBLIQUITY_J2000) * Math.sin(l),
        );
        expect(declination(l, b)).toBeCloseTo(expected, ANGLE_PRECISION);
      });
    });

    describe("solarMeanAnomaly", () => {
      test("at J2000", () => {
        const jd_tt = JULIAN_EPOCH_J2000;
        const expected = 357.5291 * DEGREES_TO_RADIANS;
        expect(solarMeanAnomaly(jd_tt)).toBeCloseTo(expected, ANGLE_PRECISION);
      });

      test("one day after J2000", () => {
        const jd_tt = JULIAN_EPOCH_J2000 + 1;
        const expected = (357.5291 + 0.98560028) * DEGREES_TO_RADIANS;
        expect(solarMeanAnomaly(jd_tt)).toBeCloseTo(expected, ANGLE_PRECISION);
      });
    });

    describe("eclipticLongitude", () => {
      test("mean anomaly 0°", () => {
        const M = 0;
        const C =
          1.9148 * Math.sin(M) +
          0.02 * Math.sin(2 * M) +
          0.0003 * Math.sin(3 * M);
        const P = 102.9372 * DEGREES_TO_RADIANS;
        const expected = M + C * DEGREES_TO_RADIANS + P + PI;
        expect(eclipticLongitude(M)).toBeCloseTo(expected, ANGLE_PRECISION);
      });
    });

    describe("sunCoords", () => {
      test("at J2000", () => {
        const coords = sunCoords(JULIAN_EPOCH_J2000);
        expect(coords.dec).toBeDefined();
        expect(coords.ra).toBeDefined();
        expect(coords.dec).toBeCloseTo(-0.4, 1); // Approximate declination at J2000
      });
    });
  });

  ///### Solar Position Calculations
  describe("Solar Position Calculations", () => {
    describe("getPosition", () => {
      test("at J2000, equator, Greenwich", () => {
        const jd_tt = JULIAN_EPOCH_J2000;
        const lat = 0;
        const lng = 0;
        const position = getPosition(jd_tt, lat, lng);
        expect(position.azimuth).toBeDefined();
        expect(position.altitude).toBeDefined();
        // Specific values could be added with known astronomical data
      });
    });
  });

  /// ### Solar Event Time Calculations
  describe("Solar Event Time Calculations", () => {
    describe("hourAngle", () => {
      test("for h=0, phi=0, dec=0", () => {
        const h = 0;
        const phi = 0;
        const dec = 0;
        expect(hourAngle(h, phi, dec)).toBeCloseTo(PI / 2, ANGLE_PRECISION);
      });

      test("for h where inner term is 1", () => {
        const h = Math.asin(Math.cos(0) * Math.cos(0)); // h = 90° in radians
        const phi = 0;
        const dec = 0;
        expect(hourAngle(h, phi, dec)).toBeCloseTo(0, ANGLE_PRECISION);
      });
    });

    describe("getTimes", () => {
      test("returns TimesData with expected properties", () => {
        const date = new Date("2000-01-01T12:00:00Z");
        const jd_tt = dateToJDTT(date);
        const lat = 0;
        const lng = 0;
        const timesData = getTimes(jd_tt, lat, lng);
        expect(timesData.solarNoon).toBeDefined();
        expect(timesData.nadir).toBeDefined();
        expect(timesData.sunrise).toBeDefined();
        expect(timesData.sunset).toBeDefined();
        expect(timesData.dawn).toBeDefined();
        expect(timesData.dusk).toBeDefined();
      });

      test("adds custom times correctly", () => {
        addTime(-1, "customRise", "customSet");
        const date = new Date("2000-01-01T12:00:00Z");
        const jd_tt = dateToJDTT(date);
        const lat = 0;
        const lng = 0;
        const timesData = getTimes(jd_tt, lat, lng);
        expect(timesData.customRise).toBeDefined();
        expect(timesData.customSet).toBeDefined();
      });

      test("polar day: no sunrise or sunset", () => {
        const date = new Date("2000-06-21T12:00:00Z"); // Summer solstice
        const jd_tt = dateToJDTT(date);
        const lat = 80; // High latitude
        const lng = 0;
        const timesData = getTimes(jd_tt, lat, lng);
        expect(timesData.sunrise).toBeUndefined();
        expect(timesData.sunset).toBeUndefined();
      });

      test("polar night: no sunrise or sunset", () => {
        const date = new Date("2000-12-21T12:00:00Z"); // Winter solstice
        const jd_tt = dateToJDTT(date);
        const lat = 80; // High latitude
        const lng = 0;
        const timesData = getTimes(jd_tt, lat, lng);
        expect(timesData.sunrise).toBeUndefined();
        expect(timesData.sunset).toBeUndefined();
      });

      test("equinox at equator: approximately 12-hour day", () => {
        const date = new Date("2000-03-20T12:00:00Z"); // Approximate vernal equinox
        const jd_tt = dateToJDTT(date);
        const lat = 0;
        const lng = 0;
        const timesData = getTimes(jd_tt, lat, lng);
        const dayLengthHours = (timesData.sunset - timesData.sunrise) * 24; // Convert days to hours
        expect(dayLengthHours).toBeCloseTo(12, 1);
      });

      test("solar noon difference between Greenwich and 90°E", () => {
        const date = new Date("2000-01-01T12:00:00Z");
        const jd_tt = dateToJDTT(date);
        const timesGreenwich = getTimes(jd_tt, 0, 0);
        const times90E = getTimes(jd_tt, 0, 90);
        const diffDays = timesGreenwich.solarNoon - times90E.solarNoon;
        expect(diffDays).toBeCloseTo(0.25, 2); // 6 hours is 0.25 days
      });
    });
  });
});
