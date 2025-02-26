/**
 * Audit tests for astronomical constants module.
 * Validates values against authoritative references and internal consistency.
 *
 * @see {@link https://ssd.jpl.nasa.gov/horizons/ JPL Horizons System}
 */
import {
  acos,
  asin,
  atan2,
  CONVERGENCE_WINDOW,
  cos,
  DAY_IN_MS,
  DEGREE_IN_RADIANS,
  EARTH_OBLIQUITY_J2000,
  J1970,
  J2000,
  PI,
  REFERENCE_EQUINOX_JD,
  REFERENCE_SUMMER_JD,
  REFRACTION_OPTIONS,
  sin,
  tan,
  TROPICAL_YEAR,
} from "../src/constants";

// Reference values from NASA/JPL Horizon System
const JPL_EARTH_OBLIQUITY_2000 = 23.439291111; // Degrees
const JPL_TROPICAL_YEAR_2000 = 365.242190402; // Days
const REFRACTION_SAEMUNDSSON = {
  coefficient: 0.0347, // Degrees
  horizonOffset: 0.83, // Degrees
};

// Test precision thresholds
const JD_PRECISION = 1e-7; // ≈0.1 seconds in fractional day
const ANGLE_PRECISION = 1e-7; // ≈0.002 arcseconds
const TIME_PRECISION = 1e-6; // ≈0.1 seconds

describe("Mathematical Constants", () => {
  test("PI matches Math.PI", () => {
    expect(PI).toBe(Math.PI);
  });

  test("Degree-to-radian conversion factor", () => {
    expect(DEGREE_IN_RADIANS).toBeCloseTo(Math.PI / 180, 10);
  });

  test("Trigonometric function references", () => {
    expect(sin).toBe(Math.sin);
    expect(cos).toBe(Math.cos);
    expect(tan).toBe(Math.tan);
    expect(asin).toBe(Math.asin);
    expect(acos).toBe(Math.acos);
    expect(atan2).toBe(Math.atan2);
  });
});

describe("Time Constants", () => {
  test("DAY_IN_MS (milliseconds per day)", () => {
    expect(DAY_IN_MS).toBe(24 * 60 * 60 * 1000);
  });

  test("J1970 (Unix epoch Julian day)", () => {
    // 1970-01-01T00:00:00Z = JD 2440587.5 + 0.5 offset
    expect(J1970).toBeCloseTo(2440588.0, JD_PRECISION);
  });

  test("J2000 epoch validation", () => {
    expect(J2000).toBe(2451545.0);
  });
});

describe("Earth Constants", () => {
  test("Mean axial tilt (J2000)", () => {
    const expected = JPL_EARTH_OBLIQUITY_2000 * DEGREE_IN_RADIANS;
    expect(EARTH_OBLIQUITY_J2000).toBeCloseTo(expected, 6);
  });
});

describe("Solar Constants", () => {
  test("Tropical year duration", () => {
    expect(TROPICAL_YEAR).toBeCloseTo(JPL_TROPICAL_YEAR_2000, 4);
  });

  test("Convergence window season alignment", () => {
    const expectedQuarterYear = TROPICAL_YEAR / 4;
    expect(CONVERGENCE_WINDOW).toBeCloseTo(expectedQuarterYear, 0);
  });
});

describe("Reference Astronomical Events", () => {
  test("2000 vernal equinox reference", () => {
    expect(REFERENCE_EQUINOX_JD).toBeCloseTo(2451630.306, JD_PRECISION);
  });

  test("2000 summer solstice reference", () => {
    expect(REFERENCE_SUMMER_JD).toBeCloseTo(2451701.825, JD_PRECISION);
  });
});

describe("Atmospheric Refraction Model", () => {
  test("Minimum altitude boundary matches Saemundsson", () => {
    const expected = -REFRACTION_SAEMUNDSSON.horizonOffset * DEGREE_IN_RADIANS;
    expect(REFRACTION_OPTIONS.MIN_ALT).toBeCloseTo(expected, ANGLE_PRECISION);
  });

  test("Refraction coefficient accuracy", () => {
    const expected = REFRACTION_SAEMUNDSSON.coefficient * DEGREE_IN_RADIANS;
    expect(REFRACTION_OPTIONS.COEFF).toBeCloseTo(expected, 6);
  });

  test("Empirical parameter validation", () => {
    expect(REFRACTION_OPTIONS.OFFSET).toBeCloseTo(5.16, 2);
    expect(REFRACTION_OPTIONS.DENOM_ADD).toBeCloseTo(4.32, 2);
  });
});

describe("Date Conversion Consistency", () => {
  const JulianConverter = {
    toJD: (date: Date): number => date.getTime() / DAY_IN_MS + 2440587.5,
  };

  const epochTestCases = [
    { date: new Date("2000-01-01T12:00:00Z"), expected: 2451545.0 },
    { date: new Date("2010-01-01T00:00:00Z"), expected: 2455197.5 },
    { date: new Date("2020-01-01T00:00:00Z"), expected: 2458850.5 },
  ];

  epochTestCases.forEach(({ date, expected }) => {
    test(`${date.toISOString()} converts correctly`, () => {
      expect(JulianConverter.toJD(date)).toBeCloseTo(expected, JD_PRECISION);
    });
  });
});
