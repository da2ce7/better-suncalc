/**
 * suncalc.test.ts
 *
 * @see {@link ../src/utils.ts}
 */

import {
  DEGREE_IN_RADIANS,
  EARTH_OBLIQUITY_J2000,
  J2000,
  PI,
} from "../src/constants";
import {
  addTime,
  declination,
  eclipticLongitude,
  getPosition,
  getSetJ,
  getTimes,
  hourAngle,
  julianCycle,
  rightAscension,
  solarMeanAnomaly,
  solarTransitJ,
  sunCoords,
} from "../src/suncalc";

// Precision thresholds
const JD_PRECISION = 1e-6; // Days for Julian Dates (~0.0864 seconds)
const ANGLE_PRECISION = 1e-6; // Radians for angles

// Helper function to convert Date to Julian Day
function dateToJD(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Solar Coordinate Calculations
 */
describe("Solar Coordinate Calculations", () => {
  describe("rightAscension", () => {
    test("ecliptic longitude 0°, latitude 0°", () => {
      const l = 0;
      const b = 0;
      expect(rightAscension(l, b)).toBeCloseTo(0, ANGLE_PRECISION);
    });

    test("ecliptic longitude 90°, latitude 0°", () => {
      const l = 90 * DEGREE_IN_RADIANS;
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
      const l = 90 * DEGREE_IN_RADIANS;
      const b = 0;
      const expected = Math.asin(
        Math.cos(b) * Math.sin(EARTH_OBLIQUITY_J2000) * Math.sin(l),
      );
      expect(declination(l, b)).toBeCloseTo(expected, ANGLE_PRECISION);
    });
  });

  describe("solarMeanAnomaly", () => {
    test("at J2000 (d=0)", () => {
      const d = 0;
      const expected = 357.5291 * DEGREE_IN_RADIANS;
      expect(solarMeanAnomaly(d)).toBeCloseTo(expected, ANGLE_PRECISION);
    });

    test("one day after J2000", () => {
      const d = 1;
      const expected = (357.5291 + 0.98560028) * DEGREE_IN_RADIANS;
      expect(solarMeanAnomaly(d)).toBeCloseTo(expected, ANGLE_PRECISION);
    });
  });

  describe("eclipticLongitude", () => {
    test("mean anomaly 0°", () => {
      const M = 0;
      const C =
        1.9148 * Math.sin(M) +
        0.02 * Math.sin(2 * M) +
        0.0003 * Math.sin(3 * M);
      const P = 102.9372 * DEGREE_IN_RADIANS;
      const expected = M + C * DEGREE_IN_RADIANS + P + PI;
      expect(eclipticLongitude(M)).toBeCloseTo(expected, ANGLE_PRECISION);
    });
  });

  describe("sunCoords", () => {
    test("at J2000 (d=0)", () => {
      const coords = sunCoords(0);
      expect(coords.dec).toBeDefined();
      expect(coords.ra).toBeDefined();
      expect(coords.dec).toBeCloseTo(0, 1); // Approximate, due to simplified inputs
    });
  });
});

/**
 * Solar Position Calculations
 */
describe("Solar Position Calculations", () => {
  describe("getPosition", () => {
    test("at J2000, equator, Greenwich", () => {
      const j = J2000;
      const lat = 0;
      const lng = 0;
      const position = getPosition(j, lat, lng);
      expect(position.azimuth).toBeDefined();
      expect(position.altitude).toBeDefined();
      // Note: Specific values require known sun position data
    });
  });
});

/**
 * Solar Event Time Calculations
 */
describe("Solar Event Time Calculations", () => {
  describe("julianCycle", () => {
    test("at J2000 for Greenwich", () => {
      const d = 0;
      const lw = 0;
      expect(julianCycle(d, lw)).toBe(0);
    });

    test("one day after J2000", () => {
      const d = 1;
      const lw = 0;
      expect(julianCycle(d, lw)).toBe(1);
    });
  });

  describe("solarTransitJ", () => {
    test("for ds=0, M=0, L=0", () => {
      const ds = 0;
      const M = 0;
      const L = 0;
      const expected =
        J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
      expect(solarTransitJ(ds, M, L)).toBeCloseTo(expected, JD_PRECISION);
    });
  });

  describe("hourAngle", () => {
    test("for h=0, phi=0, dec=0", () => {
      const h = 0;
      const phi = 0;
      const dec = 0;
      expect(hourAngle(h, phi, dec)).toBeCloseTo(PI / 2, ANGLE_PRECISION);
    });

    test("for h where inner term is 1", () => {
      const h = Math.asin(
        Math.sin(0) * Math.sin(0) + Math.cos(0) * Math.cos(0),
      );
      const phi = 0;
      const dec = 0;
      expect(hourAngle(h, phi, dec)).toBeCloseTo(0, ANGLE_PRECISION);
    });
  });

  describe("getSetJ", () => {
    test("returns a number for typical inputs", () => {
      const h = 0;
      const lw = 0;
      const phi = 0;
      const dec = 0;
      const n = 0;
      const M = 0;
      const L = 0;
      const result = getSetJ(h, lw, phi, dec, n, M, L);
      expect(typeof result).toBe("number");
    });
  });

  describe("getTimes", () => {
    test("returns TimesData with expected properties", () => {
      const j = dateToJD(new Date("2000-01-01T12:00:00Z"));
      const lat = 0;
      const lng = 0;
      const timesData = getTimes(j, lat, lng);
      expect(timesData.solarNoon).toBeDefined();
      expect(timesData.nadir).toBeDefined();
      expect(timesData.sunrise).toBeDefined();
      expect(timesData.sunset).toBeDefined();
      expect(timesData.dawn).toBeDefined();
      expect(timesData.dusk).toBeDefined();
    });

    test("adds custom times correctly", () => {
      addTime(-1, "customRise", "customSet");
      const j = dateToJD(new Date("2000-01-01T12:00:00Z"));
      const lat = 0;
      const lng = 0;
      const timesData = getTimes(j, lat, lng);
      expect(timesData.customRise).toBeDefined();
      expect(timesData.customSet).toBeDefined();
    });
  });
});
