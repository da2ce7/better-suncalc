/**
 * @file constraints/earth.ts
 * @description Constants related to Earth's orientation, orbit, sidereal time, and atmospheric refraction.
 */

import { JULIAN_EPOCH_J2000 } from "./time";
import {
  Days,
  Degrees,
  DegreesPerDay,
  DegreesPerJ2000CenturyTT,
  DegreesPerJ2000CenturyTT_Squared,
  JulianDayTT,
} from "./types";

/** =============== Earth Orientation and Orbital Parameters ================ */

/**
 * Constants related to Earth's orientation and orbit.
 * @constant {Object}
 */
export const EARTH = {
  /**
   * Seasonal astronomical events reference points
   * @constant {Object}
   * @memberof EARTH
   * @property {JulianDay} VERNAL_EQUINOX_2000 - Julian Day Number for the March equinox in J2000 epoch (2000-03-20 07:35 UT)
   */
  SEASONAL_EVENTS: {
    VERNAL_EQUINOX_2000: 2451630.306 as JulianDayTT,
  },

  /**
   * The obliquity of the ecliptic at the J2000 epoch.
   * @constant {Degrees}
   * @unit degrees
   * @description The angle between Earth's equatorial plane and the ecliptic plane.
   */
  OBLIQUITY_J2000: 23.4392911 as Degrees, // IAU 2006 value in degrees

  /**
   * Parameters for long-term variations in Earth's axial tilt (obliquity).
   * @constant {Object}
   */
  OBLIQUITY_DRIFT: {
    /**
     * Linear drift rate of Earth's obliquity.
     * @constant {DegreesPerJ2000CenturyTT}
     * @unit degrees/century
     * @description Simplified linear approximation of the decreasing obliquity over time.
     * @note For high-precision long-term calculations, use a polynomial model.
     * Based on modern estimates of ~-0.013° per century (J. Laskar 1986 estimation).
     */
    LINEAR_RATE: -0.013 as DegreesPerJ2000CenturyTT,

    /**
     * Reference period for the linear drift rate.
     * @constant {JulianDay}
     * @unit Julian Day
     * @description The J2000 epoch serves as the reference point for this linear model.
     * @see JULIAN_EPOCH_J2000
     */
    REFERENCE_EPOCH: JULIAN_EPOCH_J2000,
  },

  /**
   * Parameters for Earth's perihelion.
   * @constant {Object}
   */
  PERIHELION: {
    /**
     * Longitude of Earth's perihelion at the J2000 epoch.
     * @constant {Degrees}
     * @unit degrees
     * @description The angular position of perihelion relative to the vernal equinox.
     */
    LONGITUDE: 102.9372 as Degrees, // Degrees (J2000)

    /**
     * Epoch for the perihelion longitude.
     * @constant {JulianDay}
     * @unit Julian Day
     * @see JULIAN_EPOCH_J2000
     */
    EPOCH: JULIAN_EPOCH_J2000, // Defined in time.ts
  },

  /**
   * Parameters for Earth's orbit.
   * @constant {Object}
   */
  ORBIT: {
    /**
     * Eccentricity of Earth's orbit.
     * @constant {number}
     * @unit unitless
     * @description Measure of the orbit's deviation from a perfect circle.
     */
    ECCENTRICITY: 0.0167086, // Unitless

    /**
     * Length of the tropical year.
     * @constant {Days}
     * @unit days
     * @description The time Earth takes to complete one orbit relative to the vernal equinox.
     */
    TROPICAL_YEAR: 365.2422 as Days, // Days
  },
};

/** ================ Sidereal Time and Earth Rotation ================= */

/**
 * Constants related to sidereal time and Earth's rotation.
 * @constant {Object}
 */
export const SIDEREAL = {
  /**
   * Parameters for Greenwich Mean Sidereal Time (GMST).
   * @constant {Object}
   */
  GMST: {
    /**
     * Base value for GMST at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Sidereal time at Greenwich at the J2000 epoch.
     */
    BASE: 280.46061837 as Degrees, // Degrees

    /**
     * Drift rate of GMST.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Rate of change of sidereal time per solar day.
     */
    DRIFT_RATE: 360.98564736628 as DegreesPerDay, // Degrees/day

    T_SQUARED_COEFF: 0.000387933 as DegreesPerJ2000CenturyTT_Squared,
    T_CUBED_DIVISOR: 38710000, // dimensionless divisor for T^3 term
  },
};

/** =============== Atmospheric Refraction Models ================ */

/**
 * Constants related to atmospheric refraction.
 * @constant {Object}
 */
