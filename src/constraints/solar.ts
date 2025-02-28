/**
 * @file constraints/solar.ts
 * @description Constants related to the Sun's orbital and positional model.
 */

import {
  Degrees,
  DegreesPerJ2000CenturyTT,
  DegreesPerJ2000DayTT,
} from "./types";

/**
 * Constants related to the Sun's orbital and positional model.
 * @constant {Object}
 */
export const SOLAR = {
  /**
   * Parameters at the J2000 epoch.
   * @constant {Object}
   */
  EPOCH_J2000: {
    /**
     * Mean longitude of the Sun at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @source NASA JPL Horizons
     * @description Angular position of the Sun along the ecliptic at J2000.
     */
    MEAN_LONGITUDE: 280.46646 as Degrees, // Degrees (NASA JPL Horizons)

    /**
     * Mean anomaly of the Sun at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Angular distance from perihelion at J2000.
     */
    MEAN_ANOMALY: 357.5291 as Degrees, // Degrees

    /**
     * Ecliptic obliquity at J2000.
     * @constant {Degrees}
     * @unit degrees
     * @description Angle between the ecliptic and celestial equator at J2000.
     */
    ECLIPTIC_OBLIQUITY: 23.4392911 as Degrees, // Degrees
  },

  /**
   * Motion rates for solar parameters.
   * @constant {Object}
   */
  MOTION: {
    /**
     * Rate of change of the Sun's mean longitude.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Daily motion of the Sun along the ecliptic.
     */
    LONGITUDE: 0.98564736 as DegreesPerJ2000DayTT, // Degrees per day

    /**
     * Rate of change of the Sun's mean anomaly.
     * @constant {DegreesPerDay}
     * @unit degrees/day
     * @description Daily change in anomaly.
     */
    ANOMALY: 0.98560028 as DegreesPerJ2000DayTT, // Degrees per day

    /**
     * Centurial rate of change of the Sun's mean longitude.
     * @constant {DegreesPerJ2000CenturyTT}
     * @unit degrees/century
     * @description Long-term motion per Julian century.
     */
    LONGITUDE_CENTURIAL: 36000.76982779 as DegreesPerJ2000CenturyTT, // Degrees per Julian century
  },

  /**
   * Coefficients for the equation of center.
   * @constant {[Degrees, Degrees, Degrees]}
   * @unit degrees
   * @description Terms used to compute the difference between mean and true anomaly.
   */
  EQUATION_OF_CENTER: [1.9148, 0.02, 0.0003] as [Degrees, Degrees, Degrees], // Coefficients in degrees

  /**
   * Refraction parameters for solar observations.
   * @constant {Object}
   */
  REFRACTION: {
    /**
     * Standard altitude threshold for solar refraction.
     * @constant {Degrees}
     * @unit degrees
     * @description Horizon threshold including refraction and solar semi-diameter.
     */
    STANDARD_ALTITUDE: -0.833 as Degrees, // Classic horizon threshold

    /**
     * Altitudes for twilight definitions.
     * @constant {Degrees[]}
     * @unit degrees
     * @description Solar altitudes for civil, nautical, and astronomical twilight.
     */
    TWILIGHTS: [-6, -12, -18] as Degrees[], // Civil, nautical, astronomical
  },
};
