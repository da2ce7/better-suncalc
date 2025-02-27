/**
 * utils.test.ts
 *
 * @see {@link ../src/utils.ts}
 */

import {
  DEGREES_TO_RADIANS,
  JULIAN_EPOCH_J2000,
  PI,
} from "../src/constraints/constants";
import {
  addUniqueJD,
  altitude,
  astroRefraction,
  azimuth,
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
        new Date(-1000, 0, 1), // Year -1000 (1001 BCE), January 1
        new Date(0, 0, 1), // Year 0, January 1
        new Date(1600, 0, 1), // Year 1600, January 1
        new Date(2000, 0, 1), // Year 2000, January 1
        new Date(2100, 0, 1), // Year 2100, January 1
      ];
      dates.forEach((date) => {
        expect(typeof deltaT(date)).toBe("number");
        expect(deltaT(date)).toBeGreaterThan(-10000);
        expect(deltaT(date)).toBeLessThan(100000);
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
      expect(toDays(JULIAN_EPOCH_J2000)).toBe(0);
    });

    test("computes days since J2000 correctly", () => {
      expect(toDays(JULIAN_EPOCH_J2000 + 1)).toBe(1);
      expect(toDays(JULIAN_EPOCH_J2000 - 1)).toBe(-1);
    });
  });
});

/**
 * Geographic Coordinate Conversions
 */
describe("Geographic Coordinate Conversions", () => {
  describe("longitudeToRadWest", () => {
    test("converts 0° to 0 radians", () => {
      expect(longitudeToRadWest(0)).toBeCloseTo(0, 10);
    });

    test("converts 90°E to -90° in radians", () => {
      expect(longitudeToRadWest(90)).toBeCloseTo(
        -90 * DEGREES_TO_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts -90°W to 90° in radians", () => {
      expect(longitudeToRadWest(-90)).toBeCloseTo(
        90 * DEGREES_TO_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts 180°E to -180° in radians", () => {
      expect(longitudeToRadWest(180)).toBeCloseTo(
        -180 * DEGREES_TO_RADIANS,
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
        45 * DEGREES_TO_RADIANS,
        ANGLE_PRECISION,
      );
    });

    test("converts -45° to -45° in radians", () => {
      expect(latitudeToRad(-45)).toBeCloseTo(
        -45 * DEGREES_TO_RADIANS,
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
      const expected = 280.16 * DEGREES_TO_RADIANS;
      expect(siderealTime(d, lw)).toBeCloseTo(expected, ANGLE_PRECISION);
    });

    test("one day after J2000", () => {
      const d = 1;
      const lw = 0;
      const expected = ((280.16 + 360.9856235) * DEGREES_TO_RADIANS) % TAU;
      expect(siderealTime(d, lw)).toBeCloseTo(expected, ANGLE_PRECISION);
    });
  });

  describe("altitude", () => {
    test("when H=0, phi=dec, altitude=90°", () => {
      const H = 0;
      const phi = 45 * DEGREES_TO_RADIANS;
      const dec = phi;
      expect(altitude(H, phi, dec)).toBeCloseTo(PI / 2, ANGLE_PRECISION);
    });

    test("when H=π, phi=0, dec=0, altitude=-90°", () => {
      const H = PI;
      const phi = 0;
      const dec = 0;
      expect(altitude(H, phi, dec)).toBeCloseTo(-PI / 2, ANGLE_PRECISION);
    });
  });

  describe("azimuth", () => {
    test("when H=0, dec>phi, azimuth=180°", () => {
      const H = 0;
      const phi = 0;
      const dec = 10 * DEGREES_TO_RADIANS;
      expect(azimuth(H, phi, dec)).toBeCloseTo(PI, ANGLE_PRECISION);
    });

    test("when H=0, dec<phi, azimuth=0°", () => {
      const H = 0;
      const phi = 10 * DEGREES_TO_RADIANS;
      const dec = 0;
      expect(azimuth(H, phi, dec)).toBeCloseTo(0, ANGLE_PRECISION);
    });
  });
});

/**
 * Atmospheric Refraction
 */
describe("Atmospheric Refraction", () => {
  describe("astroRefraction", () => {
    test("at horizon (h=0)", () => {
      const h = 0;
      const expected = 0.0084305; // Computed value from Saemundsson's formula
      expect(astroRefraction(h)).toBeCloseTo(expected, 2);
    });

    test("at high altitude (h=45°)", () => {
      const h = 45 * DEGREES_TO_RADIANS;
      expect(astroRefraction(h)).toBeCloseTo(0, 2);
    });

    test("below horizon clamps to minimum altitude", () => {
      const h = -1 * DEGREES_TO_RADIANS;
      const expected = astroRefraction(-0.83 * DEGREES_TO_RADIANS);
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
      const start = 2451545.0;
      const end = start + 1;
      const threshold = 0;
      const evaluator = (jd: number) => -Math.cos(TAU * (jd - start));
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.rise).toBeCloseTo(start + 0.25, JD_PRECISION);
      expect(result.set).toBeCloseTo(start + 0.75, JD_PRECISION);
    });

    test("detects alwaysUp when altitude always above threshold", () => {
      const start = 2451545.0;
      const end = start + 1;
      const threshold = -1;
      const evaluator = (jd: number) => 1;
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.alwaysUp).toBe(true);
    });

    test("detects alwaysDown when altitude always below threshold", () => {
      const start = 2451545.0;
      const end = start + 1;
      const threshold = 1;
      const evaluator = (jd: number) => 0;
      const config = { start, end, evaluator, threshold };
      const result = findAltitudeCrossingEvents(config);
      expect(result.alwaysDown).toBe(true);
    });
  });
});

/**
 * Numerical Root-Finding Methods
 */
describe("Numerical Root-Finding Methods", () => {
  describe("refineEvent", () => {
    test("finds root of t - 5 = 0", () => {
      const evaluator = (t: number) => t - 5;
      const target = 0;
      const seed = 4;
      const result = refineEvent(seed, evaluator, target);
      expect(result).toBeCloseTo(5, JD_PRECISION);
    });

    test("converges for quadratic function", () => {
      const evaluator = (t: number) => t * t - 4;
      const target = 0;
      const seed = 1.5;
      const result = refineEvent(seed, evaluator, target);
      expect(result).toBeCloseTo(2, JD_PRECISION);
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
      expect(seeds).toHaveLength(11);
      expect(seeds[0]).toBeCloseTo(startJD, JD_PRECISION);
      expect(seeds[seeds.length - 1]).toBeCloseTo(endJD, JD_PRECISION);
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
      addUniqueJD(jds, 2450000.0001);
      addUniqueJD(jds, 2450001.0);
      expect(jds).toHaveLength(2);
    });

    test("adds all JDs with smaller eps", () => {
      const jds: number[] = [];
      const eps = 0.00001;
      addUniqueJD(jds, 2450000.0, eps);
      addUniqueJD(jds, 2450000.0001, eps);
      addUniqueJD(jds, 2450001.0, eps);
      expect(jds).toHaveLength(3);
    });
  });
});
