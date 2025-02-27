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
 * Represents an angle in radians.
 * @typedef {number & { readonly __brand: "Radians" }} Radians
 */
export type Radians = number & { readonly __brand: "Radians" };

/**
 * Represents a time interval in milliseconds.
 * @typedef {number & { __brand: "Milliseconds" }} Milliseconds
 */
export type Milliseconds = number & { readonly __brand: "Milliseconds" };

/**
 * Represents a time interval in seconds.
 * @typedef {number & { __brand: "Seconds" }} Seconds
 */
export type Seconds = number & { readonly __brand: "Seconds" };

/**
 * Represents a time interval in hours.
 * @typedef {number & { __brand: "Hours" }} Hours
 */
export type Hours = number & { readonly __brand: "Hours" };

/**
 * Represents a time interval in days.
 * @typedef {number & { readonly __brand: "Days" }} Days
 */
export type Days = number & { readonly __brand: "Days" };

/**
 * Represents a count of Julian Days in Terrestrial Time (TT) since J0.
 * @typedef {number & { readonly __brand: "JulianDayTT" }} JulianDayTT
 */
export type JulianDayTT = number & { readonly __brand: "JulianDayTT" };

/**
 * Represents a count of Julian Days in Universal Time (UT1) since J0.
 * @typedef {number & { readonly __brand: "JulianDayUT1" }} JulianDayUT1
 */
export type JulianDayUT1 = number & { readonly __brand: "JulianDayUT1" };

/**
 * Represents a count of Julian Years in Terrestrial Time (TT) since J0.
 * @typedef {number & { readonly __brand: "JulianYearTT" }} JulianYearTT
 */
export type JulianYearTT = number & { readonly __brand: "JulianYearTT" };

/**
 * Represents a count of Julian Years in Universal Time (UT1) since J0.
 * @typedef {number & { readonly __brand: "JulianYearUT1" }} JulianYearUT1
 */
export type JulianYearUT1 = number & { readonly __brand: "JulianYearUT1" };

/**
 * Represents a count of Julian Centuries in Terrestrial Time (TT) since J0.
 * @typedef {number & { readonly __brand: "JulianCenturyTT" }} JulianCenturyTT
 */
export type JulianCenturyTT = number & { readonly __brand: "JulianCenturyTT" };

/**
 * Represents a count of Julian Centuries in Universal Time (UT1) since J0.
 * @typedef {number & { readonly __brand: "JulianCenturyUT1" }} JulianCenturyUT1
 */
export type JulianCenturyUT1 = number & {
  readonly __brand: "JulianCenturyUT1";
};

/**
 * Represents a count of Julian Days in Terrestrial Time (TT) since J2000.
 * @typedef {number & { readonly __brand: "J2000DayTT" }} J2000DayTT
 */
export type J2000DayTT = number & { readonly __brand: "J2000DayTT" };

/**
 * Represents a count of Julian Days in Universal Time (UT1) since J2000.
 * @typedef {number & { readonly __brand: "J2000DayUT1" }} J2000DayUT1
 */
export type J2000DayUT1 = number & { readonly __brand: "J2000DayUT1" };

/**
 * Represents a count of Julian Years in Terrestrial Time (TT) since J2000.
 * @typedef {number & { readonly __brand: "J2000YearTT" }} J2000YearTT
 */
export type J2000YearTT = number & { readonly __brand: "J2000YearTT" };

/**
 * Represents a count of Julian Years in Universal Time (UT1) since J2000.
 * @typedef {number & { readonly __brand: "J2000YearUT1" }} J2000YearUT1
 */
export type J2000YearUT1 = number & { readonly __brand: "J2000YearUT1" };

/**
 * Represents a count of Julian Centuries in Terrestrial Time (TT) since J2000.
 * @typedef {number & { readonly __brand: "J2000CenturyTT" }} J2000CenturyTT
 */
export type J2000CenturyTT = number & { readonly __brand: "J2000CenturyTT" };

/**
 * Represents a count of Julian Centuries in Universal Time (UT1) since J2000.
 * @typedef {number & { readonly __brand: "J2000CenturyUT1" }} J2000CenturyUT1
 */
export type J2000CenturyUT1 = number & {
  readonly __brand: "J2000CenturyUT1";
};

/**
 * Represents a rate of change in degrees per Julian Centuries in Terrestrial Time (TT) since J2000.
 */
export type DegreesPerJ2000CenturyTT_Squared = number & {
  readonly __brand: "DegreesPerJ2000CenturyTT_Squared";
};

/**
 * Represents a rate of change in degrees per Julian Centuries in Universal Time (UT1) since J0.
 */
export type DegreesPerJulianCenturyUT1_Squared = number & {
  readonly __brand: "DegreesPerJulianCenturyUT1_Squared";
};

/**
 * Represents a distance in Kilometers.
 * @typedef {number & { readonly __brand: "Kilometers" }} Kilometers
 */
export type Kilometers = number & { readonly __brand: "Kilometers" };

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
 * Represents a rate of change in degrees per Julian Centuries in Terrestrial Time (TT) since J2000.
 * @typedef {number & { readonly __brand: "DegreesPerJ2000CenturyTT" }} DegreesPerJ2000CenturyTT
 */
export type DegreesPerJ2000CenturyTT = number & {
  readonly __brand: "DegreesPerJ2000CenturyTT";
};

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
