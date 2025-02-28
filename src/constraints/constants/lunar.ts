/**
 * @file constraints/constants/lunar.ts
 * @description Constants related to the Moon's orbital and positional parameters with strict branding.
 * @module LunarConstants
 * @see {@link https://eclipse.gsfc.nasa.gov/LEcat5/LEpcycle.html} for eclipse cycle references
 * @see {@link https://ssd.jpl.nasa.gov/planets/eph_export.html} for JPL ephemeris data
 */

import {
  AstronomicalUnits,
  Degrees,
  DegreesPerDayTT,
  JulianDateTT,
  TerrestrialDays,
} from "../brands";

/**
 * Constants related to the Moon's orbital mechanics and positional astronomy
 * @constant {Object} LUNAR
 */
export const LUNAR = {
  /**
   * Parameters at the J2000 epoch (Terrestrial Time frame)
   * @constant {Object} EPOCH_J2000
   */
  EPOCH_J2000: {
    /**
     * Mean longitude of the Moon at J2000.0 (Earth's equatorial plane reference)
     * @constant {Degrees}
     * @unit degrees
     * @description Angle from vernal equinox along ecliptic to Moon's mean position
     */
    MEAN_LONGITUDE: 218.316_17 as Degrees,

    /**
     * Mean anomaly of the Moon (angular distance from perigee) at J2000.0
     * @constant {Degrees}
     * @unit degrees
     * @description Used in lunar equation calculations for true position
     */
    MEAN_ANOMALY: 134.962_92 as Degrees,

    /**
     * Mean argument of latitude (angle from ascending node) at J2000.0
     * @constant {Degrees}
     * @unit degrees
     * @description Essential for nodal regression and inclinational calculations
     */
    MEAN_ARG_LATITUDE: 93.271_91 as Degrees,
  },

  /**
   * Fundamental orbital motion rates (Terrestrial Time based)
   * @constant {Object} MOTION
   */
  MOTION: {
    /**
     * Rate of mean longitude change (complete precession cycle ≈ 8.85 years)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @description Accounts for orbital progression and apsidal precession
     */
    LONGITUDE: 13.176_396_420 as DegreesPerDayTT,

    /**
     * Mean anomaly rate (combines orbital motion and perigee advance)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @description Determines phase and eccentricity contributions
     */
    ANOMALY: 13.064_992_950 as DegreesPerDayTT,

    /**
     * Nodal regression rate (Draconic period ≈ 18.6 years)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @description Negative value would indicate retrograde motion
     */
    ARG_LATITUDE: 13.229_349_890 as DegreesPerDayTT,
  },

  /**
   * Orbital elements and physical parameters (J2000.0 Ecliptic)
   * @constant {Object} ORBIT
   */
  ORBIT: {
    /**
     * Semi-major axis of geocentric orbit (mean distance)
     * @constant {AstronomicalUnits}
     * @unit AU
     * @description Subject to +-6.5% variation from eccentricity and perturbations
     */
    SEMI_MAJOR_AXIS: 0.002_569_555_29 as AstronomicalUnits,

    /**
     * Orbital eccentricity (dimensionless)
     * @constant {number}
     * @unit unitless
     * @description Varies between ~0.026 and 0.077 due to solar perturbations
     */
    ECCENTRICITY: 0.0549_004,

    /**
     * Mean orbital inclination to ecliptic
     * @constant {Degrees}
     * @unit degrees
     * @description Okhotsimsky–Makem parameters account for secular changes
     */
    INCLINATION: 5.127_828 as Degrees,
  },

  /**
   * Observation and visibility thresholds
   * @constant {Object} VISIBILITY
   */
  VISIBILITY: {
    /**
     * Geometrical visibility threshold (altitude)
     * @constant {Degrees}
     * @unit degrees
     * @description Combines atmospheric refraction (34') and lunar semi-diameter (15')
     */
    ALTITUDE_THRESHOLD: 0.625 as Degrees,
  },

  /**
   * Periodic perturbation terms (Main Problem contributions)
   * @constant {Object} PERTURBATIONS
   */
  PERTURBATIONS: {
    /**
     * Evection longitude perturbation amplitude (solar gravitational effect)
     * @constant {Degrees}
     * @unit degrees
     * @description Largest periodic perturbation: C_{2,0} coefficient in Hill–Brown theory
     */
    EVECTION_LONGITUDE_AMPLITUDE: 1.273_733 as Degrees,
  },

  /**
   * Synodic phase characteristics
   * @constant {Object} PHASES
   */
  PHASES: {
    /**
     * Mean synodic month (New Moon to New Moon)
     * @constant {TerrestrialDays}
     * @unit days
     * @description Varies ±7h due to orbital eccentricity and solar perturbations
     */
    SYNODIC_MONTH: 29.530_588_853 as TerrestrialDays,

    /**
     * Reference New Moon epoch (J2000.0 cycle anchor)
     * @constant {JulianDateTT}
     * @unit Julian Date (TT)
     * @description 2000-01-06T18:14:00 TT - NASA DE431 ephemeris reference
     */
    REFERENCE_NEW_MOON: 2_451_549.259_027_777_7 as JulianDateTT,
  },
} as const;