export const REFRACTION = {
  /**
   * Standard refraction parameters.
   * @constant {Object}
   */
  STANDARD: {
    /**
     * Refraction at the horizon.
     * @constant {Degrees}
     * @unit degrees
     * @description Apparent shift in position due to atmospheric bending at the horizon.
     */
    HORIZON: -0.833 as Degrees,

    /**
     * Altitudes for twilight definitions.
     * @constant {Degrees[]}
     * @unit degrees
     * @description Solar altitudes for civil, nautical, and astronomical twilight.
     */
    TWILIGHTS: [-6, -12, -18] as Degrees[],

    /**
     * Refraction adjustment for lunar observations.
     * @constant {Degrees}
     * @unit degrees
     * @description Correction for lunar altitude due to refraction and semi-diameter.
     */
    LUNAR: 0.625 as Degrees,
  },

  /**
   * Parameters for the Saemundsson refraction model.
   * @constant {Object}
   */
  SAEMUNDSSON: {
    /**
     * Minimum altitude for refraction calculation.
     * @constant {Degrees}
     * @unit degrees
     * @description Lower bound for applying the Saemundsson model.
     */
    MIN_ALTITUDE: -0.83 as Degrees,

    /**
     * Coefficient for the Saemundsson model.
     * @constant {number}
     * @unit unitless
     * @description Scaling factor in the refraction formula.
     */
    COEFFICIENT: 0.017, // Unitless

    /**
     * Altitude offset for the Saemundsson model.
     * @constant {Degrees}
     * @unit degrees
     * @description Offset applied to altitude in the refraction calculation.
     */
    ALTITUDE_OFFSET: 10.3 as Degrees, // Degrees (altitude-related)

    /**
     * Denominator offset for the Saemundsson model.
     * @constant {number}
     * @unit unitless
     * @description Constant in the denominator of the refraction formula.
     */
    DENOMINATOR_OFFSET: 5.11, // Unitless
  },
};

/** ======================= ΔT Polynomial Segments ======================== */

/**
 * Configuration for ΔT (TT - UTC) polynomial approximations.
 * @typedef {Object} DeltaTPolynomialSegment
 * @property {number} maxYear - Upper year bound (exclusive).
 * @property {number} base - Reference year for polynomial calculation.
 * @property {number} scale - Year normalization divisor.
 * @property {number[]} coeffs - Polynomial coefficients [a₀, a₁t, a₂t²,...].
 */
export type DeltaTPolynomialSegment = {
  maxYear: number;
  base: number;
  scale: number;
  coeffs: number[]; // Unitless coefficients
};

/**
 * Polynomial segments for ΔT approximation by historical period.
 * @constant {DeltaTPolynomialSegment[]}
 * @description
 * These segments provide polynomial approximations for ΔT (TT - UTC) over different historical periods.
 * The coefficients are used to compute ΔT in seconds for a given year.
 * @example
 * For a year y in a segment, ΔT ≈ a₀ + a₁*(y - base)/scale + a₂*((y - base)/scale)^2 + ...
 */
export const DELTA_T_POLYNOMIAL_SEGMENTS: DeltaTPolynomialSegment[] = [
  { maxYear: -500, base: 1820, scale: 100, coeffs: [-20, 0, 32] },
  {
    maxYear: 500,
    base: 0,
    scale: 100,
    coeffs: [10583.6, -1014.41, 33.78311, -5.952053],
  },
  {
    maxYear: 1600,
    base: 1000,
    scale: 100,
    coeffs: [1574.2, -556.01, 71.23472, 0.319781],
  },
  {
    maxYear: 1700,
    base: 1600,
    scale: 1,
    coeffs: [120, -0.9808, -0.01532, 1 / 7129],
  },
  {
    maxYear: 1800,
    base: 1700,
    scale: 1,
    coeffs: [8.83, 0.1603, -0.0059285, 0.00013336],
  },
  {
    maxYear: 1860,
    base: 1800,
    scale: 1,
    coeffs: [13.72, -0.332447, 0.0068612, 0.0041116],
  },
  {
    maxYear: 1900,
    base: 1860,
    scale: 1,
    coeffs: [7.62, 0.5737, -0.251754, 0.01680668],
  },
  {
    maxYear: 1920,
    base: 1900,
    scale: 1,
    coeffs: [-2.79, 1.494119, -0.0598939, 0.0061966],
  },
  {
    maxYear: 1941,
    base: 1920,
    scale: 1,
    coeffs: [21.2, 0.84493, -0.0761, 0.0020936],
  },
  {
    maxYear: 1961,
    base: 1950,
    scale: 1,
    coeffs: [29.07, 0.407, -1 / 233, 1 / 2547],
  },
  {
    maxYear: 1986,
    base: 1975,
    scale: 1,
    coeffs: [45.45, 1.067, -1 / 260, -1 / 718],
  },
  {
    maxYear: 2005,
    base: 2000,
    scale: 1,
    coeffs: [63.86, 0.3345, -0.060374, 0.0017275],
  },
  { maxYear: 2050, base: 2000, scale: 1, coeffs: [62.92, 0.32217, 0.005589] },
  { maxYear: Infinity, base: 2020, scale: 1, coeffs: [71.0, 0.3875, 0.00325] },
];
