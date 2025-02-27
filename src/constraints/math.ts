/**
 * @file constraints/math.ts
 */

/** =================== Mathematical Constants and Conversions =================== */

/**
 * π (pi) - Circle circumference to diameter ratio
 * @constant {number}
 * @unit radians
 */
export const PI = Math.PI;

/**
 * τ (tau) - Circle circumference to radius ratio
 * @constant {number}
 * @unit radians
 */
export const TAU = 2 * PI;

/**
 * Degrees to radians conversion factor
 * @constant {number}
 * @example radians = degrees * DEGREES_TO_RADIANS
 */
export const DEGREES_TO_RADIANS = PI / 180;

/** =========== Numerical Stability and Calculation Parameters =========== */

export const NUMERICAL = {
  EPSILON: {
    FLOATING_POINT_DAYS: 1e-14, // ~69μs tolerance
    EVENT_TIME_EQUALITY_DAYS: 0.001, // ~1.44m threshold
  },
  ITERATION: {
    MAX: 15,
    CONVERGENCE_THRESHOLD: 1e-8, // ~0.00086s
    SAFETY_MARGIN_DAYS: 10,
  },
  CALCULATION: {
    DERIVATIVE_STEP_DAYS: 0.001, // ~1.44m step
  },
};

/** ====================== Event Detection Parameters ====================== */

export const EVENT_THRESHOLDS = {
  SOLAR_ALTITUDE_DEG: {
    CLASSIC_HORIZON: -0.833,
    GOLDEN_HOUR: 6,
    CIVIL_TWILIGHT: -6,
    NAUTICAL_TWILIGHT: -12,
    ASTRONOMICAL_TWILIGHT: -18,
  },
  LUNAR_ALTITUDE_DEG: 0.625,
  SEASONAL_SEARCH_WINDOW_DAYS: 91,
};

export const SOLAR_EVENT_DEFINITIONS: Array<[number, string, string]> = [
  [-0.833, "sunrise", "sunset"],
  [-0.3, "sunriseEnd", "sunsetStart"],
  [-6, "dawn", "dusk"],
  [-12, "nauticalDawn", "nauticalDusk"],
  [-18, "nightEnd", "night"],
  [6, "goldenHourEnd", "goldenHour"],
];
