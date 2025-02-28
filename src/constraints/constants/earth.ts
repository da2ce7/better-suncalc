/**
 * @file constraints/constants/earth.ts
 * @description Constants related to Earth's orientation, orbit, sidereal time, and atmospheric refraction models.
 */

import {
  Degrees,
  DegreesPerDay,
  DegreesPerJulianCentury,
  DegreesPerJulianCenturySquared,
  GCRS_Gravity,
  Meters,
  MillisecondsPerJulianCentury,
  SolarIrradiance,
} from "../brands";
import { JULIAN_EPOCH_J2000 } from "./time";

/**
 * =============== Earth Orientation and Orbital Parameters ================
 * Contains orbital mechanics constants and seasonal references.
 */
export const EARTH = {
  /** Seasonal reference points and orbital characteristics */
  SEASONAL_EVENTS: {
    /**
     * Reference vernal equinox (March equinox) near J2000 epoch.
     * @constant JulianDateTT
     */
    VERNAL_EQUINOX_2000: 2451630.306 as JulianDateTT,
  },

  /** Earth's axial tilt characteristics */
  OBLIQUITY: {
    /**
     * J2000 obliquity of the ecliptic (IAU 2006 model).
     * @constant Degrees
     * @unit Degrees
     * @see {@link https://doi.org/10.1017/S1743921305003148}
     */
    J2000: 23.4392911 as Degrees,

    /**
     * Long-term obliquity change rate from Laskar (1986) model.
     * @constant DegreesPerJulianCentury
     * @unit Arcseconds/Year (converted to Degrees/JulianCentury)
     */
    SECULAR_DELTA: -0.013 as DegreesPerJulianCentury,
  },

  /** Earth's axial precession parameters */
  PRECESSION: {
    /**
     * General precession rate in longitude (PA0).
     * @constant DegreesPerJulianCentury
     * @unit Degrees/JulianCentury
     */
    RATE: 1.3972 as DegreesPerJulianCentury,

    /**
     * Quadratic coefficient for precession model (T² term).
     * @constant DegreesPerJulianCenturySquared
     */
    T_SQUARED: 0.000387933 as DegreesPerJulianCenturySquared,
  },

  /** Earth's perihelion characteristics */
  PERIHELION: {
    /**
     * Perihelion longitude relative to J2000 ecliptic.
     * @constant Degrees
     */
    LONGITUDE: 102.9372 as Degrees,

    /** Reference epoch for perihelion longitude (J2000) */
    EPOCH: JULIAN_EPOCH_J2000,
  },

  /** Earth's orbital characteristics */
  ORBIT: {
    /**
     * Duration of tropical year in mean solar days.
     * @constant TerrestrialDays
     */
    TROPICAL_YEAR: 365.2422 as TerrestrialDays,

    /** Eccentricity of Earth's orbit (dimensionless) */
    ECCENTRICITY: 0.0167086,

    /**
     * Solar irradiance at 1 Astronomical Unit (Earth's orbit).
     * @constant SolarIrradiance
     * @unit W/m²
     */
    INSOLATION: 1361.0 as SolarIrradiance,
  },
};

/**
 * ================ Geodetic Parameters ================
 * World Geodetic System 1984 (WGS84) ellipsoid values.
 */
export const GEODETIC = {
  WGS84: {
    /** Semi-major axis (equatorial radius) in meters. @unit Meters */
    a: 6378137.0 as Meters,

    /** Flattening factor (1/f) */
    f: 1 / 298.257223563,

    /** Theoretical gravity at equator. @unit m/s² */
    gravityEquator: 9.7803267714 as GCRS_Gravity,

    /** Theoretical gravity at poles. @unit m/s² */
    gravityPole: 9.8321863685 as GCRS_Gravity,

    /** Square of ellipsoid eccentricity. @constant */
    e2: 0.00669437999014,

    /** Gravity formula coefficient (normalization factor). @constant */
    gravityCoefficientKg: 0.00193185138639,
  },
};

/**
 * ================ Sidereal Time and Earth Rotation =================
 * Constants for sidereal time calculations and Earth rotation models.
 */
export const SIDEREAL = {
  /** Greenwich Mean Sidereal Time (GMST) model parameters */
  GMST: {
    /** Base offset for GMST at J2000. @constant Degrees */
    BASE: 280.46061837 as Degrees,

    /** Linear drift rate of GMST. @unit Degrees/Day */
    DRIFT_RATE: 360.98564736628 as DegreesPerDay,

    /** Quadratic term coefficient for GMST. @constant */
    T_SQUARED_COEFF: 0.000387933 as DegreesPerJulianCenturySquared,

    /** Cubed term denominator for GMST expansion. @constant */
    T_CUBED_DIVISOR: 38710000,
  },

  /**
   * Secular change in Earth's Length of Day (LOD).
   * @constant MillisecondsPerJulianCentury
   * @unit ms/JulianCentury
   */
  LOD_CHANGE: 1.8 as MillisecondsPerJulianCentury,
};

/**
 * =============== Atmospheric Refraction Models ================
 * Refraction correction models for astronomical observations.
 */
export const REFRACTION = {
  /** Standard atmospheric refraction constants */
  STANDARD: {
    /** Astronomical horizon definition (solar altitude). @unit Degrees */
    HORIZON: -0.833 as Degrees,

    /** Common twilight thresholds (civil, nautical, astronomical). @unit Degrees */
    TWILIGHTS: [-6, -12, -18] as Degrees[],

    /** Lunar refraction adjustment at horizon. @unit Degrees */
    LUNAR: 0.625 as Degrees,
  },

  /** Saemundsson's empirical refraction model parameters */
  SAEMUNDSSON: {
    /** Minimum valid altitude for model application. @unit Degrees */
    MIN_ALTITUDE: -0.83 as Degrees,

    /** Refraction coefficient scaling factor. @constant */
    COEFFICIENT: 0.017,

    /** Altitude-dependent offset term. @unit Degrees */
    ALTITUDE_OFFSET: 10.3 as Degrees,

    /** Denominator offset for formula stability. @constant */
    DENOMINATOR_OFFSET: 5.11,
  },
};
