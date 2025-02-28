/**
 * @file constraints/constants/time.ts
 * @description Time-related constants, including epochs and ΔT polynomial segments.
 */

import {
  Hours,
  JulianDateTT,
  Milliseconds,
  Seconds,
  TerrestrialDays,
} from "../brands";

/** ====================== Time Definitions and Epochs ====================== */

/**
 * Parameters for Julian date calculations and conversions.
 * @constant {Object}
 */
export const JULIAN_CONVERSION = {
  /**
   * Maximum iterations for UTC to Julian date conversion.
   * @constant {number}
   * @unitless
   * @description ΔT convergence typically requires ≤3 iterations in practice.
   */
  MAX_ITERATIONS: 5,
};

/**
 * Number of terrestrial days in a Julian century (IAU definition).
 * @constant {TerrestrialDays}
 * @unit terrestrial days
 * @see {@link https://www.iau.org/publications/proceedings_rules/units/|IAU Unit Standards}
 */
export const DAYS_PER_JULIAN_CENTURY: TerrestrialDays =
  36525 as TerrestrialDays;

/**
 * Half an Earth solar day (local apparent time basis).
 * @constant {TerrestrialDays}
 * @unit terrestrial days
 */
export const HALF_DAY: TerrestrialDays = 0.5 as TerrestrialDays;

/**
 * Julian Date for J1970 epoch (January 1, 1970 00:00:00 UTC).
 * @constant {JulianDateTT}
 * @unit Julian Date (TT scale)
 */
export const JULIAN_EPOCH_J1970: JulianDateTT = 2440588.0 as JulianDateTT;

/**
 * Julian Date for J2000 epoch (January 1, 2000 12:00:00 TT).
 * @constant {JulianDateTT}
 * @unit Julian Date (TT scale)
 * @see {@link https://science.nasa.gov/astrophysics/focus-areas/time/|NASA Timekeeping}
 */
export const JULIAN_EPOCH_J2000: JulianDateTT = 2451545.0 as JulianDateTT;

/**
 * Comprehensive time unit conversions.
 * @constant {Object}
 */
export const TIME_UNITS = {
  /** Relative time scaling factors */
  DYNAMIC_SCALES: {
    /**
     * Light-travel time conversion (terrestrial seconds ~ absolute distance).
     * @constant {Number}
     * @unit seconds · METERS_PER_AU⁻¹
     */
    SPACETIME_FACTOR: 499.004783806 as number,
  },

  /** Millisecond-based durations */
  MILLISECONDS: {
    /** @constant {Milliseconds} Terrestrial hour duration */
    HOUR: 3_600_000 as Milliseconds,
    /** @constant {Milliseconds} Terrestrial day duration */
    DAY: 86_400_000 as Milliseconds,
  },

  /** Second-based durations */
  SECONDS: {
    /** @constant {Seconds} Terrestrial hour duration */
    HOUR: 3600 as Seconds,
    /** @constant {Seconds} Terrestrial day duration */
    DAY: 86400 as Seconds,
  },

  /** Hour-based durations */
  HOURS: {
    /** @constant {Hours} Terrestrial day duration */
    DAY: 24 as Hours,
  },

  /** Day-based durations */
  DAYS: {
    /** @constant {TerrestrialDays} Julian century duration (definition) */
    CENTURY: 36525 as TerrestrialDays,
  },
};
