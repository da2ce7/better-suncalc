/**
 * @file constraints/lunar.ts
 * @description Constants related to the Moon's orbital and positional parameters.
 */

import { AU, Degrees, DegreesPerDay } from "./types";

/**
 * Constants related to the Moon's orbital and positional parameters.
 * @constant {Object}
 */
export const LUNAR = {
  /**
   * Parameters at the J2000 epoch.
   * @constant {Object}
   */
  EPOCH_J2000: {
    /**
     * Mean longitude of the Moon at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Angular position of the Moon along its orbit at J2000.
     */
    MEAN_LONGITUDE: 218.316 as Degrees, // Degrees

    /**
     * Mean anomaly of the Moon at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Angular distance from perigee at J2000.
     */
    MEAN_ANOMALY: 134.963 as Degrees, // Degrees

    /**
     * Mean argument of latitude of the Moon at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Angle from the ascending node at J2000.
     */
    MEAN_ARG_LATITUDE: 93.272 as Degrees, // Degrees
  },

  /**
   * Motion rates for lunar parameters.
   * @constant {Object}
   */
  MOTION: {
    /**
     * Rate of change of the Moon's mean longitude.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Daily motion of the Moon along its orbit.
     */
    LONGITUDE: 13.176396 as DegreesPerDay, // Degrees/day

    /**
     * Rate of change of the Moon's mean anomaly.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Daily change in anomaly.
     */
    ANOMALY: 13.064993 as DegreesPerDay, // Degrees/day

    /**
     * Rate of change of the Moon's mean argument of latitude.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Daily change in latitude argument.
     */
    ARG_LATITUDE: 13.22935 as DegreesPerDay, // Degrees/day
  },

  /**
   * Orbital parameters of the Moon.
   * @constant {Object}
   */
  ORBIT: {
    /**
     * Semi-major axis of the Moon's orbit.
     * @constant {AU}
     * @unit AU
     * @description Average distance from Earth to the Moon in astronomical units.
     */
    SEMI_MAJOR_AXIS: 0.00256955529 as AU, // AU

    /**
     * Eccentricity of the Moon's orbit.
     * @constant {number}
     * @unit unitless
     * @description Measure of the orbit's ellipticity.
     */
    ECCENTRICITY: 0.0549, // Unitless

    /**
     * Inclination of the Moon's orbit.
     * @constant {Degrees}
     * @unit degrees
     * @description Angle of the lunar orbit relative to the ecliptic.
     */
    INCLINATION: 5.128 as Degrees, // Degrees
  },

  /**
   * Visibility parameters for the Moon.
   * @constant {Object}
   */
  VISIBILITY: {
    /**
     * Altitude threshold for lunar visibility, accounting for refraction and semi-diameter.
     * @constant {Degrees}
     * @unit degrees
     * @description Minimum altitude for the Moon to be visible above the horizon.
     */
    ALTITUDE_THRESHOLD: 0.625 as Degrees, // Degrees (refraction + semi-diameter)
  },
};
