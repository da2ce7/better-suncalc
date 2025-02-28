/**
 * @file constraints/brands/angular-rates.ts
 * @module angular-rates
 * @description Branded type definitions for angular velocities and accelerations.
 *
 * Provides dimensional safety for rotational rates (angle/time) with timebases ranging
 * from seconds to millennia, ensuring correct dimensional analysis in long-term celestial
 * mechanics calculations.
 */

import { Brand } from "../types";

// =========== Core Rotational Kinematics =========== //

/**
 * Represents angular rate in degrees per second.
 * @example
 * const turretRotation: DegreesPerSecond = 90 as DegreesPerSecond; // 90°/s = Full rotation in 4s
 */
export type DegreesPerSecond = Brand<number, "DegreesPerSecond">;

/**
 * Represents angular rate in degrees per hour.
 * @example
 * const earthRotation: DegreesPerHour = 15.041 as DegreesPerHour; // Sidereal rate
 */
export type DegreesPerHour = Brand<number, "DegreesPerHour">;

/**
 * Represents angular acceleration in degrees per second squared.
 * @example
 * const antennaSlewAccel: DegreesPerSecondSquared = 3 as DegreesPerSecondSquared; // 3°/s²
 */
export type DegreesPerSecondSquared = Brand<number, "DegreesPerSecondSquared">;

// =========== Long-Term Celestial Rates =========== //

/**
 * Represents angular rate in degrees per Julian year (365.25 days).
 * @example
 * const axialPrecession: DegreesPerJulianYear = 0.01397 as DegreesPerJulianYear;
 */
export type DegreesPerJulianYear = Brand<number, "DegreesPerJulianYear">;

/**
 * Represents angular rate in degrees per Julian century (36,525 days).
 * @example
 * const earthObliquityRate: DegreesPerJulianCentury = -0.013 as DegreesPerJulianCentury; // Secular obliquity change
 */
export type DegreesPerJulianCentury = Brand<number, "DegreesPerJulianCentury">;

/**
 * Represents angular acceleration in squared Julian century timebase.
 * @unit deg/cty²
 * @example
 * const longTermPrecession: DegreesPerJulianCenturySquared = 0.000387933 as DegreesPerJulianCenturySquared; // Laskar's T² term
 */
export type DegreesPerJulianCenturySquared = Brand<
  number,
  "DegreesPerJulianCenturySquared"
>;

// =========== High Precision Astrometry =========== //

/**
 * Represents angular rate in arcseconds per year (proper motion).
 * @example
 * const alphaCenProperMotion: ArcsecondsPerYear = 3.692 as ArcsecondsPerYear; // HIP 71683 proper motion
 */
export type ArcsecondsPerYear = Brand<number, "ArcsecondsPerYear">;

/**
 * Represents angular rate in milliarcseconds per year (GAIA precision).
 * @example
 * const gaiaPrecision: MilliarcsecondsPerYear = 0.027 as MilliarcsecondsPerYear; // GAIA DR3 accuracy
 */
export type MilliarcsecondsPerYear = Brand<number, "MilliarcsecondsPerYear">;

/**
 * Represents angular rate in microarcseconds per year (VLBI baseline).
 * @example
 * const quasarApparentMotion: MicroarcsecondsPerYear = 50 as MicroarcsecondsPerYear; // Jet component motion
 */
export type MicroarcsecondsPerYear = Brand<number, "MicroarcsecondsPerYear">;

// =========== Specialized Rotational Mechanics =========== //

/**
 * Represents angular rate in radians per Terrestrial Time second.
 * @example
 * const pulsarRotation: RadiansPerTTSecond = 128.5 as RadiansPerTTSecond; // J1748-2446ad (716 Hz)
 */
export type RadiansPerTTSecond = Brand<number, "RadiansPerTTSecond">;

/**
 * Represents rotation rate in radians per sidereal day.
 * @example
 * const lageosSatellite: RadiansPerSiderealDay = 207.27 as RadiansPerSiderealDay; // Earth's rotation rate
 */
export type RadiansPerSiderealDay = Brand<number, "RadiansPerSiderealDay">;

/**
 * Represents relativistic precession (arcseconds/orbital period).
 * @example
 * const mercuryPerihelion: ArcsecondsPerOrbit = 43.0 as ArcsecondsPerOrbit; // GR prediction
 */
export type ArcsecondsPerOrbit = Brand<number, "ArcsecondsPerOrbit">;

// =========== Observational Kinematics =========== //

/**
 * Represents position angle change rate in binaries, measured in degrees per
 * mean solar day (86,400 seconds in UT1/UTC time scales).
 * For other day types, see DegreesPerDayTT or DegreesPerSiderealDay.
 * @example
 * const alphaCentauriPAChange: DegreesPerDay = 0.028 as DegreesPerDay;
 */
export type DegreesPerDay = Brand<number, "DegreesPerDay">;

/**
 * Represents angular rate in TT days (86,400 Terrestrial Time seconds),
 * used for dynamic astronomical calculations requiring precise timekeeping.
 * @example
 * const planetaryEphemerisChange: DegreesPerDayTT = 0.9856 as DegreesPerDayTT;
 */
export type DegreesPerDayTT = Brand<number, "DegreesPerDayTT">;

/**
 * Represents angular rate in Earth sidereal days (~86,164.0916 seconds),
 * matching Earth's actual rotation period relative to distant stars.
 * @example
 * const satelliteNodalRegress: DegreesPerSiderealDay = 4.0 as DegreesPerSiderealDay;
 */
export type DegreesPerSiderealDay = Brand<number, "DegreesPerSiderealDay">;

// =========== Context-Specific Rate Types =========== //

/**
 * Represents ecliptic longitude rate (radians per Julian century).
 * @example
 * const moonMeanLongitude: EclipticLongitudeRate = 0.229 as EclipticLongitudeRate; // ELP-2000 coefficient
 */
export type EclipticLongitudeRate = Brand<number, "EclipticLongitudeRate">;

/**
 * Represents mechanical rotation rate (rotational machinery).
 * @example
 * const centrifugeSpeed: RevolutionsPerMinute = 12_000 as RevolutionsPerMinute; // High-G simulation
 */
export type RevolutionsPerMinute = Brand<number, "RevolutionsPerMinute">;
