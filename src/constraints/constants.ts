/**
 * @file constants.ts
 * @module constants
 * @description Consolidates mathematical constants, astronomical parameters, and temporal definitions
 * used for astronomical calculations. Organized into logical groups:
 * 1. Mathematical constants and conversions
 * 2. Time units and epochs
 * 3. Earth's axial tilt and orbital characteristics
 * 4. Solar orbital parameters and event thresholds
 * 5. Lunar orbital parameters and event thresholds
 * 6. Atmospheric refraction parameters
 * 7. Sidereal time calculation parameters
 * 8. Reference astronomical events (equinoxes/solstices)
 * 9. ΔT (Delta T) polynomial segments for time scale conversion
 * 10. Julian date conversion parameters
 * 11. Numerical stability and iterative calculation settings
 * 12. Event detection configurations
 */

import { DEGREES_TO_RADIANS } from "./math";

/** ===================== Time Units and Epoch Definitions ====================== */

// Earth Rotation Constants

export const DAYS_PER_JULIAN_CENTURY = 36525; // Days in a Julian century

// GMST (Greenwich Mean Sidereal Time) Calculation Constants
export const GMST_COEFF_DEGREES = 280.46061837; // Constant term (degrees)
export const DAILY_DRIFT_DEGREES_PER_DAY = 360.98564736628; // Daily drift rate (°/day)
export const T_SQUARED_COEFF_DEGREES = 0.000387933; // T² coefficient (degrees)
export const T_CUBED_DIVISOR = 38710000; // T³ division denominator

// Unit Conversion Constants
export const FULL_CIRCLE_DEGREES = 360; // Degrees in full circle

// ---------------------
// Sun Position Specific Constants
// ---------------------
// Mean longitude parameters (L)
export const SUN_MEAN_LON_EPOCH_DEGREES = 280.4664567; // L₀ at J2000.0 (deg)
export const SUN_LON_DAILY_DRIFT = 36000.76982779; // dL/dt (°/Julian century)
export const SUN_LON_T2_CORRECTION = 3.032e-4; // T² coefficient (deg/century²)

// Mean anomaly parameters (M)
export const MEAN_ANOMALY_EPOCH_DEGREES = 357.5291; // M₀ at J2000.0 (deg)
export const MEAN_ANOMALY_DRIFT_PER_CENTURY = 35999.0503; // dM/dt (°/Julian century)

// Equation of center coefficients
export const EQ_CENTER_SIN_M_COEFFICIENT = 1.9146; // First-order coefficient (deg)
export const EQ_CENTER_SIN_2M_COEFFICIENT = 0.02; // Second-order coefficient (deg)
export const EQ_CENTER_DRIFT_CORRECTION = 0.004817; // TD coefficient (per century)

// Ecliptic parameters
export const ECLIPTIC_OBLIQUITY_BASE_DEGREES = 23.4392911; // ε₀ at J2000.0 (deg)
export const ECLIPTIC_OBLIQUITY_DRIFT_RATE = -0.013004; // dε/dt (°/Julian century)

/**
 * Milliseconds in one hour (60 minutes × 60 seconds × 1000 milliseconds)
 * @constant {number}
 */
export const HOUR_MS = 3_600_000;

/**
 * Half a standard day (24 hours)
 * @constant {number}
 */
export const HALF_DAY = 0.5;

/**
 * Milliseconds in a standard day (24 hours)
 * @constant {number}
 */
export const DAY_MS = 86_400_000;

/**
 * Seconds in a standard day
 * @constant {number}
 */
export const SECONDS_PER_DAY = 86400;

/**
 * Hours in a day
 * @constant {number}
 */
export const HOURS_IN_DAY = 24;

/**
 * Julian Date of the Unix epoch: 1970-01-01T12:00:00 UTC
 * @constant {number}
 * @description Midnight UTC 1970-01-01 is JD 2440587.5
 * @see {@link https://en.wikipedia.org/wiki/Julian_day}
 */
export const JULIAN_EPOCH_J1970 = 2440588.0;

/**
 * J2000 epoch (2000-01-01T12:00:00 TT) as Julian Date
 * @constant {number}
 * @see {@link https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000}
 */
export const JULIAN_EPOCH_J2000 = 2451545.0;

