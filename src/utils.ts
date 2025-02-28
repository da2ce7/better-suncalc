/**
 * @file utils.ts
 * @module utils
 * @description Shared functions for celestial calculations, time conversions, numerical methods, and event detection.
 * Includes documentation of key assumptions and limitations for maintainability.
 *
 * @notes
 * - Angular units are explicitly noted in function parameters (degrees or radians).
 * - Time-based calculations assume JD TT unless otherwise stated.
 * - Numerical methods include stability thresholds to handle floating-point edge cases.
 */

import { EARTH, REFRACTION } from "./constraints/earth";
import { NUMERICAL, TAU } from "./constraints/math";
import {
  DAYS_PER_JULIAN_CENTURY,
  JULIAN_EPOCH_J2000,
} from "./constraints/time";
import {
  AU,
  Days,
  Degrees,
  J2000CenturyTT,
  J2000DayTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import { computeHourAngleAtRef } from "./transits";

/** ================== Type and Interface Definitions ================== */

/**
 * Represents the sun's position at a specific time and location.
 * @typedef {Object} PositionData
 * @property {Radians} azimuth - Azimuth angle in radians (clockwise from true north).
 * @property {Radians} altitude - Altitude angle in radians above horizon (includes refraction).
 */
export type PositionData = {
  azimuth: Radians;
  altitude: Radians;
};

/**
 * Represents the celestial coordinates of an object (e.g., moon or sun).
 */
export type CelestialCoordinates = {
  rightAscension: Radians;
  declination: Radians;
  distance: AU;
  eclipticLongitude?: Radians;
  eclipticLatitude?: Radians;
};

/**
 * Event detection configuration for altitude crossing search.
 * @interface EventWindow
 */
export interface EventWindow {
  start: JulianDayTT;
  end: JulianDayTT;
  evaluator: (time: JulianDayTT) => number;
  threshold: number;
  windowSize?: Days;
}

/**
 * Configuration for numerical root refinement.
 * @typedef {Object} RefinementConfig
 */
export type RefinementConfig = {
  stepSize: number; // Step size for derivative calculation
  convergenceThreshold: number; // Threshold for convergence
  maxStep: number; // Maximum allowed step size per iteration
  maxIterationSteps: number; // Maximum number of iterations
  floatingPointEpsilon: number;
};

/**
 * Default refinement parameters for numerical methods.
 * @constant {RefinementConfig}
 */
export const DEFAULT_REFINEMENT: RefinementConfig = {
  stepSize: NUMERICAL.CALCULATION.DERIVATIVE_STEP_DAYS as number, // e.g., 0.001
  convergenceThreshold: NUMERICAL.ITERATION.CONVERGENCE_THRESHOLD as number, // e.g., 1e-8
  maxStep: 1, // Generic max step
  maxIterationSteps: NUMERICAL.ITERATION.MAX, // e.g., 100
  floatingPointEpsilon: NUMERICAL.EPSILON.FLOATING_POINT_DAYS as number, // // ~69μs
};

/** ================== Math Conversion Utilities ================== */

/**
 * Converts a value from degrees to radians.
 * @param degrees - The value in degrees.
 * @returns The equivalent value in radians.
 */
export function degreesToRadians(degrees: Degrees): Radians {
  return (degrees * (Math.PI / 180)) as Radians;
}

/**
 * Converts a value from radians to degrees.
 * @param radians - The value in radians.
 * @returns The equivalent value in degrees.
 */
export function radiansToDegrees(radians: Radians): Degrees {
  return (radians * (180 / Math.PI)) as Degrees;
}

/** ================== Time Conversion Utilities ================== */

// Utility functions for operations with branded types
/**
 * Adds a number of days to a Julian Day TT value.
 * @param time - The base Julian Day TT
 * @param time_length - The number of days to add
 * @returns The resulting Julian Day TT
 */
export function addDaysToJD(time: JulianDayTT, time_length: Days): JulianDayTT {
  return ((time as number) + time_length) as number as JulianDayTT;
}

/**
 * Subtracts a number of days to a Julian Day TT value.
 * @param time - The base Julian Day TT
 * @param time_length - The number of days to subtract
 * @returns The resulting Julian Day TT
 */
export function subtractDaysFromJD(
  time: JulianDayTT,
  time_length: Days,
): JulianDayTT {
  return ((time as number) - time_length) as number as JulianDayTT;
}

/**
 * Subtracts one Julian Day TT from another to get the difference in days.
 * @param time1 - The first Julian Day TT
 * @param time2 - The second Julian Day TT to subtract
 * @returns The difference in days
 */
export function subtractJDs(time1: JulianDayTT, time2: JulianDayTT): Days {
  return ((time1 as number) - time2) as number as Days;
}

/**
 * Converts a Julian Day in Terrestrial Time to the number of days since the J2000 epoch.
 * @param julianDay - The Julian Day in Terrestrial Time (TT).
 * @returns The number of days since the J2000 epoch (January 1, 2000, 12:00 TT).
 */
export function julianDayToJ2000Day(time: JulianDayTT): J2000DayTT {
  return (time - JULIAN_EPOCH_J2000) as J2000DayTT;
}

/**
 * Converts the number of days since the J2000 epoch to a Julian Day in Terrestrial Time.
 * @param j2000Day - The number of days since the J2000 epoch (January 1, 2000, 12:00 TT).
 * @returns The corresponding Julian Day in Terrestrial Time (TT).
 */
export function j2000DayToJulianDay(time: J2000DayTT): JulianDayTT {
  return (time + JULIAN_EPOCH_J2000) as JulianDayTT;
}

/**
 * Calculates the number of Julian centuries since the J2000 epoch.
 * @param {JulianDayTT} time - Julian day in TT.
 * @returns {J2000CenturyTT} Number of Julian centuries since J2000.
 */
export function getJulianCenturiesSinceJ2000(
  time: JulianDayTT,
): J2000CenturyTT {
  return ((time - JULIAN_EPOCH_J2000) /
    DAYS_PER_JULIAN_CENTURY) as J2000CenturyTT;
}

/** ================== Geographic Coordinate Conversions ================== */

/**
 * Converts geographic longitude to radians (west-positive).
 * @param {Degrees} longitude - Longitude in degrees (-180 to 180, E-positive).
 * @returns {Radians} Longitude in radians (-π to π, W-positive).
 */
export function longitudeToRadWest(longitude: Degrees): Radians {
  return degreesToRadians(-longitude as Degrees);
}

/**
 * Converts geographic latitude to radians.
 * @param {Degrees} latitude - Latitude in degrees (-90 to 90).
 * @returns {Radians} Latitude in radians (-π/2 to π/2).
 */
export function latitudeToRad(latitude: Degrees): Radians {
  return degreesToRadians(latitude);
}

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates geometric altitude angle (no refraction).
 * @param {Radians} hourAngle - Hour angle in radians.
 * @param {Radians} latitude - Latitude in radians.
 * @param {Radians} declination - Declination in radians.
 * @returns {Radians} Altitude in radians.
 */
export function altitude(
  hourAngle: Radians,
  latitude: Radians,
  declination: Radians,
): Radians {
  return Math.asin(
    Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
  ) as Radians;
}

/**
 * Calculates azimuth angle for a celestial object.
 * @param {Radians} hourAngle - Hour angle in radians.
 * @param {Radians} latitude - Latitude in radians.
 * @param {Radians} declination - Declination in radians.
 * @returns {Radians} Azimuth in radians (0 at north, clockwise).
 */
export function azimuth(
  hourAngle: Radians,
  latitude: Radians,
  declination: Radians,
): Radians {
  return Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latitude) -
      Math.tan(declination) * Math.cos(latitude),
  ) as Radians;
}

