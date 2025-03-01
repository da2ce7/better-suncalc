/**
 * @file constraints/constants/lunar.ts
 * @description Constants related to the Moon's orbital and positional parameters with strict branding.
 * @module LunarConstants
 * @see {@link https://ssd.jpl.nasa.gov/planets/eph_export.html} for JPL ephemeris data
 */

import {
  Degrees,
  Degrees_Ecliptic,
  DegreesPerDayTT,
  DimensionlessRatio,
  JulianDaysDuration,
  LunarDistances,
  LunarLibrationAmplitude,
  PerJulianCentury,
  SelenographicLatitude,
  TerrestrialDaysSinceJulianEpoch,
} from "../brands";

/**
 * Lunar constants compliant with DE440 ephemeris and IAU SOFA models
 * @constant {Object} LUNAR
 */
export const LUNAR = {
  /**
   * Parameters at the J2000.0 epoch (ICRS reference frame)
   * @constant {Object} EPOCH_J2000
   */
  EPOCH_J2000: {
    /**
     * Mean longitude of the Moon (J2000.0 ecliptic reference)
     * @constant {Degrees}
     * @unit degrees
     * @description Ecliptic longitude measured from J2000 vernal equinox
     * @reference Simon et al. (1994) lunar theory
     */
    MEAN_LONGITUDE: 218.316_17 as Degrees_Ecliptic,

    /**
     * Mean anomaly of the Moon (angular distance from perigee)
     * @constant {Degrees}
     * @unit degrees
     * @description Ecliptic-referenced mean anomaly (DE440 convention)
     */
    MEAN_ANOMALY: 134.962_92 as Degrees_Ecliptic,

    /**
     * Argument of latitude (angular distance from ascending node)
     * @constant {Degrees}
     * @unit degrees
     * @description Includes post-Newcomb nodal precession model
     */
    MEAN_ARG_LATITUDE: 93.271_91 as Degrees_Ecliptic,
  },

  /**
   * Main term orbital motion rates (IAU 2006 precession model)
   * @constant {Object} MOTION
   */
  MOTION: {
    /**
     * Longitude progression rate including precession (L& terms)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @error ±0.00000002 °/day (DE440 uncertainty)
     */
    LONGITUDE: 13.176_396_420 as DegreesPerDayTT,

    /**
     * Mean anomaly rate (mainly eccentricity component)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @description Includes third-body perturbations from Sun
     */
    ANOMALY: 13.064_992_950 as DegreesPerDayTT,

    /**
     * Nodal regression rate (Draconic precession)
     * @constant {DegreesPerDayTT}
     * @unit degrees/TT day
     * @negative
     * @description Negative value indicates retrograde motion
     */
    NODE_REG_RATE: -0.053_052_120 as DegreesPerDayTT,
  },

  /**
   * Reference orbital elements (MEAN elements at J2000.0)
   * @constant {Object} ORBIT
   */
  ORBIT: {
    /**
     * Geocentric semimajor axis (mean value)
     * @constant {LunarDistances}
     * @unit Lunar Distances (LD)
     * @precision 9 significant figures (DE440 measurement)
     * @description
     * - Exact value: 1.00000257 LD (DE440 reference)
     * - Annual variation amplitude: ≈0.065 LD (~25,000 km)
     */
    SEMI_MAJOR_AXIS: 1.000_002_57 as LunarDistances, // Changed from AU

    /**
     * Complex eccentricity component (mean e ≈ 0.0549)
     * @constant {Object}
     * @property {number} e - Mean eccentricity
     * @property {number} de/dt - Eccentricity rate (century⁻¹)
     */
    ECCENTRICITY: {
      e: 0.0549_004 as DimensionlessRatio,
      RATE: 0.004_642 as PerJulianCentury,
    },
  },

  /**
   * Synodic characteristics and period relations
   * @constant {Object} PHASES
   */
  PHASES: {
    /**
     * Synodic month duration (mean New Moon to New Moon)
     * @constant {JulianDay}
     * @unit days
     * @description DE440 value for 2000-2100 timeframe
     * @variation ±0.3 days from planetary perturbations
     */
    SYNODIC_MONTH: 29.530_588_860_9 as JulianDaysDuration,

    /**
     * Fundamental New Moon reference epoch (J2000.0 cycle)
     * @constant {TerrestrialDaysSinceJulianEpoch}
     * @unit Julian Date (TT)
     * @description 2000-01-06T18:14:00 TT (DE431 initial condition)
     */
    REFERENCE_NEW_MOON:
      2_451_549.259_027_777_7 as TerrestrialDaysSinceJulianEpoch,
  },

  /**
   * Observation geometry thresholds
   * @constant {Object} VISIBILITY
   */
  VISIBILITY: {
    /**
     * Observability altitude threshold
     * @constant {Degrees}
     * @unit degrees
     * @description Combines atmospheric extinction (≈34') + lunar disk (≈29')
     */
    ALTITUDE_THRESHOLD: 1.05 as Degrees,
  },

  /**
   * Major perturbation amplitudes (main problem solutions)
   * @constant {Object} PERTURBATIONS
   */
  PERTURBATIONS: {
    /**
     * Evection coefficient (lunisolar gravitational resonance)
     * @constant {Degrees}
     * @unit degrees
     * @description Largest libration contribution (≈1.27° amplitude)
     */
    EVECTION: 1.273_733 as Degrees,

    /**
     * Annual equation coefficient (solar mean anomaly coupling)
     * @constant {Degrees}
     * @unit degrees
     */
    ANNUAL_EQUATION: 0.185_596 as Degrees,
  },

  /**
   * Physical libration parameters defining the Moon's apparent oscillatory motion
   * @namespace LIBRATION
   * @description Contains constants related to the Moon's physical and optical libration,
   * which enables Earth observers to see ≈59% of the lunar surface over time.
   *
   */
  LIBRATION: {
    /**
     * Maximum angular amplitude of diurnal libration (observer-Moon geometry)
     * @constant {LunarLibrationAmplitude}
     * @unit degrees
     * @value 6.8
     * @description Highest possible libration angle enabling extreme limb observations.
     * Combines optical and physical libration components.
     * @example
     * if(currentLibration > 6.5 as LunarLibrationAmplitude) observeRareTerrain();
     */
    MAX_DIURNAL: 6.8 as LunarLibrationAmplitude,

    /**
     * Valid latitude range for selenographic coordinate system
     * @constant {SelenographicLatitude[]}
     * @unit degrees
     * @value [-90, 90]
     * @description Full extent of lunar latitude measurements under IAU conventions.
     * - First element: Minimum latitude (South Pole: -90°)
     * - Second element: Maximum latitude (North Pole: +90°)
     * @example
     * const polarCraterLat = 89.7 as SelenographicLatitude; // Shackleton Crater
     */
    LATITUDE_RANGE: [-90 as SelenographicLatitude, 90 as SelenographicLatitude],
  },
} as const;
