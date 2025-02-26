/**
 * constants.test.ts
 *
 * Audit tests for astronomical constants module.
 * Validates values against their definitions and ensures internal consistency.
 *
 * @see {@link ../src/constants.ts}
 */

import {
  acos,
  asin,
  atan2,
  CONVERGENCE_TOLERANCE,
  CONVERGENCE_WINDOW,
  cos,
  DAY_IN_MS,
  DEFAULT_WINDOW_SIZE_DAYS,
  DEGREE_IN_RADIANS,
  DERIVATIVE_DELTA_DAYS,
  EARTH_OBLIQUITY_J2000,
  EARTH_PERIHELION,
  EQUATION_OF_CENTER_COEFFS,
  HOUR_IN_MS,
  J0,
  J1970,
  J2000,
  NUMERICAL_STABILITY_EPS,
  PI,
  REFERENCE_EQUINOX_JD,
  REFERENCE_SUMMER_JD,
  REFRACTION_OPTIONS,
  SIDEREAL_TIME_PARAMS,
  sin,
  SOLAR_ALTITUDE,
  SOLAR_ANOMALY,
  SOLAR_TRANSIT_COEFFS,
  tan,
  TIME_EQUALITY_EPS,
  TROPICAL_YEAR,
} from "../src/constants";

// Precision thresholds for floating-point comparisons
const JD_PRECISION = 1e-7; // ≈0.1 seconds in fractional day
const ANGLE_PRECISION = 1e-7; // ≈0.002 arcseconds in radians
const TIME_PRECISION = 1e-6; // ≈0.0864 seconds in days

/** ======================== Mathematical Constants ======================== */

describe("Mathematical Constants", () => {
  test("PI matches Math.PI", () => {
    expect(PI).toBe(Math.PI);
  });

  test("DEGREE_IN_RADIANS equals π / 180", () => {
    expect(DEGREE_IN_RADIANS).toBeCloseTo(Math.PI / 180, 10);
  });

  test("Trigonometric functions reference Math functions", () => {
    expect(sin).toBe(Math.sin);
    expect(cos).toBe(Math.cos);
    expect(tan).toBe(Math.tan);
    expect(asin).toBe(Math.asin);
    expect(acos).toBe(Math.acos);
    expect(atan2).toBe(Math.atan2);
  });
});

/** ================= Temporal Constants and Epoch Definitions ============== */

describe("Temporal Constants", () => {
  test("DAY_IN_MS equals 86,400,000 milliseconds", () => {
    expect(DAY_IN_MS).toBe(24 * 60 * 60 * 1000);
  });

  test("HOUR_IN_MS equals 3,600,000 milliseconds", () => {
    expect(HOUR_IN_MS).toBe(60 * 60 * 1000);
  });

  test("J1970 equals 2440588.0", () => {
    expect(J1970).toBe(2440588.0);
  });

  test("J2000 equals 2451545.0", () => {
    expect(J2000).toBe(2451545.0);
  });
});

/** ============== Earth's Orbital and Axial Characteristics ================ */

describe("Earth Constants", () => {
  test("EARTH_OBLIQUITY_J2000 matches 23.4397° in radians", () => {
    const expected = 23.4397 * DEGREE_IN_RADIANS;
    expect(EARTH_OBLIQUITY_J2000).toBeCloseTo(expected, 10);
    // Note: JPL value is approximately 23.439291111°
  });

  test("EARTH_PERIHELION equals 102.9372°", () => {
    expect(EARTH_PERIHELION).toBe(102.9372);
  });
});

/** ======================== Solar Orbital Parameters ======================= */

describe("Solar Orbital Parameters", () => {
  test("TROPICAL_YEAR equals 365.2422 days", () => {
    expect(TROPICAL_YEAR).toBe(365.2422);
    // Note: JPL value is approximately 365.242190402 days
  });

  test("EQUATION_OF_CENTER_COEFFS matches [1.9148, 0.02, 0.0003]", () => {
    expect(EQUATION_OF_CENTER_COEFFS).toEqual([1.9148, 0.02, 0.0003]);
  });

  test("SOLAR_ANOMALY has OFFSET 357.5291° and DAILY_RATE 0.98560028°/day", () => {
    expect(SOLAR_ANOMALY.OFFSET).toBe(357.5291);
    expect(SOLAR_ANOMALY.DAILY_RATE).toBe(0.98560028);
  });
});

/** =================== Solar Event Calculation Parameters ================== */

describe("Solar Event Parameters", () => {
  test("J0 equals 0.0009 days", () => {
    expect(J0).toBe(0.0009);
  });

  test("SOLAR_TRANSIT_COEFFS has M_COEFF 0.0053 and L_COEFF -0.0069", () => {
    expect(SOLAR_TRANSIT_COEFFS.M_COEFF).toBe(0.0053);
    expect(SOLAR_TRANSIT_COEFFS.L_COEFF).toBe(-0.0069);
  });
});

/** ================= Iterative Calculation Parameters ===================== */