/**
 * Calculates observed celestial position with refraction.
 * @param {JulianDayTT} time - Julian day in TT.
 * @param {Degrees} latitude - Latitude in degrees.
 * @param {Degrees} longitude - Longitude in degrees.
 * @param {(jd: JulianDayTT) => CelestialCoordinates} coordFn - Coordinate function.
 * @returns {PositionData} Azimuth and altitude.
 */
export function calculateCelestialPosition(
  time: JulianDayTT,
  latitude: Degrees,
  longitude: Degrees,
  coordFn: (time: JulianDayTT) => CelestialCoordinates,
): PositionData {
  const longitudeRadWest: Radians = longitudeToRadWest(longitude);
  const latitudeRad: Radians = latitudeToRad(latitude);
  const coordinates = coordFn(time);
  const hourAngleRad: Radians = computeHourAngleAtRef(
    time,
    longitudeRadWest,
    coordinates.rightAscension,
  );
  const geometricAltitudeRad: Radians = altitude(
    hourAngleRad,
    latitudeRad,
    coordinates.declination,
  );
  return {
    azimuth: azimuth(hourAngleRad, latitudeRad, coordinates.declination),
    altitude: (geometricAltitudeRad +
      astroRefraction(geometricAltitudeRad)) as Radians,
  };
}

