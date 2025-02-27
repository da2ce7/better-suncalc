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
import { DEGREES_TO_RADIANS, NUMERICAL, PI, TAU } from "./constraints/math";
import {
  DAYS_PER_JULIAN_CENTURY,
  JULIAN_EPOCH_J2000,
} from "./constraints/time";
import {
  AU,
  Days,
  Degrees,
  J2000CenturyTT,
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
  ra: Radians;
  dec: Radians;
  distance: AU;
  eclipticLon?: Radians;
  eclipticLat?: Radians;
};

/**
 * Event detection configuration for altitude crossing search.
 * @interface EventWindow
 */
export interface EventWindow {
  start: JulianDayTT;
  end: JulianDayTT;
  evaluator: (jd: JulianDayTT) => number;
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

/** ================== Time Conversion Utilities ================== */

// Utility functions for operations with branded types
/**
 * Adds a number of days to a Julian Day TT value.
 * @param jd - The base Julian Day TT
 * @param days - The number of days to add
 * @returns The resulting Julian Day TT
 */
export function addDaysToJD(jd: JulianDayTT, days: Days): JulianDayTT {
  return ((jd as number) + days) as number as JulianDayTT;
}

/**
 * Subtracts a number of days to a Julian Day TT value.
 * @param jd - The base Julian Day TT
 * @param days - The number of days to subtract
 * @returns The resulting Julian Day TT
 */
export function subtractDaysFromJD(jd: JulianDayTT, days: Days): JulianDayTT {
  return ((jd as number) - days) as number as JulianDayTT;
}

/**
 * Subtracts one Julian Day TT from another to get the difference in days.
 * @param jd1 - The first Julian Day TT
 * @param jd2 - The second Julian Day TT to subtract
 * @returns The difference in days
 */
export function subtractJDs(jd1: JulianDayTT, jd2: JulianDayTT): Days {
  return ((jd1 as number) - jd2) as number as Days;
}

/**
 * Calculates the number of Julian centuries since the J2000 epoch.
 * @param {JulianDayTT} jd - Julian day in TT.
 * @returns {J2000CenturyTT} Number of Julian centuries since J2000.
 */
export function getJulianCenturiesSinceJ2000(jd: JulianDayTT): J2000CenturyTT {
  return ((jd - JULIAN_EPOCH_J2000) /
    DAYS_PER_JULIAN_CENTURY) as J2000CenturyTT;
}

/** ================== Geographic Coordinate Conversions ================== */

/**
 * Converts geographic longitude to radians (west-positive).
 * @param {Degrees} lng - Longitude in degrees (-180 to 180, E-positive).
 * @returns {Radians} Longitude in radians (-π to π, W-positive).
 */
export function longitudeToRadWest(lng: Degrees): Radians {
  return (DEGREES_TO_RADIANS * -lng) as Radians;
}

/**
 * Converts geographic latitude to radians.
 * @param {Degrees} lat - Latitude in degrees (-90 to 90).
 * @returns {Radians} Latitude in radians (-π/2 to π/2).
 */
export function latitudeToRad(lat: Degrees): Radians {
  return (DEGREES_TO_RADIANS * lat) as Radians;
}

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates geometric altitude angle (no refraction).
 * @param {Radians} H - Hour angle in radians.
 * @param {Radians} phi - Latitude in radians.
 * @param {Radians} dec - Declination in radians.
 * @returns {Radians} Altitude in radians.
 */
export function altitude(H: Radians, phi: Radians, dec: Radians): Radians {
  return Math.asin(
    Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H),
  ) as Radians;
}

/**
 * Calculates azimuth angle for a celestial object.
 * @param {Radians} H - Hour angle in radians.
 * @param {Radians} phi - Latitude in radians.
 * @param {Radians} dec - Declination in radians.
 * @returns {Radians} Azimuth in radians (0 at north, clockwise).
 */
export function azimuth(H: Radians, phi: Radians, dec: Radians): Radians {
  return Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi),
  ) as Radians;
}

/**
 * Calculates observed celestial position with refraction.
 * @param {JulianDayTT} jd - Julian day in TT.
 * @param {Degrees} lat - Latitude in degrees.
 * @param {Degrees} lng - Longitude in degrees.
 * @param {(jd: JulianDayTT) => CelestialCoordinates} coordFn - Coordinate function.
 * @returns {PositionData} Azimuth and altitude.
 */
export function calculateCelestialPosition(
  jd: JulianDayTT,
  lat: Degrees,
  lng: Degrees,
  coordFn: (jd: JulianDayTT) => CelestialCoordinates,
): PositionData {
  const longitudeRadWest: Radians = longitudeToRadWest(lng);
  const latitudeRad: Radians = latitudeToRad(lat);
  const coordinates = coordFn(jd);
  const hourAngleRad: Radians = computeHourAngleAtRef(
    jd,
    longitudeRadWest,
    coordinates.ra,
  );
  const geometricAltitudeRad: Radians = altitude(
    hourAngleRad,
    latitudeRad,
    coordinates.dec,
  );
  return {
    azimuth: azimuth(hourAngleRad, latitudeRad, coordinates.dec),
    altitude: (geometricAltitudeRad +
      astroRefraction(geometricAltitudeRad)) as Radians,
  };
}

