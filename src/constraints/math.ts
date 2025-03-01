/**
 * @file constraints/math.ts
 * @description Mathematical constants and parameters for numerical stability and event detection.
 */

import { Degrees, JulianDay } from "./brands";

/** =================== Mathematical Constants and Conversions =================== */

/**
 * π (pi) - The ratio of a circle's circumference to its diameter.
 * @constant {number}
 */
export const PI = Math.PI;

/**
 * τ (tau) - The ratio of a circle's circumference to its radius.
 * @constant {number}
 */
export const TAU = 2 * PI;

/**
 * Full circle in degrees.
 * @constant {Degrees}
 */
export const FULL_CIRCLE_DEGREES: Degrees = 360 as Degrees;

/**
 * Conversion factor from AstronomicalUnits to kilometers (IAU 2012 definition)
 * @constant {number}
 * @example
 * const auToKm = (2.5 as AstronomicalUnits) * AU_TO_KM; // → 373,994,676.75 km
 */
export const AU_TO_KM = 149_597_870.7;

/** =========== Numerical Stability and Calculation Parameters =========== */

/**
 * Numerical parameters for stability and precision in calculations
 * @constant {Object}
 */
export const NUMERICAL = {
  /**
   * Epsilon values for numerical comparisons
   * @constant {Object}
   */
  EPSILON: {
    /**
     * Floating point precision for time calculations
     * @constant {JulianDay}
     * @description Approximately 69µs tolerance (~1e-14 days)
     */
    FLOATING_POINT_DAYS: 1e-14 as JulianDay,

    /**
     * Threshold for considering two event times equal
     * @constant {JulianDay}
     * @description Approximately 1.44 minute threshold (~0.001 days)
     */
    EVENT_TIME_EQUALITY_DAYS: 0.001 as JulianDay,
  },

  /**
   * Parameters for iterative calculations
   * @constant {Object}
   */
  ITERATION: {
    /** Maximum number of iterations for convergence */
    MAX: 15,

    /**
     * Convergence threshold for iterative methods
     * @constant {JulianDay}
     * @description Approximately 0.00086 seconds (~1e-8 days)
     */
    CONVERGENCE_THRESHOLD: 1e-8 as JulianDay,

    /** Safety margin for iterative searches */
    SAFETY_MARGIN_DAYS: 10 as JulianDay,
  },

  /**
   * Parameters for numerical calculations
   * @constant {Object}
   */
  CALCULATION: {
    /**
     * Step size for numerical derivatives
     * @constant {JulianDay}
     * @description Approximately 1.44 minute step (~0.001 days)
     */
    DERIVATIVE_STEP_DAYS: 0.001 as JulianDay,
  },
};

/** ====================== Event Detection Parameters ====================== */

/**
 * Thresholds for detecting various astronomical events
 * @constant {Object}
 */
export const EVENT_THRESHOLDS = {
  /**
   * Solar altitude thresholds for different events
   * @constant {Object}
   */
  SOLAR_ALTITUDE_DEG: {
    /** Classic horizon threshold (including atmospheric refraction) */
    CLASSIC_HORIZON: -0.833 as Degrees,

    /** Golden hour threshold */
    GOLDEN_HOUR: 6 as Degrees,

    /** Civil twilight threshold */
    CIVIL_TWILIGHT: -6 as Degrees,

    /** Nautical twilight threshold */
    NAUTICAL_TWILIGHT: -12 as Degrees,

    /** Astronomical twilight threshold */
    ASTRONOMICAL_TWILIGHT: -18 as Degrees,
  },

  /** Lunar altitude threshold for visibility determination */
  LUNAR_ALTITUDE_DEG: 0.625 as Degrees,

  /** Search window length for seasonal events */
  SEASONAL_SEARCH_WINDOW_DAYS: 91 as JulianDay,

  /**
   * Temporal windows for event detection
   * @constant {Object}
   */
  WINDOW: {
    /** Default search window for typical event detection (~2 hours) */
    DEFAULT: 0.083 as JulianDay, // 120 minutes
  },
};

/**
 * Defines a solar event with altitude threshold and event names
 * @typedef {[Degrees, string, string]} SolarEventDefinition
 * @property {Degrees} 0 - Altitude threshold
 * @property {string} 1 - Start event name
 * @property {string} 2 - End event name
 */

/**
 * Solar event definitions with altitude thresholds
 * @constant {SolarEventDefinition[]}
 */
export const SOLAR_EVENT_DEFINITIONS: Array<[Degrees, string, string]> = [
  [-0.833 as Degrees, "sunrise", "sunset"],
  [-0.3 as Degrees, "sunriseEnd", "sunsetStart"],
  [-6 as Degrees, "dawn", "dusk"],
  [-12 as Degrees, "nauticalDawn", "nauticalDusk"],
  [-18 as Degrees, "nightEnd", "night"],
  [6 as Degrees, "goldenHourEnd", "goldenHour"],
];
