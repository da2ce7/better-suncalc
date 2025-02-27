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
import { computeHourAngleAtRef } from "./transits";

/** ================== Type and Interface Definitions ================== */

/**
 * Represents the sun's position at a specific time and location.
 * @typedef {Object} PositionData
 * @property {number} azimuth - Azimuth angle in radians (clockwise from true north).
 * @property {number} altitude - Altitude angle in radians above horizon (includes refraction).
 */
export type PositionData = {
  azimuth: number;
  altitude: number;
};

/**
 * Represents the celestial coordinates of an object (e.g., moon or sun).
 */
export type CelestialCoordinates = {
  ra: number; // Right ascension in radians
  dec: number; // Declination in radians
  distance: number; // Distance in AU
  eclipticLon?: number; // Ecliptic longitude in radians (optional)
  eclipticLat?: number; // Ecliptic latitude in radians (optional)
};

/**
 * Event detection configuration for altitude crossing search.
 * @interface EventWindow
 */
export interface EventWindow {
  start: number;
  end: number;
  evaluator: (jd: number) => number;
  threshold: number;
  windowSize?: number;
}

/**
 * Configuration for numerical event refinement.
 * @typedef {Object} RefinementConfig
 */
export type RefinementConfig = {
  deltaT: number;
  eps: number;
  maxStepDays: number;
  maxIterationSteps: number;
};

/**
 * Default refinement parameters for numerical methods.
 * @constant {RefinementConfig}
 */
export const DEFAULT_REFINEMENT: RefinementConfig = {
  deltaT: NUMERICAL.CALCULATION.DERIVATIVE_STEP_DAYS, // ~1.44 minutes
  eps: NUMERICAL.ITERATION.CONVERGENCE_THRESHOLD, // ~0.00086 seconds
  maxStepDays: 1, // Arbitrary, suitable for daily events
  maxIterationSteps: NUMERICAL.ITERATION.MAX, // 15 iterations
};

/** ================== Time Conversion Utilities ================== */

/**
 * Calculates the number of Julian centuries since the J2000 epoch.
 * @param {number} jd - Julian day.
 * @returns {number} Number of Julian centuries since J2000.
 */
export function getJulianCenturiesSinceJ2000(jd: number): number {
  return (jd - JULIAN_EPOCH_J2000) / DAYS_PER_JULIAN_CENTURY;
}

/** ================== Geographic Coordinate Conversions ================== */

/**
 * Converts geographic longitude to radians (west-positive).
 * @param {number} lng - Longitude in degrees (-180 to 180, E-positive).
 * @returns {number} Longitude in radians (-π to π, W-positive).
 */
export function longitudeToRadWest(lng: number): number {
  return DEGREES_TO_RADIANS * -lng;
}

/**
 * Converts geographic latitude to radians.
 * @param {number} lat - Latitude in degrees (-90 to 90).
 * @returns {number} Latitude in radians (-π/2 to π/2).
 */
export function latitudeToRad(lat: number): number {
  return DEGREES_TO_RADIANS * lat;
}

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates geometric altitude angle (no refraction).
 * @param {number} H - Hour angle in radians.
 * @param {number} phi - Latitude in radians.
 * @param {number} dec - Declination in radians.
 * @returns {number} Altitude in radians.
 */
export function altitude(H: number, phi: number, dec: number): number {
  return Math.asin(
    Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H),
  );
}

/**
 * Calculates azimuth angle for a celestial object.
 * @param {number} H - Hour angle in radians.
 * @param {number} phi - Latitude in radians.
 * @param {number} dec - Declination in radians.
 * @returns {number} Azimuth in radians (0 at north, clockwise).
 */
export function azimuth(H: number, phi: number, dec: number): number {
  return Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi),
  );
}

/**
 * Calculates observed celestial position with refraction.
 * @param {number} jd - Julian day in TT.
 * @param {number} lat - Latitude in degrees.
 * @param {number} lng - Longitude in degrees.
 * @param {(jd: number) => CelestialCoordinates} coordFn - Coordinate function.
 * @returns {Omit<PositionData, "distance" | "parallacticAngle">} Azimuth and altitude.
 */
export function calculateCelestialPosition(
  jd: number,
  lat: number,
  lng: number,
  coordFn: (jd: number) => CelestialCoordinates,
): Omit<PositionData, "distance" | "parallacticAngle"> {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);
  const c = coordFn(jd);
  const H = computeHourAngleAtRef(jd, lw, c.ra);
  const geomAlt = altitude(H, phi, c.dec);
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: geomAlt + astroRefraction(geomAlt),
  };
}

/**
 * Calculates the true obliquity of the ecliptic.
 * @param {number} T - Julian centuries since J2000.
 * @returns {number} Obliquity in radians.
 */
export function calculateTrueObliquity(T: number): number {
  return (
    (EARTH.OBLIQUITY_J2000 + EARTH.OBLIQUITY_DRIFT.LINEAR_RATE * T) *
    DEGREES_TO_RADIANS
  );
}

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity in radians.
 * @returns Right ascension in radians.
 */