/**
 * Calculates the true obliquity of the ecliptic.
 * @param {J2000CenturyTT} T - Julian centuries since J2000.
 * @returns {Radians} Obliquity in radians.
 */
export function calculateTrueObliquity(T: J2000CenturyTT): Radians {
  return ((EARTH.OBLIQUITY_J2000 + EARTH.OBLIQUITY_DRIFT.LINEAR_RATE * T) *
    DEGREES_TO_RADIANS) as Radians;
}

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity in radians.
 * @returns Right ascension in radians.
 */
export function rightAscension(
  eclipticLonRad: Radians,
  eclipticLatRad: Radians,
  obliquityRad: Radians,
): Radians {
  const x =
    Math.sin(eclipticLonRad) * Math.cos(obliquityRad) -
    Math.tan(eclipticLatRad) * Math.sin(obliquityRad);
  const y = Math.cos(eclipticLonRad);
  const ra = Math.atan2(x, y);
  return ((ra < 0 ? ra + TAU : ra) % TAU) as Radians;
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity in radians.
 * @returns Declination in radians.
 */
export function declination(
  eclipticLonRad: Radians,
  eclipticLatRad: Radians,
  obliquityRad: Radians,
): Radians {
  return Math.asin(
    Math.sin(eclipticLatRad) * Math.cos(obliquityRad) +
      Math.cos(eclipticLatRad) *
        Math.sin(obliquityRad) *
        Math.sin(eclipticLonRad),
  ) as Radians;
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model for altitude correction.
 * @param {Radians} h - Geometric altitude in radians.
 * @returns {Radians} Refraction adjustment in radians.
 */
export function astroRefraction(geometricAltitudeRad: Radians): Radians {
  const minAltRad: Radians = (REFRACTION.SAEMUNDSSON.MIN_ALTITUDE *
    DEGREES_TO_RADIANS) as Radians;
  const clampedAltitudeRad: Radians = Math.max(
    geometricAltitudeRad,
    minAltRad,
  ) as Radians;
  const clampedAltitudeDeg: Degrees = (clampedAltitudeRad *
    (180 / PI)) as Degrees;
  const altitudeAdjustmentDeg =
    REFRACTION.SAEMUNDSSON.ALTITUDE_OFFSET /
    (clampedAltitudeDeg + REFRACTION.SAEMUNDSSON.DENOMINATOR_OFFSET);
  const adjustedAltitudeDeg: Degrees = (clampedAltitudeDeg +
    altitudeAdjustmentDeg) as Degrees;
  const tanTerm = Math.tan(adjustedAltitudeDeg * DEGREES_TO_RADIANS);
  return tanTerm !== 0
    ? (((REFRACTION.SAEMUNDSSON.COEFFICIENT / tanTerm) *
        DEGREES_TO_RADIANS) as Radians)
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
 * @param {JulianDayTT} startJD - Start in Julian days (TT).
 * @param {JulianDayTT} endJD - End in Julian days (TT).
 * @param {JulianDayTT} referenceJD - Anchor event JD.
 * @param {Days} eventIntervalDays - Period between events.
 * @param {Days} convergenceWindowDays - Refinement window.
 * @returns {JulianDayTT[]} Candidate JDs in TT.
 */
export function generateEventSeeds(
  startJD: JulianDayTT,
  endJD: JulianDayTT,
  referenceJD: JulianDayTT,
  eventIntervalDays: Days,
  convergenceWindowDays: Days,
): JulianDayTT[] {
  const seeds: JulianDayTT[] = [];

  // Compute the offset from referenceJD to startJD in days
  const startPhaseOffset: Days = subtractJDs(referenceJD, startJD);

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
  const endThreshold: JulianDayTT = addDaysToJD(endJD, convergenceWindowDays);
  const startThreshold: JulianDayTT = subtractDaysFromJD(
    startJD,
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
 * @param {JulianDayTT[]} jds - Array to modify.
 * @param {JulianDayTT} jd - Candidate JD in TT.
 * @param {Days} [eps] - Equality threshold in days.
 */
export function addUniqueJD(
  jds: JulianDayTT[],
  jd: JulianDayTT,
  eps: Days = NUMERICAL.EPSILON.EVENT_TIME_EQUALITY_DAYS as Days,
): void {
  if (!jds.some((existing) => Math.abs(existing - jd) < eps)) {
    jds.push(jd);
  }
}