/**
 * Calculates the true obliquity of the ecliptic.
 * @param {J2000CenturyTT} time - Julian centuries since J2000.
 * @returns {Radians} Obliquity in radians.
 */
export function calculateTrueObliquity(T: J2000CenturyTT): Radians {
  return degreesToRadians(
    (EARTH.OBLIQUITY_J2000 + EARTH.OBLIQUITY_DRIFT.LINEAR_RATE * T) as Degrees,
  );
}

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param eclipticLongitude (λ) - Ecliptic longitude in radians.
 * @param eclipticLatitude (β) - Ecliptic latitude in radians.
 * @param obliquity (ε) - Obliquity in radians.
 * @returns Right ascension in radians.
 */
export function getRightAscension(
  eclipticLongitude: Radians,
  eclipticLatitude: Radians,
  obliquity: Radians,
): Radians {
  const x =
    Math.sin(eclipticLongitude) * Math.cos(obliquity) -
    Math.tan(eclipticLatitude) * Math.sin(obliquity);
  const y = Math.cos(eclipticLongitude);
  const ra = Math.atan2(x, y);
  return ((ra < 0 ? ra + TAU : ra) % TAU) as Radians;
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param eclipticLongitude (λ) - Ecliptic longitude in radians.
 * @param eclipticLatitude (β) - Ecliptic latitude in radians.
 * @param obliquity (ε) - Obliquity in radians.
 * @returns Declination in radians.
 */
export function getDeclination(
  eclipticLongitude: Radians,
  eclipticLatitude: Radians,
  obliquity: Radians,
): Radians {
  return Math.asin(
    Math.sin(eclipticLatitude) * Math.cos(obliquity) +
      Math.cos(eclipticLatitude) *
        Math.sin(obliquity) *
        Math.sin(eclipticLongitude),
  ) as Radians;
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model for altitude correction.
 * @param {Radians} geometricAltitude - Geometric altitude in radians.
 * @returns {Radians} Refraction adjustment in radians.
 */
export function astroRefraction(geometricAltitude: Radians): Radians {
  const minAltRad: Radians = degreesToRadians(
    REFRACTION.SAEMUNDSSON.MIN_ALTITUDE,
  );
  const clampedAltitude: Radians = Math.max(
    geometricAltitude,
    minAltRad,
  ) as Radians;
  const clampedAltitudeDeg: Degrees = radiansToDegrees(clampedAltitude);
  const altitudeAdjustmentDeg =
    REFRACTION.SAEMUNDSSON.ALTITUDE_OFFSET /
    (clampedAltitudeDeg + REFRACTION.SAEMUNDSSON.DENOMINATOR_OFFSET);
  const adjustedAltitudeDeg: Degrees = (clampedAltitudeDeg +
    altitudeAdjustmentDeg) as Degrees;
  const tanTerm = Math.tan(degreesToRadians(adjustedAltitudeDeg));
  return tanTerm !== 0
    ? degreesToRadians(
        (REFRACTION.SAEMUNDSSON.COEFFICIENT / tanTerm) as Degrees,
      )
    : (0 as Radians);
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Computes the central-difference derivative of a function.
 * @param {(t: number) => number} fn - Function to differentiate.
 * @param {number} t - Evaluation point.
 * @param {number} delta - Step size for the difference.
 * @returns {number} Derivative estimate.
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  delta: number,
  floatingPointEpsilon: number,
): number {
  const f1 = fn(t + delta);
  const f2 = fn(t - delta);
  return Math.abs(f1 - f2) < floatingPointEpsilon ? 0 : (f1 - f2) / (2 * delta);
}

/**
 * Newton-Raphson root finder for a function.
 * @param {number} seed - Initial guess.
 * @param {(t: number) => number} evaluator - Function whose root is sought (evaluator(t) - target = 0).
 * @param {number} target - Target value that evaluator(t) should equal at the root.
 * @param {RefinementConfig} config - Configuration parameters.
 * @returns {number} Refined root.
 */
export function refineRoot(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: RefinementConfig,
): number {
  const {
    stepSize,
    convergenceThreshold,
    maxStep,
    maxIterationSteps,
    floatingPointEpsilon,
  } = config;
  let t: number = seed;
  let f = evaluator(t) - target;
  for (let i = 0; i < maxIterationSteps; i++) {
    const df = computeDerivative(evaluator, t, stepSize, floatingPointEpsilon); // Use config epsilon
    if (
      Math.abs(f) < convergenceThreshold ||
      Math.abs(df) < floatingPointEpsilon
    ) {
      break;
    }
    const step: number = f / df;
    const adjustedStep: number =
      Math.abs(step) > maxStep ? Math.sign(step) * maxStep : step;
    t = t - adjustedStep;
    f = evaluator(t) - target;
  }
  return t;
}

/**
 * Refines an event time using Newton-Raphson, specialized for time in days.
 * @param {number} seed - Initial guess in days.
 * @param {(t: number) => number} evaluator - Function whose root is sought (evaluator(t) - target = 0).
 * @param {number} target - Target value that evaluator(t) should equal at the event time.
 * @param {Partial<RefinementConfig>} [config] - Optional configuration parameters.
 * @returns {number} Refined time in days.
 */
export function refineEvent(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: Partial<RefinementConfig> = {},
): number {
  const fullConfig: RefinementConfig = {
    ...DEFAULT_REFINEMENT,
    ...config,
  };
  return refineRoot(
    seed,
    evaluator as (t: number) => number,
    target,
    fullConfig,
  );
}

/**
 * Generates candidate event times.
 * @param {JulianDayTT} start - Start in Julian days (TT).
 * @param {JulianDayTT} end - End in Julian days (TT).
 * @param {JulianDayTT} referenceJD - Anchor event JD.
 * @param {Days} eventIntervalDays - Period between events.
 * @param {Days} convergenceWindowDays - Refinement window.
 * @returns {JulianDayTT[]} Candidate JDs in TT.
 */
export function generateEventSeeds(
  start: JulianDayTT,
  end: JulianDayTT,
  referenceJD: JulianDayTT,
  eventIntervalDays: Days,
  convergenceWindowDays: Days,
): JulianDayTT[] {
  const seeds: JulianDayTT[] = [];

  // Compute the offset from referenceJD to start in days
  const startPhaseOffset: Days = subtractJDs(referenceJD, start);

  // Calculate how many intervals before referenceJD to cover startJD - convergenceWindowDays
  const seedCountBefore = Math.ceil(
    (((startPhaseOffset as number) + convergenceWindowDays) as number) /
      (eventIntervalDays as number),
  );

  // Compute initial jd by stepping back from referenceJD
  const initialOffset: Days = (seedCountBefore *
    eventIntervalDays) as number as Days;
  let jd: JulianDayTT = subtractDaysFromJD(referenceJD, initialOffset);

  // Define thresholds for the loop
  const endThreshold: JulianDayTT = addDaysToJD(end, convergenceWindowDays);
  const startThreshold: JulianDayTT = subtractDaysFromJD(
    start,
    convergenceWindowDays,
  );

  // Generate seeds within the range
  while (jd < endThreshold) {
    if (jd > startThreshold) {
      seeds.push(jd);
    }
    jd = addDaysToJD(jd, eventIntervalDays);
  }

  return seeds;
}

/** ================== Data Management Utilities ================== */

/**
 * Adds a JD to an array if unique within threshold.
 * @param {JulianDayTT[]} times - Array to modify.
 * @param {JulianDayTT} jd - Candidate JD in TT.
 * @param {Days} [eps] - Equality threshold in days.
 */
export function addUniqueJD(
  times: JulianDayTT[],
  time: JulianDayTT,
  eps: Days = NUMERICAL.EPSILON.EVENT_TIME_EQUALITY_DAYS as Days,
): void {
  if (!times.some((existing) => Math.abs(existing - time) < eps)) {
    times.push(time);
  }
}
