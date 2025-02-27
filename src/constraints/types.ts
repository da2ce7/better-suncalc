/**
 * @file constraints/types.ts
 * @description Branded types for unit-specific constants to ensure type safety and prevent unit mismatches.
 */

/**
 * Represents an angle in degrees.
 * @typedef {number & { readonly __brand: "Degrees" }} Degrees
 */
export type Degrees = number & { readonly __brand: "Degrees" };

/**
 * Represents a time interval in days.
 * @typedef {number & { readonly __brand: "Days" }} Days
 */
export type Days = number & { readonly __brand: "Days" };

/**
 * Represents a time interval in seconds.
 * @typedef {number & { __brand: "Seconds" }} Seconds
 */
export type Seconds = number & { readonly __brand: "Seconds" };

/**
 * Represents a time interval in milliseconds.
 * @typedef {number & { __brand: "Milliseconds" }} Milliseconds
 */
export type Milliseconds = number & { readonly __brand: "Milliseconds" };

/**
 * Represents a time interval in hours.
 * @typedef {number & { __brand: "Hours" }} Hours
 */
export type Hours = number & { readonly __brand: "Hours" };

/**
 * Represents a Julian Day number, a continuous count of days since the Julian epoch.
 * @typedef {number & { readonly __brand: "JulianDay" }} JulianDay
 */
export type JulianDay = number & { readonly __brand: "JulianDay" };

/**
 * Represents a rate of change in degrees per century squared.
 */
export type DegreesPerCenturySquared = number & {
  readonly __brand: "DegreesPerCenturySquared";
};

/**
 * Represents a distance in astronomical units (AU).
 * @typedef {number & { readonly __brand: "AU" }} AU
 */
export type AU = number & { readonly __brand: "AU" };

/**
 * Represents a rate of change in degrees per day.
 * @typedef {number & { readonly __brand: "DegreesPerDay" }} DegreesPerDay
 */
export type DegreesPerDay = number & { readonly __brand: "DegreesPerDay" };

/**
 * Represents a rate of change in degrees per century.
 * @typedef {number & { readonly __brand: "DegreesPerCentury" }} DegreesPerCentury
 */
export type DegreesPerCentury = number & {
  readonly __brand: "DegreesPerCentury";
};

/**
 * Represents a year in the Julian calendar (365.25 days).
 * @typedef {number & { readonly __brand: "JulianYear" }} JulianYear
 */
export type JulianYear = number & { readonly __brand: "JulianYear" };

/**
 * Represents Terrestrial Time (TT), a uniform time standard.
 * @typedef {number & { readonly __brand: "TT" }} TerrestrialTime
 */
export type TerrestrialTime = number & { readonly __brand: "TT" };

/**
 * Represents orbital parameters for celestial bodies.
 * @interface OrbitalParameters
 * @property {number} eccentricity - Eccentricity of the orbit (unitless).
 * @property {Degrees} inclination - Inclination of the orbit in degrees.
 * @property {AU} semiMajorAxis - Semi-major axis of the orbit in AU.
 */
export interface OrbitalParameters {
  eccentricity: number; // Unitless
  inclination: Degrees;
  semiMajorAxis: AU;
}

/**
 * Represents constants for celestial bodies.
 * @interface CelestialBodyConstants
 * @property {Object} epoch - Epoch-specific parameters.
 * @property {Degrees} epoch.meanLongitude - Mean longitude at the epoch.
 * @property {Degrees} epoch.meanAnomaly - Mean anomaly at the epoch.
 * @property {Object} motion - Motion rates.
 * @property {DegreesPerDay} motion.longitude - Rate of change of mean longitude.
 * @property {DegreesPerDay} motion.anomaly - Rate of change of mean anomaly.
 * @property {OrbitalParameters} orbit - Orbital parameters.
 */
export interface CelestialBodyConstants {
  epoch: {
    meanLongitude: Degrees;
    meanAnomaly: Degrees;
  };
  motion: {
    longitude: DegreesPerDay;
    anomaly: DegreesPerDay;
  };
  orbit: OrbitalParameters;
}