describe("Iterative Calculation Parameters", () => {
  test("CONVERGENCE_WINDOW equals 91 days", () => {
    expect(CONVERGENCE_WINDOW).toBe(91);
  });

  test("CONVERGENCE_WINDOW approximates TROPICAL_YEAR / 4", () => {
    const quarterYear = TROPICAL_YEAR / 4; // ≈91.31055 days
    expect(CONVERGENCE_WINDOW).toBeCloseTo(quarterYear, 0); // Integer days
  });

  test("DERIVATIVE_DELTA_DAYS equals 0.001 days", () => {
    expect(DERIVATIVE_DELTA_DAYS).toBe(0.001);
  });

  test("CONVERGENCE_TOLERANCE equals 1e-8 days", () => {
    expect(CONVERGENCE_TOLERANCE).toBe(1e-8);
  });

  test("TIME_EQUALITY_EPS equals 0.001 days", () => {
    expect(TIME_EQUALITY_EPS).toBe(0.001);
  });
});

/** ============ Atmospheric Refraction and Solar Position ================ */

describe("Solar Altitude Thresholds", () => {
  test("SOLAR_ALTITUDE.HORIZON equals -0.833°", () => {
    expect(SOLAR_ALTITUDE.HORIZON).toBe(-0.833);
  });

  test("SOLAR_ALTITUDE.GOLDEN_HOUR equals 6°", () => {
    expect(SOLAR_ALTITUDE.GOLDEN_HOUR).toBe(6);
  });

  test("SOLAR_ALTITUDE.CIVIL_TWILIGHT equals -6°", () => {
    expect(SOLAR_ALTITUDE.CIVIL_TWILIGHT).toBe(-6);
  });
});

describe("Atmospheric Refraction Parameters", () => {
  test("REFRACTION_OPTIONS.MIN_ALT_RAD equals -0.83° in radians", () => {
    expect(REFRACTION_OPTIONS.MIN_ALT_RAD).toBeCloseTo(
      -0.83 * DEGREE_IN_RADIANS,
      10,
    );
  });

  test("REFRACTION_OPTIONS.COEFF_DEG equals 0.017°", () => {
    expect(REFRACTION_OPTIONS.COEFF_DEG).toBe(0.017);
  });

  test("REFRACTION_OPTIONS.OFFSET_DEG equals 10.3°", () => {
    expect(REFRACTION_OPTIONS.OFFSET_DEG).toBe(10.3);
  });

  test("REFRACTION_OPTIONS.DENOM_ADD_DEG equals 5.11°", () => {
    expect(REFRACTION_OPTIONS.DENOM_ADD_DEG).toBe(5.11);
  });
});

/** ===================== Reference Astronomical Events =================== */

describe("Reference Astronomical Events", () => {
  test("REFERENCE_EQUINOX_JD equals 2451630.306", () => {
    expect(REFERENCE_EQUINOX_JD).toBeCloseTo(2451630.306, JD_PRECISION);
  });

  test("REFERENCE_SUMMER_JD equals 2451701.825", () => {
    expect(REFERENCE_SUMMER_JD).toBeCloseTo(2451701.825, JD_PRECISION);
  });
});

/** ======================= Sidereal Time Parameters ====================== */

describe("Sidereal Time Parameters", () => {
  test("SIDEREAL_TIME_PARAMS.OFFSET_DEG equals 280.16°", () => {
    expect(SIDEREAL_TIME_PARAMS.OFFSET_DEG).toBe(280.16);
  });

  test("SIDEREAL_TIME_PARAMS.RATE_DEG_PER_DAY equals 360.9856235°/day", () => {
    expect(SIDEREAL_TIME_PARAMS.RATE_DEG_PER_DAY).toBe(360.9856235);
  });
});

/** ================== Numerical Stability Parameters ===================== */

describe("Numerical Stability Parameters", () => {
  test("NUMERICAL_STABILITY_EPS equals 1e-14 days", () => {
    expect(NUMERICAL_STABILITY_EPS).toBe(1e-14);
  });
});

/** ===================== Event Detection Parameters ====================== */

describe("Event Detection Parameters", () => {
  test("DEFAULT_WINDOW_SIZE_DAYS equals 2/24 days", () => {
    expect(DEFAULT_WINDOW_SIZE_DAYS).toBe(2 / 24);
  });
});

/** ===================== Date Conversion Consistency ===================== */

describe("Date Conversion Consistency", () => {
  const JulianConverter = {
    toJD: (date: Date): number => date.getTime() / DAY_IN_MS + 2440587.5,
  };

  const testCases = [
    { date: new Date("2000-01-01T12:00:00Z"), expected: 2451545.0 },
    { date: new Date("2010-01-01T00:00:00Z"), expected: 2455197.5 },
    { date: new Date("2020-01-01T00:00:00Z"), expected: 2458849.5 },
  ];

  testCases.forEach(({ date, expected }) => {
    test(`${date.toISOString()} converts to JD ${expected}`, () => {
      expect(JulianConverter.toJD(date)).toBeCloseTo(expected, JD_PRECISION);
    });
  });
});