/** ============ Earth's Axial Tilt and Orbital Characteristics ============= */

/**
 * Earth's mean axial tilt (obliquity) at J2000 epoch
 * @constant {number}
 * @unit radians
 * @description 23.4397° converted to radians
 */
export const EARTH_OBLIQUITY_J2000 = 23.4397 * DEGREES_TO_RADIANS;

/**
 * Earth's perihelion longitude in J2000 reference frame
 * @constant {number}
 * @unit degrees
 */
export const EARTH_PERIHELION_LONGITUDE_DEG = 102.9372;

/**
 * Sidereal rotation rate of the Earth in degrees per day.
 * @constant {number}
 * @unit degrees per day
 */
export const SIDEREAL_RATE = 360.9856235;

/**
 * The eccentricity of Earth's orbit around the Sun.
 * This value is used in calculations involving the position and distance of Earth from the Sun.
 * It is approximately 0.0167086, indicating a nearly circular orbit.
 * @constant {number}
 * @see {@link https://en.wikipedia.org/wiki/Orbital_eccentricity|Orbital Eccentricity}
 */
export const EARTH_ORBIT_ECCENTRICITY = 0.0167086;

// ================ Solar Position Constants ================

/** Solar Mean Longitude parameters at J2000 (degrees) */
export const SOLAR_MEAN_LONGITUDE = {
  OFFSET_DEG: 280.459,
  RATE_DEG_PER_DAY: 0.98564736,
};

/** Obliquity parameters for the ecliptic (degrees) */
export const OBLIQUITY = {
  MEAN_DEG: 23.439291, // J2000 mean obliquity
  CORRECTION_RATE_DEG_PER_CENTURY: 0.0130042, // Change per century
};

/** ================== Solar Orbital Parameters and Events =================== */

/**
 * Mean duration of a tropical year (Earth orbital period)
 * @constant {number}
 * @unit days
 */
export const TROPICAL_YEAR_DAYS = 365.2422;

/**
 * Coefficients for solar equation of center calculation
 * @constant {number[]}
 */
export const SOLAR_EQUATION_OF_CENTER_COEFFS = [1.9148, 0.02, 0.0003];

/**
 * Parameters for solar mean anomaly calculation
 * @constant {Object}
 * @property {number} OFFSET_DEG - Initial angle at J2000 epoch in degrees
 * @property {number} RATE_DEG_PER_DAY - Daily angular progression in degrees per day
 */
export const SOLAR_MEAN_ANOMALY = {
  OFFSET_DEG: 357.5291,
  RATE_DEG_PER_DAY: 0.98560028,
};

/**
 * Coefficients for solar transit time adjustment
 * @constant {Object}
 * @property {number} ANOMALY_COEFF - Coefficient for anomaly term
 * @property {number} LONGITUDE_COEFF - Coefficient for longitude term
 */
export const SOLAR_TRANSIT_CORRECTION = {
  ANOMALY_COEFF: 0.0053,
  LONGITUDE_COEFF: -0.0069,
};

/**
 * Solar altitude thresholds for observational phases
 * @constant {Object}
 * @property {number} CLASSIC_HORIZON - Threshold for sunrise/sunset in degrees
 * @property {number} GOLDEN_HOUR - Threshold for golden hour in degrees
 * @property {number} CIVIL_TWILIGHT - Threshold for civil twilight in degrees
 * @property {number} NAUTICAL_TWILIGHT - Threshold for nautical twilight in degrees
 * @property {number} ASTRONOMICAL_TWILIGHT - Threshold for astronomical twilight in degrees
 */
export const SOLAR_ALTITUDE_THRESHOLDS_DEG = {
  CLASSIC_HORIZON: -0.833,
  GOLDEN_HOUR: 6,
  CIVIL_TWILIGHT: -6,
  NAUTICAL_TWILIGHT: -12,
  ASTRONOMICAL_TWILIGHT: -18,
};

/** ================== Lunar Orbital Parameters and Events =================== */

/**
 * Lunar orbital elements at J2000 epoch
 * @constant {Object}
 * @property {number} MEAN_LONGITUDE - Mean longitude in degrees
 * @property {number} MEAN_ANOMALY - Mean anomaly in degrees
 * @property {number} MEAN_ARG_LATITUDE - Mean argument of latitude in degrees
 */
