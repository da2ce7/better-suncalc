/**
 * utils.test.ts
 *
 * @see {@link ../src/utils.ts}
 */

import { DEGREE_IN_RADIANS, J2000, PI } from "../src/constants";
import {
  addUniqueJD,
  altitude,
  astroRefraction,
  azimuth,
  computeDerivative,
  dateToJulian,
  deltaT,
  findAltitudeCrossingEvents,
  generateEventSeeds,
  hoursLater,
  julianToDate,
  latitudeToRad,
  longitudeToRadWest,
  refineEvent,
  siderealTime,
  solarDeclinationRate,
  toDays,
} from "../src/utils";

// Precision thresholds
const TIME_PRECISION_MS = 1; // 1ms tolerance for date conversions
const ANGLE_PRECISION = 1e-6; // Radians precision for angles
const JD_PRECISION = 1e-6; // Days precision for Julian Dates

/**
 * Time Conversion Utilities
 */
describe("Time Conversion Utilities", () => {
  describe("deltaT", () => {
    test("returns a number for various years", () => {
      const dates = [
        new Date("-1000-01-01T00:00:00Z"), // Before -500
        new Date("0000-01-01T00:00:00Z"), // -500 to 500
        new Date("1600-01-01T00:00:00Z"), // 1600 to 1700
        new Date("2000-01-01T00:00:00Z"), // 1986 to 2005
        new Date("2100-01-01T00:00:00Z"), // Beyond 2050 (extrapolation)
      ];
      dates.forEach((date) => {
        expect(typeof deltaT(date)).toBe("number");
        expect(deltaT(date)).toBeGreaterThan(-10000); // Reasonable range check
        expect(deltaT(date)).toBeLessThan(10000);
      });
    });

    test("uses correct formula for year 2000", () => {
      const date = new Date("2000-01-01T00:00:00Z");
      const expected = 63.86; // t=0 in the 1986-2005 range
      expect(deltaT(date)).toBeCloseTo(expected, 2);
    });
  });

  describe("dateToJulian and julianToDate", () => {
    test("round-trip consistency from date to JD and back", () => {
      const originalDate = new Date("2000-01-01T12:00:00Z");
      const jd = dateToJulian(originalDate);
      const dateBack = julianToDate(jd);
      const diff = Math.abs(dateBack.getTime() - originalDate.getTime());
      expect(diff).toBeLessThanOrEqual(TIME_PRECISION_MS);
    });

    test("round-trip consistency across multiple dates", () => {
      const dates = [
        new Date("1970-01-01T00:00:00Z"),
        new Date("2000-01-01T12:00:00Z"),
        new Date("2020-01-01T00:00:00Z"),
      ];
      dates.forEach((date) => {
        const jd = dateToJulian(date);
        const dateBack = julianToDate(jd);
        const diff = Math.abs(dateBack.getTime() - date.getTime());
        expect(diff).toBeLessThanOrEqual(TIME_PRECISION_MS);
      });
    });
  });

  describe("hoursLater", () => {
    test("adds positive hours correctly", () => {
      const date = new Date("2020-01-01T00:00:00Z");
      const later = hoursLater(date, 2);
      expect(later).toEqual(new Date("2020-01-01T02:00:00Z"));
    });

    test("subtracts negative hours correctly", () => {
      const date = new Date("2020-01-01T00:00:00Z");
      const earlier = hoursLater(date, -2);
      expect(earlier).toEqual(new Date("2019-12-31T22:00:00Z"));
    });
  });

  describe("toDays", () => {
    test("returns 0 for J2000", () => {
      expect(toDays(J2000)).toBe(0);
    });

    test("computes days since J2000 correctly", () => {
      expect(toDays(J2000 + 1)).toBe(1);
      expect(toDays(J2000 - 1)).toBe(-1);
    });
  });
});

/**
 * Geographic Coordinate Conversions
 */