export function rightAscension(λ: number, β: number, ε: number): number {
  const x = Math.sin(λ) * Math.cos(ε) - Math.tan(β) * Math.sin(ε);
  const y = Math.cos(λ);
  const ra = Math.atan2(x, y);
  return (ra < 0 ? ra + TAU : ra) % TAU;
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity in radians.
 * @returns Declination in radians.
 */
export function declination(λ: number, β: number, ε: number): number {
  return Math.asin(
    Math.sin(β) * Math.cos(ε) + Math.cos(β) * Math.sin(ε) * Math.sin(λ),
  );
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model for altitude correction.
 * @param {number} h - Geometric altitude in radians.
 * @returns {number} Refraction adjustment in radians.
 */
export function astroRefraction(h: number): number {
  const minAltRad = REFRACTION.SAEMUNDSSON.MIN_ALTITUDE * DEGREES_TO_RADIANS;
  h = Math.max(h, minAltRad);
  const hDeg = h * (180 / PI);
  const adjustment =
    REFRACTION.SAEMUNDSSON.ALTITUDE_OFFSET /
    (hDeg + REFRACTION.SAEMUNDSSON.DENOMINATOR_OFFSET);
  const trueAltAdjustedDeg = hDeg + adjustment;
  const tanTerm = Math.tan(trueAltAdjustedDeg * DEGREES_TO_RADIANS);

  return tanTerm !== 0
    ? (REFRACTION.SAEMUNDSSON.COEFFICIENT / tanTerm) * DEGREES_TO_RADIANS
    : 0;
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Computes central-difference derivative.
 * @param {(t: number) => number} fn - Function to differentiate.
 * @param {number} t - Evaluation point in days.
 * @param {number} [delta] - Step size in days.
 * @returns {number} Derivative estimate (days⁻¹).
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  delta: number = NUMERICAL.CALCULATION.DERIVATIVE_STEP_DAYS,
): number {
  const f1 = fn(t + delta);
  const f2 = fn(t - delta);
  return Math.abs(f1 - f2) < NUMERICAL.EPSILON.FLOATING_POINT_DAYS
    ? 0
    : (f1 - f2) / (2 * delta);
}

/**
 * Newton-Raphson root finder for event times.
 * @param {number} seed - Initial guess in days.
 * @param {(t: number) => number} evaluator - Function to find root of.
 * @param {number} target - Target value.
 * @param {Partial<RefinementConfig>} [config] - Tuning parameters.
 * @returns {number} Refined JD in TT.
 */
export function refineEvent(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: Partial<RefinementConfig> = {},
): number {
  const { deltaT, eps, maxStepDays, maxIterationSteps } = {
    ...DEFAULT_REFINEMENT,
    ...config,
  };
  let t = seed;
  let f = evaluator(t) - target;

  for (let i = 0; i < maxIterationSteps; i++) {
    const df = computeDerivative(evaluator, t, deltaT);
    if (
      Math.abs(f) < eps ||
      Math.abs(df) < NUMERICAL.EPSILON.FLOATING_POINT_DAYS
    )
      break;

    const step = f / df;
    const adjustedStep =
      Math.abs(step) > maxStepDays ? Math.sign(step) * maxStepDays : step;
    t -= adjustedStep;
    f = evaluator(t) - target;
  }

  return t;
}

/**
 * Generates candidate event times.
 * @param {number} startJD - Start in Julian days (TT).
 * @param {number} endJD - End in Julian days (TT).
 * @param {number} referenceJD - Anchor event JD.
 * @param {number} eventIntervalDays - Period between events.
 * @param {number} convergenceWindowDays - Refinement window.
 * @returns {number[]} Candidate JDs in TT.
 */
export function generateEventSeeds(
  startJD: number,
  endJD: number,
  referenceJD: number,
  eventIntervalDays: number,
  convergenceWindowDays: number,
): number[] {
  const seeds: number[] = [];
  const startPhaseOffset = referenceJD - startJD;
  const seedCountBefore = Math.ceil(
    (startPhaseOffset + convergenceWindowDays) / eventIntervalDays,
  );
  let jd = referenceJD - seedCountBefore * eventIntervalDays;

  while (jd < endJD + convergenceWindowDays) {
    if (jd > startJD - convergenceWindowDays) {
      seeds.push(jd);
    }
    jd += eventIntervalDays;
  }

  return seeds;
}

/** ================== Data Management Utilities ================== */

/**
 * Adds a JD to an array if unique within threshold.
 * @param {number[]} jds - Array to modify.
 * @param {number} jd - Candidate JD in TT.
 * @param {number} [eps] - Equality threshold in days.
 */
export function addUniqueJD(
  jds: number[],
  jd: number,
  eps: number = NUMERICAL.EPSILON.EVENT_TIME_EQUALITY_DAYS,
): void {
  if (!jds.some((existing) => Math.abs(existing - jd) < eps)) {
    jds.push(jd);
  }
}
