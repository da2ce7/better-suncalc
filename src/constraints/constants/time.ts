/**
 * @file constraints/constants/time.ts
 * @description Time-related constants, including epochs and ΔT polynomial segments.
 */

import {
  HoursDuration,
  JulianDaysDuration,
  MillisecondsDuration,
  SecondsDuration,
  SecondsPerAstronomicalUnit,
  TerrestrialCenturiesSinceJ2000,
  TerrestrialDaysSinceJulianEpoch,
} from "../brands";

/** ====================== Time Definitions and Epochs ====================== */

/**
 * Parameters for Julian date calculations and conversions.
 * @constant {Object}
 */
export const JULIAN_CONVERSION = {
  /**
   * Maximum iterations for UTC to Julian date conversion.
   * @unitless
   */
  MAX_ITERATIONS: 5,
};

/**
 * Exact duration of a Julian century in fundamental SI seconds.
 * 100 Julian years = 31,557,600 × 100 seconds.
 * @constant {JulianCentury}
 * @see IAU Resolution B1 2000
 */
export const SECONDS_PER_JULIAN_CENTURY: SecondsDuration =
  3_155_760_000 as SecondsDuration;

/**
 * Half of Earth's fundamental rotation period (12 hours) in atomic TDB seconds.
 * @constant {SecondsDuration}
 */
export const HALF_SIDEREAL_DAY: SecondsDuration = 43_082 as SecondsDuration;

/**
 * Epoch anchoring constants in JPL Solar System barycentric time (TDB)
 */
export const TDB_EPOCHS = {
  /**
   * Unix epoch (1970-01-01T00:00:00 TDB) in Julian days.
   * @constant {TerrestrialDaysSinceJulianEpoch}
   */
  UNIX: 2440587.5 as TerrestrialDaysSinceJulianEpoch,

  /**
   * J2000 epoch (2000-01-01T12:00:00 TDB) in Julian days.
   * @constant {TerrestrialDaysSinceJulianEpoch}
   */
  J2000: 2451545.0 as TerrestrialDaysSinceJulianEpoch,
};

/** ====================== Unit Conversion Factors ====================== */

/**
 * Fundamental time unit relationships according to
 * International System of Quantities (ISQ) standards.
 * @constant {Object}
 */
export const TIME_UNITS = {
  /** Light-travel time constants (vacuum) */
  RELATIVITY: {
    /** Seconds per astronomical unit (AU/c) */
    SECOND_PER_AU: 499.004_783_806 as SecondsPerAstronomicalUnit,
  },

  /** SI unit relationships */
  SI_DERIVATIVES: {
    /** @constant {MillisecondsDuration} Terrestrial hour duration */
    HOUR_IN_MILLISECONDS: 3_600_000 as MillisecondsDuration,
    /** @constant {SecondsDuration} Terrestrial day duration */
    DAY_IN_SECONDS: 86_400 as SecondsDuration,
    /** @constant {Hours} Days→hours conversion factor */
    DAY_IN_HOURS: 24 as HoursDuration,
  },

  /** Julian unit relationships */
  JULIAN: {
    /** @constant {JulianDaysDuration} Days per Julian year (fixed) */
    DAYS_PER_YEAR: 365.25 as JulianDaysDuration,
    /** @constant {JulianDaysDuration} Fundamental unit of ephemeris datekeeping */
    DAYS_PER_CENTURY: 36_525 as JulianDaysDuration,
  },
};

/** ====================== Time Scale Offsets ====================== */

/**
 * ΔT (Terrestrial Time - Universal Time) polynomial fitting segments.
 * Modern intervals use weighted least-squares fits based on IERS data.
 * @constant {Array<[t: TerrestrialCenturiesSinceJ2000, coefficients: number[]]>}
 */
export const DELTA_T_POLYNOMIALS = [
  [
    -5.0 as TerrestrialCenturiesSinceJ2000,
    [1623.2, -247.53, 27.98], // 1800-1893 quadratic fit
  ],
  [
    0.0 as TerrestrialCenturiesSinceJ2000,
    [64.3, 95.8, 31.5, 2.8], // 1990-2024 cubic term
  ],
];