describe("Geographic Coordinate Conversions", () => {
  describe("longitudeToRadWest", () => {
    test("converts 0° to 0 radians", () => {
      expect(longitudeToRadWest(0)).toBe(0);
    });

    test("converts 90°E to -90° in radians", () => {
      expect(longitudeToRadWest(90)).toBeCloseTo(
        -90 * DEGREE_IN_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts -90°W to 90° in radians", () => {
      expect(longitudeToRadWest(-90)).toBeCloseTo(
        90 * DEGREE_IN_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts 180°E to -180° in radians", () => {
      expect(longitudeToRadWest(180)).toBeCloseTo(
        -180 * DEGREE_IN_RADIANS,
        ANGLE_PRECISION,
      );
    });
  });

  describe("latitudeToRad", () => {
    test("converts 0° to 0 radians", () => {
      expect(latitudeToRad(0)).toBe(0);
    });

    test("converts 45° to 45° in radians", () => {
      expect(latitudeToRad(45)).toBeCloseTo(
        45 * DEGREE_IN_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts -45° to -45° in radians", () => {
      expect(latitudeToRad(-45)).toBeCloseTo(
        -45 * DEGREE_IN_RADIANS,
        ANGLE_PRECISION,
      );
    });
  });
});

/**
 * Celestial Position Calculations
 */
describe("Celestial Position Calculations", () => {
  describe("siderealTime", () => {
    test("at J2000 for Greenwich (lw=0)", () => {
      const d = 0;
      const lw = 0;
      const expected = 280.16 * DEGREE_IN_RADIANS;
      expect(siderealTime(d, lw)).toBeCloseTo(expected, ANGLE_PRECISION);
    });

    test("one day after J2000", () => {
      const d = 1;
      const lw = 0;
      const expected = ((280.16 + 360.9856235) * DEGREE_IN_RADIANS) % (2 * PI);
      expect(siderealTime(d, lw)).toBeCloseTo(expected, ANGLE_PRECISION);
    });
  });

  describe("altitude", () => {
    test("when H=0, phi=dec, altitude=90°", () => {
      const H = 0;
      const phi = 45 * DEGREE_IN_RADIANS;
      const dec = phi;
      expect(altitude(H, phi, dec)).toBeCloseTo(PI / 2, ANGLE_PRECISION);
    });

    test("when H=π, phi=0, dec=0, altitude=0°", () => {
      const H = PI;
      const phi = 0;
      const dec = 0;
      expect(altitude(H, phi, dec)).toBeCloseTo(0, ANGLE_PRECISION);
    });
  });

  describe("azimuth", () => {
    test("when H=0, dec>phi, azimuth=0°", () => {
      const H = 0;
      const phi = 0;
      const dec = 10 * DEGREE_IN_RADIANS;
      expect(azimuth(H, phi, dec)).toBeCloseTo(0, ANGLE_PRECISION);
    });

    test("when H=0, dec<phi, azimuth=180°", () => {
      const H = 0;
      const phi = 10 * DEGREE_IN_RADIANS;
      const dec = 0;
      expect(azimuth(H, phi, dec)).toBeCloseTo(PI, ANGLE_PRECISION);
    });
  });

  // Note: `calculateCelestialPosition` requires mocking `coordFn` and is omitted here for brevity.
  // A proper test would involve setting up a mock coordinate function with known RA/Dec values.
});

/**
 * Atmospheric Refraction
 */
describe("Atmospheric Refraction", () => {
  describe("astroRefraction", () => {
    test("at horizon (h=0)", () => {
      const h = 0;
      const expected = 0.83 * DEGREE_IN_RADIANS; // Approximate refraction at horizon
      expect(astroRefraction(h)).toBeCloseTo(expected, 2);
    });

    test("at high altitude (h=45°)", () => {
      const h = 45 * DEGREE_IN_RADIANS;
      expect(astroRefraction(h)).toBeCloseTo(0, 2); // Refraction negligible at high altitude
    });

    test("below horizon clamps to minimum altitude", () => {
      const h = -1 * DEGREE_IN_RADIANS; // Below -0.83° threshold
      const expected = astroRefraction(-0.83 * DEGREE_IN_RADIANS);
      expect(astroRefraction(h)).toBeCloseTo(expected, 2);
    });
  });
});

/**
 * Astronomical Event Detection
 */
describe("Astronomical Event Detection", () => {
  describe("findAltitudeCrossingEvents", () => {
    test("finds rise and set times with sinusoidal altitude", () => {
      const start = 2451545.0; // J2000
      const end = start + 1;
      const threshold = 0;
      const evaluator = (jd: number) => Math.sin(2 * PI * (jd - start));
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.rise).toBeCloseTo(start + 0.25, JD_PRECISION);
      expect(result.set).toBeCloseTo(start + 0.75, JD_PRECISION);
    });

    test("detects alwaysUp when altitude always above threshold", () => {
      const start = 2451545.0;
      const end = start + 1;
      const threshold = -1;
      const evaluator = (jd: number) => 1; // Always above
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.alwaysUp).toBe(true);
      expect(result.rise).toBeUndefined();
      expect(result.set).toBeUndefined();
    });

    test("detects alwaysDown when altitude always below threshold", () => {
      const start = 2451545.0;
      const end = start + 1;
      const threshold = 1;
      const evaluator = (jd: number) => 0; // Always below
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.alwaysDown).toBe(true);
      expect(result.rise).toBeUndefined();
      expect(result.set).toBeUndefined();
    });
  });
});

