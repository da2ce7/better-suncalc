/**
 * @file constraints/constants/earth.ts
 * @description Earth orientation, orbital, and atmospheric constants compliant with IAU/IERS standards.
 * Contains fundamental parameters for celestial mechanics, geodesy, and refraction modeling.
 * @see {@link https://itrf.ign.fr/en/solutions/ITRF2020} (ITRF2020 specifications)
 */

import {
  Arcminutes,
  Degrees,
  Degrees_Ecliptic,
  DegreesPerDay,
  DegreesPerJulianCentury,
  DegreesPerJulianCenturyCubed,
  DegreesPerJulianCenturySquared,
  DimensionlessRatio,
  GCRS_Gravity,
  JulianDaysDuration,
  Meters,
  MillisecondsPerJulianCentury,
  PerDegreeCelsius,
  PerHectopascal,
  SolarIrradiance,
  TerrestrialDaysSinceJulianEpoch,
} from "../brands";

// =========== Core Astronomical Constants ===========
/**
 * J2000 epoch reference in Terrestrial Time (TT) as Julian Day Number.
 * @example
 * // Corresponds to 2000-01-01T12:00:00 TT
 * const j2000 = 2451545.0 as TerrestrialDaysSinceJulianEpoch;
 * @see {@link https://www.iau.org/static/resolutions/IAU1991_French.pdf} (IAU Resolution A4)
 */
export const JULIAN_EPOCH_J2000 = 2451545.0 as TerrestrialDaysSinceJulianEpoch;

/**
 * Fundamental Earth parameters validated through space geodetic techniques.
 * @namespace EARTH
 */
export const EARTH = {
  /**
   * Seasonal astronomical events reference points.
   * @namespace SEASONAL_EVENTS
   */
  SEASONAL_EVENTS: {
    /**
     * Instant of March equinox in J2000 reference frame.
     * @remarks
     * UT1 datetime: 2000-03-20 07:35:23.3
     * Aligned with IAU 2006 precession model
     */
    VERNAL_EQUINOX_2000: 2451623.81597 as TerrestrialDaysSinceJulianEpoch,
  },

  /**
   * Earth's axial tilt parameters.
   * @namespace OBLIQUITY
   */
  OBLIQUITY: {
    /**
     * Mean obliquity at J2000 epoch (UU 2006 model).
     * @remarks
     * ε₀ = 23°26'21".448 ≡ 23.439291111111112°
     */
    J2000: 23.439291111111112 as Degrees,

    /**
     * Long-term obliquity change rate (La2010 solution).
     * @remarks
     * dε/dt = -0.0139694°/Julian century
     * @see {@link https://doi.org/10.1051/0004-6361/201016427} (Laskar 2011)
     */
    SECULAR_DELTA: -0.0139694 as DegreesPerJulianCentury,
  },

  /**
   * Precession components and rates.
   * @namespace PRECESSION
   */
  PRECESSION: {
    /**
     * Luni-solar precession component (Capitaine et al. 2003).
     * @remarks
     * p₁ = 1.396971°/Julian century
     * @see {@link https://doi.org/10.1051/0004-6361:20031539} (IAU 2000)
     */
    LUNI_SOLAR: 1.396971 as DegreesPerJulianCentury,

    /**
     * Planetary precession component (Capitaine et al. 2003).
     * @remarks
     * p₂ = 0.0001986°/Julian century
     */
    PLANETARY: 0.0001986 as DegreesPerJulianCentury,

    /**
     * Quadratic term in precession model.
     * @remarks
     * T² coefficient = 0.000387933°/Julian century²
     */
    T_SQUARED: 0.000387933 as DegreesPerJulianCenturySquared,
  },

  /**
   * Perihelion characteristics.
   * @namespace PERIHELION
   */
  PERIHELION: {
    /**
     * Ecliptic longitude of perihelion at J2000 (DE440).
     * @remarks
     * ϖ₀ = 102.93734808° ecliptic
     */
    LONGITUDE: 102.93734808 as Degrees_Ecliptic,

    T_CUBED_TERM: 0.000000487 as DegreesPerJulianCenturyCubed,

    /** Reference epoch for perihelion parameters */
    EPOCH: JULIAN_EPOCH_J2000,
  },

  /**
   * Orbital motion parameters.
   * @namespace ORBIT
   */
  ORBIT: {
    /**
     * Tropical year duration (Gregorian-2000 definition).
     * @remarks
     * 365.2421896698 days in Terrestrial Time
     */
    TROPICAL_YEAR: 365.2421896698 as JulianDaysDuration,

    /**
     * Orbital eccentricity (JPL DE440 ephemeris).
     * @remarks
     * e = 0.016708617 ±0.000000044
     */
    ECCENTRICITY: 0.016708617 as DimensionlessRatio,

    /**
     * Solar irradiance at 1 AU (TSIS-1 2023 measurement).
     * @remarks
     * S₀ = 1361.2 W/m² ±0.48
     */
    INSOLATION: 1361.22 as SolarIrradiance,
  },
};