export const LUNAR_J2000 = {
  MEAN_LONGITUDE: 218.316,
  MEAN_ANOMALY: 134.963,
  MEAN_ARG_LATITUDE: 93.272,
};

/**
 * Daily orbital motion rates for the Moon
 * @constant {Object}
 * @property {number} LONGITUDE - Daily motion in longitude in degrees per day
 * @property {number} ANOMALY - Daily motion in anomaly in degrees per day
 * @property {number} ARG_LATITUDE - Daily motion in argument of latitude in degrees per day
 */
export const LUNAR_DAILY_MOTION = {
  LONGITUDE: 13.176396,
  ANOMALY: 13.064993,
  ARG_LATITUDE: 13.22935,
};

/**
 * Lunar distance characteristics
 * @constant {Object}
 * @property {number} MEAN - Mean distance in kilometers
 * @property {number} VARIATION_COEFF - Variation coefficient in kilometers
 */
export const LUNAR_DISTANCE = {
  MEAN: 385001,
  VARIATION_COEFF: 20905,
};

/**
 * Threshold for moonrise calculation including refraction and semi-diameter
 * @constant {number}
 * @unit degrees
 */
export const MOON_VISIBILITY_ALTITUDE_DEG = 0.625;

/**
 * Amplitude of the moon's evection perturbation in longitude (degrees).
 * Used to correct the mean longitude in simplified lunar models.
 */
export const MOON_EVECTION_LONGITUDE_AMPLITUDE_DEG: number = 6.289;

/**
 * Simplified approximation of the moon's orbital inclination to the ecliptic (degrees).
 * Used to calculate the moon's ecliptic latitude in basic models.
 * Note: The actual inclination is approximately 5.14°.
 */
export const MOON_INCLINATION_APPROX_DEG: number = 5.128;

/**
 * The semi-major axis of the Moon's orbit around Earth, expressed in astronomical units (AU).
 * This value represents the average distance from the center of the Earth to the center of the Moon.
 * It is calculated by converting the average distance of 384,400 kilometers to AU, where 1 AU is approximately 149,597,870.7 kilometers.
 * @constant {number}
 * @see {@link https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html|NASA Moon Fact Sheet}
 */
export const MOON_SEMI_MAJOR_AXIS_AU = 0.00256955529; // 384,400 km / 149,597,870.7 km/AU

/**
 * The eccentricity of the Moon's orbit around Earth.
 * Eccentricity measures how much the orbit deviates from a perfect circle, with 0 being circular and values approaching 1 being highly elliptical.
 * The Moon's orbit has a small eccentricity, indicating it is nearly circular.
 * @constant {number}
 * @see {@link https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html|NASA Moon Fact Sheet}
 */
export const MOON_ORBIT_ECCENTRICITY = 0.0549;

/** ====================== Atmospheric Refraction Model ====================== */

/**
 * Saemundsson's atmospheric refraction parameters
 * @constant {Object}
 * @property {number} MIN_ALTITUDE_DEG - Minimum true altitude for model validity in degrees
 * @property {number} COEFFICIENT_DEG - Refraction coefficient in degrees
 * @property {number} ALTITUDE_OFFSET_DEG - Altitude term offset in degrees
 * @property {number} DENOMINATOR_OFFSET_DEG - Denominator adjustment term in degrees
 */
export const ATMOSPHERIC_REFRACTION = {
  MIN_ALTITUDE_DEG: -0.83,
  COEFFICIENT_DEG: 0.017,
  ALTITUDE_OFFSET_DEG: 10.3,
  DENOMINATOR_OFFSET_DEG: 5.11,
};

/** ====================== Sidereal Time Calculations ======================== */

/**
 * Earth rotation parameters for sidereal time
 * @constant {Object}
 * @property {number} INITIAL_OFFSET_DEG - Offset at J2000 epoch in degrees
 * @property {number} RATE_DEG_PER_DAY - Daily progression rate in degrees per day
 */
export const SIDEREAL_TIME_PARAMS = {
  INITIAL_OFFSET_DEG: 280.16,
  RATE_DEG_PER_DAY: 360.9856235,
};

/** ===================== Reference Astronomical Events ====================== */

