/**
 * constants.ts
 *
 * Mathematical constants, astronomical parameters, and temporal definitions
 * used for astronomical computations. All angular values are explicitly marked
 * as radians or degrees in their documentation.
 *
 * @module constants
 */

/** ======================== Mathematical Constants ======================== */

/**
 * π (pi) - Ratio of circle circumference to diameter
 */
export const PI = Math.PI;

/**
 * Conversion factor from degrees to radians (π radians = 180 degrees)
 * Usage: radians = degrees * DEGREE_IN_RADIANS
 */
export const DEGREE_IN_RADIANS = PI / 180;

/** ==================== Trigonometric Function Wrappers =================== */

/**
 * @param angle - Input angle in radians
 * @returns Sine of the angle
 */
export const sin = Math.sin;

/**
 * @param angle - Input angle in radians
 * @returns Cosine of the angle
 */
export const cos = Math.cos;

/**
 * @param angle - Input angle in radians
 * @returns Tangent of the angle
 */
export const tan = Math.tan;

/**
 * @param value - Sine value between -1 and 1
 * @returns Inverse sine in radians
 */
export const asin = Math.asin;

/**
 * @param value - Cosine value between -1 and 1
 * @returns Inverse cosine in radians
 */
export const acos = Math.acos;

/**
 * Two-argument arctangent (preserves quadrant information)
 * @param y - Opposite side length
 * @param x - Adjacent side length
 * @returns Angle in radians between [-π, π]
 */
export const atan2 = Math.atan2;

/** ================= Temporal Constants and Epoch Definitions ============== */

/**
 * Milliseconds in a standard day (24h × 60m × 60s × 1000ms).
 * @constant {number}
 */
export const DAY_IN_MS: number = 86_400_000;

/**
 * Milliseconds in one hour (60m × 60s × 1000ms).
 * @constant {number}
 */
export const HOUR_IN_MS: number = 3_600_000;

/**
 * Julian Date (JD) of the Unix epoch (noon 1970-01-01 UTC).
 * @constant {number}
 * @remarks
 * Represents 1970-01-01T12:00:00 UTC as JD 2440588.0, chosen because:
 * - Midnight UTC 1970-01-01 is JD 2440587.5
 * - This noon alignment simplifies Date ↔ JD conversions
 */
export const J1970 = 2440588.0;

/**
 * J2000 epoch (2000-01-01T12:00:00 TT) as Julian Date.
 * @constant {number}
 * @see ref [J2000 Epoch](https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000)
 */
export const J2000 = 2451545.0;

/** ============== Earth's Orbital and Axial Characteristics ================ */

/**
 * Earth's mean axial tilt (obliquity) at J2000 epoch
 * @unit radians
 * @value 23.4397° converted to radians
 */
export const EARTH_OBLIQUITY_J2000: number = 23.4397 * DEGREE_IN_RADIANS;

/**
 * Earth's perihelion longitude in the J2000 reference frame
 * @unit degrees
 * @value 102.9372°
 */
export const EARTH_PERIHELION: number = 102.9372;

/** ======================== Solar Orbital Parameters ======================= */

/** Mean duration of a tropical year (Earth's orbital period) */
export const TROPICAL_YEAR: number = 365.2422;

/** Coefficients for solar equation of center calculation (degrees) */
export const EQUATION_OF_CENTER_COEFFS: number[] = [1.9148, 0.02, 0.0003];

/** Parameters for solar mean anomaly calculation
 * @property OFFSET - Initial angle at epoch (degrees)
 * @property DAILY_RATE - Daily angular progression (degrees/day)
 */
export const SOLAR_ANOMALY = {
  OFFSET: 357.5291,
  DAILY_RATE: 0.98560028,
};

/** =================== Solar Event Calculation Parameters ================== */

/**
 * Time offset for approximate solar transit calculation
 * @unit days
 * @remarks
 * Represents ~1.3 minute adjustment (0.0009 days)
 */
export const J0: number = 0.0009;

/**
 * Coefficients for solar transit time adjustment
 * @property M_COEFF - Coefficient for solar anomaly adjustment (degrees)
 * @property L_COEFF - Coefficient for ecliptic longitude adjustment (degrees)
 */
export const SOLAR_TRANSIT_COEFFS = {
  M_COEFF: 0.0053,
  L_COEFF: -0.0069,
};

/** ================= Iterative Calculation Parameters ===================== */

/**
 * Window duration for seasonal calculation convergence (approximate quarter-year)
 * @unit days
 * @remarks Simplification of TROPICAL_YEAR/4 (≈91.30555 days)
 */
export const CONVERGENCE_WINDOW: number = 91;

/**
 * Time step for finite difference calculations in numerical methods
 * @unit days ≈ 1.44 minutes
 */
export const DERIVATIVE_DELTA_DAYS: number = 0.001;

/**
 * Convergence threshold for iterative refinements
 * @unit days ≈ 0.00086 seconds
 */
export const CONVERGENCE_TOLERANCE: number = 1e-8;

/**
 * Threshold for considering time values equal
 * @unit days ≈ 1.44 minutes
 */
export const TIME_EQUALITY_EPS: number = 0.001;

/** ============ Atmospheric Refraction and Solar Position ================ */

/** Solar altitude thresholds for different observational phases */
export const SOLAR_ALTITUDE = {
  /** Classic horizon visibility threshold (-0.833°) */
  HORIZON: -0.833,

  /** Golden hour boundary (+6°) */
  GOLDEN_HOUR: 6,

  /** Civil twilight boundary (-6°) */
  CIVIL_TWILIGHT: -6,
};

/**
 * Parameters for Saemundsson's atmospheric refraction model
 * @remarks Simulates apparent sunrise/set at -0.83° true altitude
 */
export const REFRACTION_OPTIONS = Object.freeze({
  /** Minimum apparent altitude (-0.83°) in radians */
  MIN_ALT_RAD: -0.83 * DEGREE_IN_RADIANS,

  /** Refraction coefficient (0.017°) – 1.02 arcminutes converted to degrees */
  COEFF_DEG: 0.017, // 1.02/60 ≈ 0.017°

  /** Saemundsson adjustment terms */
  OFFSET_DEG: 10.3, // Numerator correction term
  DENOM_ADD_DEG: 5.11, // Denominator stabilization term
});

/** ===================== Reference Astronomical Events =================== */

/**
 * Vernal equinox reference (2000-03-20T07:35Z UTC)
 * @remarks Warning: Different sources vary by up to 30 minutes
 */
export const REFERENCE_EQUINOX_JD: number = 2451630.306;

/**
 * Northern summer solstice reference (2000-06-21T07:48Z UTC)
 * @remarks USNO value: 2451701.826
 */
export const REFERENCE_SUMMER_JD: number = 2451701.825;

/** ======================= Sidereal Time Parameters ====================== */

/** Earth rotation parameters for sidereal time calculation */
export const SIDEREAL_TIME_PARAMS = {
  /** Initial offset at J2000 epoch (280.16°) */
  OFFSET_DEG: 280.16,

  /** Earth's daily angular progression (360.9856235° / day) */
  RATE_DEG_PER_DAY: 360.9856235,
};

/** ================== Numerical Stability Parameters ===================== */

/**
 * Threshold for numerical stability in astronomical computations
 * @unit days ≈ 69 microseconds
 */
export const NUMERICAL_STABILITY_EPS: number = 1e-14;

/** ===================== Event Detection Parameters ====================== */

/**
 * Default window size for astronomical event detection
 * @unit days (2 hours)
 */
export const DEFAULT_WINDOW_SIZE_DAYS: number = 2 / 24;