/**
 * International Terrestrial Reference Frame 2020 parameters.
 * @namespace GEODETIC
 * @see {@link https://itrf.ign.fr/docs/site_itrf2020.pdf} (ITRF2020 technical note)
 */
export const GEODETIC = {
  /**
   * ITRF2020 ellipsoid parameters (IERS 2023 conventions).
   * @namespace ITRF2020
   */
  ITRF2020: {
    /** Semi-major axis (equatorial radius) */
    a: 6378136.6 as Meters,

    /** Flattening factor (1/f) */
    f: (1 / 298.25642) as DimensionlessRatio,

    /** Equatorial surface gravity */
    gravityEquator: 9.7803253359 as GCRS_Gravity,

    /** Polar surface gravity */
    gravityPole: 9.8321849378 as GCRS_Gravity,

    /** First eccentricity squared */
    e2: 0.0066943800229 as DimensionlessRatio,
  },
};

/**
 * Earth rotation and sidereal time parameters.
 * @namespace SIDEREAL
 * @see {@link https://www.iers.org/IERS/EN/Publications/TechnicalNotes/tn39.html} (IERS Conventions 2023)
 */
export const SIDEREAL = {
  /**
   * Greenwich Mean Sidereal Time (GMST) model.
   * @namespace GMST
   * @remarks
   * GMST = 280.46061837° + 360.98564736628606°·T + 0.000387933·T² - (T³/38710000)
   * where T is centuries since J2000
   */
  GMST: {
    /** Constant term (J2000 epoch) */
    BASE: 280.46061837 as Degrees,

    /** Linear coefficient (daily Earth rotation) */
    DRIFT_RATE: 360.98564736628606 as DegreesPerDay,

    /** Quadratic term */
    T_SQUARED_COEFF: 0.000387933 as DegreesPerJulianCenturySquared,

    /** Cubic term (heliocentric correction) */
    T_CUBED_TERM: (-1.0 / 38710000) as DegreesPerJulianCenturyCubed,
  },

  /**
   * Length of Day (LOD) secular change.
   * @remarks
   * ΔLOD = +1.7256 ms/Julian century in TT timescale
   * @see McCarthy & Seidelmann (2024) "Time: From Earth Rotation to Atomic Physics"
   */
  LOD_CHANGE: 1.7256 as MillisecondsPerJulianCentury,
};

/**
 * Atmospheric refraction models and parameters.
 * @namespace REFRACTION
 * @see {@link https://doi.org/10.1088/1361-6501/ab6d0a} (Bennett 2023)
 */
export const REFRACTION = {
  /**
   * Standard atmospheric refraction model (ICAO).
   * @namespace STANDARD
   * @remarks
   * Valid for 1013.25 hPa, 10°C, 0% humidity
   */
  STANDARD: {
    /** Horizon dip calculation threshold */
    HORIZON: -0.833375 as Degrees,

    /** Civil, nautical, and astronomical twilight thresholds */
    TWILIGHTS: [-6, -12, -18] as Degrees[],

    /** Mean lunar refraction at horizon */
    LUNAR: 0.628 as Degrees,
  },

  /**
   * Saundundsson's empirical refraction model.
   * @namespace SAEMUNDSSON
   * @remarks
   * R = 1.02' / tan(h + 10.3/(h + 5.11))
   * Valid for h > -5°
   */
  SAEMUNDSSON: {
    /** Minimum observable altitude */
    MIN_ALTITUDE: -5.0 as Degrees,

    /** Altitude adjustment numerator */
    ALTITUDE_OFFSET: 10.3 as Degrees,

    /** Altitude adjustment denominator */
    DENOMINATOR_OFFSET: 5.11 as Degrees,

    /** Refraction coefficient */
    COEFFICIENT_ARCMIN: 1.02 as Arcminutes,
  },

  /**
   * Adaptive refraction model (Bennett 2023).
   * @namespace BENNETT_ADAPTIVE
   * @remarks
   * R = (0.067235 + 0.00409215·ΔT) / tan(h + 7.31/(h + 4.4)) · P/1013.25
   * Valid for -3° ≤ h ≤ 90°
   */
  BENNETT_ADAPTIVE: {
    /** Base refraction coefficient */
    COEFF_A: 0.067235 as Arcminutes, // 4.0341 arcmin

    /** Low-altitude temperature correction (<5°) */
    LOW_ALT_COEFF: 0.001345 as PerDegreeCelsius,

    /** High-altitude temperature correction (>30°) */
    HIGH_ALT_COEFF: 0.000812 as PerDegreeCelsius,

    /** Pressure normalization factor */
    PRESSURE_SCALE: (1 / 1013.25) as PerHectopascal,
  },

  /**
   * Numerical integration parameters for refraction.
   * @namespace NUMINT
   */
  NUMINT: {
    /** Layer integration step size */
    STEP_SIZE: 0.0001 as Degrees,

    /** Maximum altitude convergence error */
    MAX_ALT_ERROR: 0.00001 as Degrees,
  },
};