/**
 * Vernal Equinox reference (2000-03-20T07:35Z UTC)
 * @constant {number}
 * @description USNO value: 2451630.306
 */
export const VERNAL_EQUINOX_2000_JD = 2451630.306;

/**
 * Northern Summer Solstice reference (2000-06-21T07:48Z UTC)
 * @constant {number}
 * @description USNO value: 2451701.825
 */
export const SUMMER_SOLSTICE_2000_JD = 2451701.825;

/** ================== Julian Date Conversion Parameters =================== */

/**
 * Maximum iterations for Julian ↔ Date conversion to avoid floating point issues
 * @constant {number}
 */
export const JULIAN_CONVERSION_MAX_ITERATIONS = 3;

/** ======= Numerical Stability and Iterative Calculation Parameters ======= */

/**
 * Threshold for considering values numerically equivalent
 * @constant {number}
 * @unit days
 * @description Approximately 69 microseconds. Used in floating point comparisons to avoid precision errors.
 */
export const FLOATING_POINT_EPSILON_DAYS = 1e-14;

/**
 * Automatic differentiation step size for numerical derivatives
 * @constant {number}
 * @unit days
 * @description Approximately 1.44 minutes. Used in finite difference approximations of derivatives.
 */
export const NUMERICAL_DERIVATIVE_STEP_DAYS = 0.001;

/**
 * Maximum allowable iterations for convergence-seeking algorithms
 * @constant {number}
 * @description Prevents infinite loops in Newton-Raphson and similar methods.
 */
export const ITERATIVE_METHODS_MAX_ITERATIONS = 15;

/**
 * Convergence threshold for iterative event time calculation
 * @constant {number}
 * @unit days
 * @description Approximately 0.00086 seconds. When successive estimates differ by less than this, consider converged.
 */
export const EVENT_TIME_CONVERGENCE_THRESHOLD_DAYS = 1e-8;

/**
 * Safety margin for time step adjustments in event calculations
 * @constant {number}
 * @unit days
 * @description 10 days. Prevents excessively large jumps during root-finding.
 */
export const MAXIMUM_TIME_STEP_DAYS = 10;

/**
 * Search window duration for seasonal event detection
 * @constant {number}
 * @unit days
 * @description Approximately 91 days. Initial bracketing window for equinox/solstice calculations.
 */
export const SEASONAL_EVENT_SEARCH_WINDOW_DAYS = 91;

/** ==================== Event Detection Configurations ==================== */

/**
 * Default window size for rise/set event detection
 * @constant {number}
 * @unit days
 * @description Equivalent to 2 hours. Time window for checking astronomical events in daily calculations.
 */
export const EVENT_DETECTION_WINDOW_DAYS = 2 / 24;

/**
 * Threshold for considering times identical in event detection
 * @constant {number}
 * @unit days
 * @description Approximately 1.44 minutes. Used when comparing event times to avoid duplicate detection.
 */
export const EVENT_TIME_EQUALITY_THRESHOLD_DAYS = 0.001;

/**
 * Solar elevation event definitions
 * @constant {Array<[number, string, string]>}
 * @description Each tuple contains [angle_deg, rise_event_name, set_event_name]
 */
export const SOLAR_EVENT_DEFINITIONS: Array<[number, string, string]> = [
  [-0.833, "sunrise", "sunset"],
  [-0.3, "sunriseEnd", "sunsetStart"],
  [-6, "dawn", "dusk"],
  [-12, "nauticalDawn", "nauticalDusk"],
  [-18, "nightEnd", "night"],
  [6, "goldenHourEnd", "goldenHour"],
];

/**
 * Lunar visibility threshold including refraction and semi-diameter
 * @constant {number}
 * @unit degrees
 */
export const LUNAR_VISIBILITY_ALTITUDE_DEG = 0.625;

/** ================ Moon Phase Calculation Parameters ================== */

/**
 * Reference New Moon JD for lunar phase calculations
 * @constant {number}
 * @description New Moon at 2000-01-06T18:14 UTC (TT adjusted)
 */
export const REFERENCE_NEW_MOON_JD = 2451550.26046;

/**
 * Mean synodic month duration
 * @constant {number}
 * @unit days
 * @description Average time between lunar phase alignments (moon cycle)
 */
export const SYNODIC_MONTH_DAYS = 29.530588853;
