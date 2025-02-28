/**
 * @file constraints/math.ts
 * @description Mathematical constants and parameters for numerical stability and event detection.
 */

import { Days, Degrees } from "./types";

/** =================== Mathematical Constants and Conversions =================== */

/**
 * π (pi) - The ratio of a circle's circumference to its diameter.
 * @constant {number}
 * @unit radians
 */
export const PI = Math.PI; // Unitless, used in conversions

/**
 * τ (tau) - The ratio of a circle's circumference to its radius.
 * @constant {number}
 * @unit radians
 */
export const TAU = 2 * PI; // Unitless

/**
 * Full circle in degrees.
 * @unit degrees
 */
export const FULL_CIRCLE_DEGREES: Degrees = 360 as Degrees;

/**
 * Conversion factor from AstronomicalUnits to KM.
 * @constant {number}
 * @unit unitless
 * @example 1 AstronomicalUnits to kilometers
 */
export const AU_TO_KM = 149597870.7;

/** =========== Numerical Stability and Calculation Parameters =========== */

/**
 * Numerical parameters for stability and precision in calculations.
 * @constant {Object}
 */
export const NUMERICAL = {
  /**
   * Epsilon values for numerical comparisons.
   * @constant {Object}
   */
  EPSILON: {
    /**
     * Floating point precision for time calculations in days.
     * @constant {Days}
     * @unit days
     * @example Approximately 69μs tolerance
     */
    FLOATING_POINT_DAYS: 1e-14 as Days, // ~69μs tolerance

    /**
     * Threshold for considering two event times equal.
     * @constant {Days}
     * @unit days
     * @example Approximately 1.44 minutes threshold
     */
    EVENT_TIME_EQUALITY_DAYS: 0.001 as Days, // ~1.44m threshold
  },

  /**
   * Parameters for iterative calculations.
   * @constant {Object}
   */
  ITERATION: {
    /**
     * Maximum number of iterations for convergence.
     * @constant {number}
     * @unit unitless
     */
    MAX: 15, // Unitless

    /**
     * Convergence threshold for iterative methods.
     * @constant {Days}
     * @unit days
     * @example Approximately 0.00086 seconds
     */
    CONVERGENCE_THRESHOLD: 1e-8 as Days, // ~0.00086s

    /**
     * Safety margin for iterative searches.
     * @constant {Days}
     * @unit days
     */
    SAFETY_MARGIN_DAYS: 10 as Days,
  },

  /**
   * Parameters for numerical calculations.
   * @constant {Object}
   */
  CALCULATION: {
    /**
     * Step size for numerical derivatives.
     * @constant {Days}
     * @unit days
     * @example Approximately 1.44 minutes step
     */
    DERIVATIVE_STEP_DAYS: 0.001 as Days, // ~1.44m step
  },
};

/** ====================== Event Detection Parameters ====================== */

/**
 * Thresholds for detecting various astronomical events.
 * @constant {Object}
 */
export const EVENT_THRESHOLDS = {
  /**
   * Solar altitude thresholds for different events.
   * @constant {Object}
   */
  SOLAR_ALTITUDE_DEG: {
    /**
     * Classic horizon threshold for sunrise/sunset.
     * @constant {Degrees}
     * @unit degrees
     */
    CLASSIC_HORIZON: -0.833 as Degrees,

    /**
     * Altitude for golden hour.
     * @constant {Degrees}
     * @unit degrees
     */
    GOLDEN_HOUR: 6 as Degrees,

    /**
     * Altitude for civil twilight.
     * @constant {Degrees}
     * @unit degrees
     */
    CIVIL_TWILIGHT: -6 as Degrees,

    /**
     * Altitude for nautical twilight.
     * @constant {Degrees}
     * @unit degrees
     */
    NAUTICAL_TWILIGHT: -12 as Degrees,

    /**
     * Altitude for astronomical twilight.
     * @constant {Degrees}
     * @unit degrees
     */
    ASTRONOMICAL_TWILIGHT: -18 as Degrees,
  },

  /**
   * Lunar altitude threshold for visibility.
   * @constant {Degrees}
   * @unit degrees
   */
  LUNAR_ALTITUDE_DEG: 0.625 as Degrees,

  /**
   * Search window for seasonal events.
   * @constant {Days}
   * @unit days
   */
  SEASONAL_SEARCH_WINDOW_DAYS: 91 as Days,

  /**
   * Temporal window for event detection.
   * @constant {Object}
   */
  WINDOW: {
    /**
     * Default search window for general event detection.
     * @constant {Days}
     * @unit days
     * @description ~2 hour window (0.083 days ≈ 120 minutes)
     */
    DEFAULT: 0.083 as Days,
  },
};

/**
 * Defines a solar event with altitude threshold and event names.
 * @typedef {Array} SolarEventDefinition
 * @property {Degrees} altitude - The altitude threshold for the event.
 * @property {string} startEvent - The name of the start event (e.g., sunrise).
 * @property {string} endEvent - The name of the end event (e.g., sunset).
 */
type SolarEventDefinition = [Degrees, string, string];

/**
 * Definitions for solar events with their altitude thresholds and event names.
 * @constant {SolarEventDefinition[]}
 */
export const SOLAR_EVENT_DEFINITIONS: SolarEventDefinition[] = [
  [-0.833 as Degrees, "sunrise", "sunset"],
  [-0.3 as Degrees, "sunriseEnd", "sunsetStart"],
  [-6 as Degrees, "dawn", "dusk"],
  [-12 as Degrees, "nauticalDawn", "nauticalDusk"],
  [-18 as Degrees, "nightEnd", "night"],
  [6 as Degrees, "goldenHourEnd", "goldenHour"],
];
