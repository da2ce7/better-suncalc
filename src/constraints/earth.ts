/**
 * @file constraints/earth.ts
 * @description Constants related to Earth's orientation, orbit, sidereal time, and atmospheric refraction.
 */

import { JULIAN_EPOCH_J2000 } from "./time";
import {
  Days,
  Degrees,
  DegreesPerCenturySquared,
  DegreesPerDay,
} from "./types";

/** =============== Earth Orientation and Orbital Parameters ================ */

/**
 * Constants related to Earth's orientation and orbit.
 * @constant {Object}
 */
export const EARTH = {
  /**
   * The obliquity of the ecliptic at the J2000 epoch.
   * @constant {Degrees}
   * @unit degrees
   * @description The angle between Earth's equatorial plane and the ecliptic plane.
   */
  OBLIQUITY_J2000: 23.4392911 as Degrees, // IAU 2006 value in degrees

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

    T_SQUARED_COEFF: 0.000387933 as DegreesPerCenturySquared,
    T_CUBED_DIVISOR: 38710000, // dimensionless divisor for T^3 term
  },

  /**
   * General parameters for Earth's rotation.
   * @constant {Object}
   */
  GENERAL: {
    /**
     * Earth's rotation rate.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Angular rotation rate per mean solar day (verified against IERS).
     */
    ROTATION_RATE: 360.9856235 as DegreesPerDay, // Degrees/day
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