/**
 * Numerical Root-Finding Methods
 */
describe("Numerical Root-Finding Methods", () => {
  describe("computeDerivative", () => {
    test("derivative of t^2 is 2t", () => {
      const fn = (t: number) => t * t;
      const t = 2;
      const expected = 4;
      expect(computeDerivative(fn, t)).toBeCloseTo(expected, 3);
    });

    test("derivative of constant is 0", () => {
      const fn = (t: number) => 5;
      const t = 2;
      expect(computeDerivative(fn, t)).toBe(0);
    });
  });

  describe("refineEvent", () => {
    test("finds root of t - 5 = 0", () => {
      const evaluator = (t: number) => t - 5;
      const target = 0;
      const seed = 0;
      const result = refineEvent(seed, evaluator, target);
      expect(result).toBeCloseTo(5, JD_PRECISION);
    });

    test("converges for quadratic function", () => {
      const evaluator = (t: number) => t * t - 4; // Roots at ±2
      const target = 0;
      const seed = 1;
      const result = refineEvent(seed, evaluator, target);
      expect(result).toBeCloseTo(2, JD_PRECISION);
    });
  });
});

/**
 * Solar-Specific Calculations
 */
describe("Solar-Specific Calculations", () => {
  describe("solarDeclinationRate", () => {
    test("computes rate for linear declination", () => {
      const sunCoordsDecFn = (t: number) => 0.1 * t; // 0.1 rad/day
      const t = 2;
      const rate = solarDeclinationRate(sunCoordsDecFn, t);
      expect(rate).toBeCloseTo(0.1, 3);
    });
  });
});

/**
 * Event Seed Generation
 */
describe("Event Seed Generation", () => {
  describe("generateEventSeeds", () => {
    test("generates seeds within window", () => {
      const startJD = 2451545.0;
      const endJD = startJD + 10;
      const referenceJD = startJD + 5;
      const eventIntervalDays = 1;
      const convergenceWindowDays = 0.5;
      const seeds = generateEventSeeds(
        startJD,
        endJD,
        referenceJD,
        eventIntervalDays,
        convergenceWindowDays,
      );
      expect(seeds).toHaveLength(11); // From start-0.5 to end+0.5 with step 1
      expect(seeds[0]).toBeCloseTo(startJD - 0.5, JD_PRECISION);
      expect(seeds[seeds.length - 1]).toBeCloseTo(endJD + 0.5, JD_PRECISION);
    });
  });
});

/**
 * Data Management Utilities
 */
describe("Data Management Utilities", () => {
  describe("addUniqueJD", () => {
    test("adds unique JDs within tolerance", () => {
      const jds: number[] = [];
      addUniqueJD(jds, 2450000.0);
      addUniqueJD(jds, 2450000.0001); // Within default eps (~1.44 min)
      addUniqueJD(jds, 2450001.0);
      expect(jds).toHaveLength(2);
      expect(jds[0]).toBe(2450000.0);
      expect(jds[1]).toBe(2450001.0);
    });

    test("adds all JDs with larger eps", () => {
      const jds: number[] = [];
      const eps = 0.001; // Larger tolerance
      addUniqueJD(jds, 2450000.0, eps);
      addUniqueJD(jds, 2450000.0001, eps);
      addUniqueJD(jds, 2450001.0, eps);
      expect(jds).toHaveLength(3);
    });
  });
});
