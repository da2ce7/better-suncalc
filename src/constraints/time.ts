/**
 * @file constraints/time.ts
 * @description Time-related constants, including epochs and ΔT polynomial segments.
 */

import { Days, Hours, JulianDay, Milliseconds, Seconds } from "./types";

/** ====================== Time Definitions and Epochs ====================== */

/**
 * Parameters for Julian date calculations and conversions.
 * @constant {Object}
 */
export const JULIAN_CONVERSION = {
  /**
   * Maximum iterations for UTC to Julian date conversion.
   * @constant {number}
   * @unit unitless
   * @description Iterations needed for ΔT convergence (typically ≤3 in practice).
   */
  MAX_ITERATIONS: 5, // Unitless (empirically determined)
};

/**
 * Number of days in a Julian century.
 * @constant {Days}
 * @unit days
 */
export const DAYS_PER_JULIAN_CENTURY: Days = 36525 as Days;

/**
 * Half a Day
 * @constant {Days}
 * @unit days
 */
export const HALF_DAY: Days = 0.5 as Days;

/**
 * Julian Day for the J1970 epoch (January 1, 1970, 00:00:00 UTC).
 * @constant {JulianDay}
 * @unit Julian Day
 */
export const JULIAN_EPOCH_J1970: JulianDay = 2440588.0 as JulianDay;

/**
 * Julian Day for the J2000 epoch (January 1, 2000, 12:00:00 TT).
 * @constant {JulianDay}
 * @unit Julian Day
 */
export const JULIAN_EPOCH_J2000: JulianDay = 2451545.0 as JulianDay;

/**
 * Time unit conversions.
 * @constant {Object}
 */
export const TIME_UNITS = {
  /**
   * Millisecond conversions.
   * @constant {Object}
   */
  MILLISECONDS: {
    /**
     * Milliseconds in an hour.
     * @constant {Milliseconds}
     * @unit milliseconds
     */
    HOUR: 3_600_000 as Milliseconds, // 1 hour = 3,600,000 milliseconds

    /**
     * Milliseconds in a day.
     * @constant {Milliseconds}
     * @unit milliseconds
     */
    DAY: 86_400_000 as Milliseconds, // 1 day = 86,400,000 milliseconds
  },

  /**
   * Second conversions.
   * @constant {Object}
   */
  SECONDS: {
    /**
     * Seconds in an hour.
     * @constant {Seconds}
     * @unit seconds
     */
    HOUR: 3600 as Seconds, // 1 hour = 3,600 seconds

    /**
     * Seconds in a day.
     * @constant {Seconds}
     * @unit seconds
     */
    DAY: 86400 as Seconds, // 1 day = 86,400 seconds
  },

  /**
   * Hour conversions.
   * @constant {Object}
   */
  HOURS: {
    /**
     * Hours in a day.
     * @constant {Hours}
     * @unit hours
     */
    DAY: 24 as Hours, // 1 day = 24 hours
  },
};
