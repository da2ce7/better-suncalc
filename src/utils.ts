/**
 * @file utils.ts
 * @module astronomy-utils
 * @description Shared functions for celestial calculations, time conversions, numerical methods, and event detection.
 * Includes documentation of key assumptions and limitations for maintainability.
 *
 * @notes
 * - Angular units are explicitly noted in function parameters (degrees or radians).
 * - Time-based calculations assume JD TT unless otherwise stated.
 * - Numerical methods include stability thresholds to handle floating-point edge cases.
 */

import {
  ATMOSPHERIC_REFRACTION,
  DAY_MS,
  DAYS_PER_JULIAN_CENTURY,
  ECLIPTIC_OBLIQUITY_BASE_DEGREES,
  ECLIPTIC_OBLIQUITY_DRIFT_RATE,
  EVENT_DETECTION_WINDOW_DAYS,
  EVENT_TIME_CONVERGENCE_THRESHOLD_DAYS,
  EVENT_TIME_EQUALITY_THRESHOLD_DAYS,
  FLOATING_POINT_EPSILON_DAYS,
  HALF_DAY,
  HOUR_MS,
  ITERATIVE_METHODS_MAX_ITERATIONS,
  JULIAN_CONVERSION_MAX_ITERATIONS,
  JULIAN_EPOCH_J1970,
  JULIAN_EPOCH_J2000,
  MAXIMUM_TIME_STEP_DAYS,
  NUMERICAL_DERIVATIVE_STEP_DAYS,
  SECONDS_PER_DAY,
} from "./constraints/constants";
import { DEGREES_TO_RADIANS, PI, TAU } from "./constraints/math";
import { DELTA_T_POLYNOMIAL_SEGMENTS } from "./constraints/time";

/** ================== Type and Interface Definitions ================== */

/**
 * Represents the sun's position at a specific time and location.
 * @typedef {Object} PositionData
 * @property {number} azimuth - Azimuth angle in radians (clockwise from true north).
 * @property {number} altitude - Altitude angle in radians above horizon (0 at horizon, positive upwards). Includes correction for atmospheric refraction.
 */
export type PositionData = {
  azimuth: number;
  altitude: number;
};

/**
 * Represents the celestial coordinates of the moon, including right ascension (RA),
 * declination (Dec), and optional ecliptic coordinates.
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
 * @property {number} start - Julian day number in TT: search window start.
 * @property {number} end - Julian day number in TT: search window end.
 * @property {(jd: number) => number} evaluator - Function that returns altitude given a Julian Day (JD) in TT.
 * @property {number} threshold - Altitude threshold for event detection in radians.
 * @property {number} [windowSize] - Search window step size in days (default 0.083 ≈ 2 hours).
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
 * @property {number} deltaT - Finite difference step size in days.
 * @property {number} eps - Convergence tolerance in days.
 * @property {number} maxStepDays - Maximum step distance in days.
 * @property {number} maxIterationSteps - Maximum allowed iterations.
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
  deltaT: NUMERICAL_DERIVATIVE_STEP_DAYS,
  eps: EVENT_TIME_CONVERGENCE_THRESHOLD_DAYS,
  maxStepDays: MAXIMUM_TIME_STEP_DAYS,
  maxIterationSteps: ITERATIVE_METHODS_MAX_ITERATIONS,
};

/** ================== Time Conversion Utilities ================== */

/**
 * Approximates ΔT (TT - UTC in seconds) using polynomial models.
 * @function deltaT
 * @param {Date} date - UTC date to evaluate.
 * @returns {number} ΔT in seconds (historical: ±5s post-1972; predictions: >2022).
 * @see Espenak & Meeus (2006) {@link https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html}
 * @warning
 * - Pre-1950 accuracy degrades rapidly (especially before 1600).
 * - Post-2022 values are extrapolated; for critical applications after 2023, use IERS ΔT predictions ({@link https://www.iers.org/IERS/EN/DataProducts/EarthOrientationData/eop.html}).
 */
export function deltaT(date: Date): number {
  const y = date.getUTCFullYear() + date.getUTCMonth() / 12;
  for (const c of DELTA_T_POLYNOMIAL_SEGMENTS) {
    if (y < c.maxYear) {
      const t = (y - c.base) / c.scale;
      let result = 0;
      for (let i = 0; i < c.coeffs.length; i++) {
        result += c.coeffs[i] * Math.pow(t, i);
      }
      return result;
    }
  }
  throw new Error("Year out of range for ΔT calculation"); // Unreachable with Infinity
}

/**
 * Converts a UTC Date to a Terrestrial Time (TT) Julian Date.
 * @function dateToJulian
 * @param {Date} date - UTC date/time.
 * @returns {number} Julian Date in TT.
 */
export function dateToJulian(date: Date): number {
  const utcMS = date.getTime();
  const utcJD = utcMS / DAY_MS - HALF_DAY + JULIAN_EPOCH_J1970;
  return utcJD + deltaT(date) / SECONDS_PER_DAY;
}

/**
 * Converts a TT Julian Date to a UTC Date via iterative approximation.
 * @function julianToDate
 * @param {number} ttJD - Julian Date in Terrestrial Time.
 * @returns {Date} UTC Date within ±1ms of actual time.
 */
export function julianToDate(ttJD: number): Date {
  let utcJD = ttJD;
  let date: Date;
  for (let i = 0; i < JULIAN_CONVERSION_MAX_ITERATIONS; i++) {
    date = new Date((utcJD + HALF_DAY - JULIAN_EPOCH_J1970) * DAY_MS);
    const delta = deltaT(date) / SECONDS_PER_DAY;
    utcJD = ttJD - delta;
  }
  return new Date(Math.round((utcJD - JULIAN_EPOCH_J1970 + HALF_DAY) * DAY_MS));
}

/**
 * Generates a new Date offset by hours from an original (UTC-aware).
 * @function hoursLater
 * @param {Date} date - Base UTC date.
 * @param {number} hours - Offset (±) in hours.
 * @returns {Date} New UTC Date.
 */
export function hoursLater(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * HOUR_MS);
}

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
 * Converts geographic longitude to radians with western-positive convention.
 * @function longitudeToRadWest
 * @param {number} lng - Geographic longitude in degrees (-180 to 180, E-positive).
 * @returns {number} Longitude in radians (-π to π), where positive values are west.
 */
export function longitudeToRadWest(lng: number): number {
  return DEGREES_TO_RADIANS * -lng;
}

/**
 * Converts geographic latitude to radians.
 * @function latitudeToRad
 * @param {number} lat - Geographic latitude in degrees (-90 to 90).
 * @returns {number} Latitude in radians (-π/2 to π/2).
 */
export function latitudeToRad(lat: number): number {
  return DEGREES_TO_RADIANS * lat;
}

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates approximate Greenwich Mean Sidereal Time (GMST) using JD TT.
 * @function siderealTime
 * @param {number} jd - Julian Date in Terrestrial Time (TT).
 * @param {number} lw - Longitude west in radians (0 for Greenwich).
 * @returns {number} GMST in radians (simplified model, ±1.5s accuracy post-2000).
 * @remark For precise applications (≥1s accuracy), use IAU 2006 model with precession/nutation corrections.
 */
export function siderealTime(jd: number, lw: number): number {
  const d = jd - JULIAN_EPOCH_J2000;
  const gmst = DEGREES_TO_RADIANS * (280.16 + 360.9856235 * d);
  return (((gmst - lw) % TAU) + TAU) % TAU;
}

/**
 * Calculates geometric altitude angle (astronomical horizon, no refraction).
 * @function altitude
 * @param {number} H - Hour angle in radians.
 * @param {number} phi - Observer's latitude in radians.
 * @param {number} dec - Celestial object's declination in radians.
 * @returns {number} Altitude angle in radians (0 at true horizon).
 */
export function altitude(H: number, phi: number, dec: number): number {
  return Math.asin(
    Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H),
  );
}

/**
 * Calculates azimuth angle for a celestial object.
 * @function azimuth
 * @param {number} H - Hour angle in radians.
 * @param {number} phi - Observer's latitude in radians.
 * @param {number} dec - Celestial object's declination in radians.
 * @returns {number} Azimuth in radians (0 at true north, clockwise positive).
 */
export function azimuth(H: number, phi: number, dec: number): number {
  return Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi),
  );
}

/**
 * Calculates observed celestial position with atmospheric refraction.
 * @function calculateCelestialPosition
 * @param {number} jd - Julian day number in TT.
 * @param {number} lat - Observer's latitude in degrees.
 * @param {number} lng - Observer's longitude in degrees.
 * @param {(jd: number) => CelestialCoords} coordFn - Coordinate function returning RA/Dec given JD TT.
 * @returns {Omit<PositionData, "distance" | "parallacticAngle">} Observed azimuth and altitude in radians.
 */
export function calculateCelestialPosition(
  jd: number,
  lat: number,
  lng: number,
  coordFn: (jd: number) => CelestialCoordinates,
): Omit<PositionData, "distance" | "parallacticAngle"> {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);
  const c = coordFn(jd); // Pass JD TT directly
  const H = siderealTime(jd, lw) - c.ra; // Updated siderealTime uses jd
  const geomAlt = altitude(H, phi, c.dec);
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: geomAlt + astroRefraction(geomAlt),
  };
}

/**
 * Calculates the true obliquity of the ecliptic for a given time in Julian centuries.
 * @param {number} T - Julian centuries since J2000.
 * @returns {number} True obliquity of the ecliptic in radians.
 */
export function calculateTrueObliquity(T: number): number {
  return (
    (ECLIPTIC_OBLIQUITY_BASE_DEGREES + ECLIPTIC_OBLIQUITY_DRIFT_RATE * T) *
    DEGREES_TO_RADIANS
  );
}

/**
 * Calculates the right ascension from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity of the ecliptic in radians (e.g., ~23.44° at J2000).
 * @returns Right ascension in radians (0 to 2π).
 */
export function rightAscension(λ: number, β: number, ε: number): number {
  const x = Math.sin(λ) * Math.cos(ε) - Math.tan(β) * Math.sin(ε);
  const y = Math.cos(λ);
  const ra = Math.atan2(x, y);
  return (ra < 0 ? ra + TAU : ra) % TAU;
}

/**
 * Calculates the declination from ecliptic coordinates.
 * @param λ - Ecliptic longitude in radians.
 * @param β - Ecliptic latitude in radians.
 * @param ε - Obliquity of the ecliptic in radians (e.g., ~23.44° at J2000).
 * @returns Declination in radians (-π/2 to π/2).
 */
export function declination(λ: number, β: number, ε: number): number {
  return Math.asin(
    Math.sin(β) * Math.cos(ε) + Math.cos(β) * Math.sin(ε) * Math.sin(λ),
  );
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model (1986) for apparent altitude correction.
 * @function astroRefraction
 * @param {number} h - True geometric altitude in radians (clamped to -0.83° threshold).
 * @returns {number} Refraction adjustment in radians (add to geometric altitude).
 * @remark Based on: {@link https://en.wikipedia.org/wiki/Atmospheric_refraction}. Valid for h ≥ -0.83°. Extrapolates below with reduced accuracy. Typical error ±0.07° near horizon, ±0.02° above 20° altitude.
 */
export function astroRefraction(h: number): number {
  const {
    MIN_ALTITUDE_DEG,
    COEFFICIENT_DEG,
    ALTITUDE_OFFSET_DEG,
    DENOMINATOR_OFFSET_DEG,
  } = ATMOSPHERIC_REFRACTION;
  const minAltRad = MIN_ALTITUDE_DEG * DEGREES_TO_RADIANS;
  h = Math.max(h, minAltRad); // Model valid down to -0.83° (≈1.02' refraction)
  const hDeg = h * (180 / PI);
  const adjustment = ALTITUDE_OFFSET_DEG / (hDeg + DENOMINATOR_OFFSET_DEG);
  const trueAltAdjustedDeg = hDeg + adjustment;
  const tanTerm = Math.tan(trueAltAdjustedDeg * DEGREES_TO_RADIANS);

  // Prevent division by zero (occurs below ~-5°, clamped to -0.83°)
  return tanTerm !== 0 ? (COEFFICIENT_DEG / tanTerm) * DEGREES_TO_RADIANS : 0;
}

/** ================== Astronomical Event Detection ================== */

/**
 * Linear interpolation for crossing estimation between two time points.
 * @function linearInterpolateCrossing
 * @internal
 * @param {number} x1 - First time point (days).
 * @param {number} x2 - Second time point (days).
 * @param {number} y1 - Function value at x1.
 * @param {number} y2 - Function value at x2.
 * @returns {number} Estimated crossing time.
 * @remark Avoids division by tiny differences to ensure numerical stability.
 */
function linearInterpolateCrossing(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dy === 0 ? x1 : x1 - y1 * (dx / dy);
}

/**
 * Detects altitude threshold crossings using linear search with adaptive window.
 * @function findAltitudeCrossingEvents
 * @param {EventWindow} config - Search parameters (start/end JD in TT, threshold, evaluator).
 * @returns {{ rise?: number; set?: number; alwaysUp?: boolean; alwaysDown?: boolean }} Object with rise/set JDs and flags for continuous visibility.
 * @warning False negatives possible if windowSize > event duration. Ensure windowSize << eventInterval (e.g., 2hr window for daily events).
 */
export function findAltitudeCrossingEvents({
  start,
  end,
  evaluator,
  threshold,
  windowSize = EVENT_DETECTION_WINDOW_DAYS,
}: EventWindow): {
  rise?: number;
  set?: number;
  alwaysUp?: boolean;
  alwaysDown?: boolean;
} {
  let current = start;
  let prevAlt = evaluator(current) - threshold;
  const result: ReturnType<typeof findAltitudeCrossingEvents> = {};

  while (current < end) {
    const next = current + windowSize;
    const nextAlt = evaluator(next) - threshold;

    if (Math.sign(prevAlt) !== Math.sign(nextAlt)) {
      const crossing = linearInterpolateCrossing(
        current,
        next,
        prevAlt,
        nextAlt,
      );
      prevAlt < 0 ? (result.rise = crossing) : (result.set = crossing);
    }

    prevAlt = nextAlt;
    current = next;
  }

  if (!result.rise && !result.set) {
    const meanAlt = evaluator((start + end) / 2);
    meanAlt > threshold ? (result.alwaysUp = true) : (result.alwaysDown = true);
  }

  return result;
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Computes central-difference derivative with numerical stabilization.
 * @function computeDerivative
 * @param {(t: number) => number} fn - Function to differentiate.
 * @param {number} t - Evaluation point in days (JD in TT).
 * @param {number} [delta=NUMERICAL_DERIVATIVE_STEP_DAYS] - Step size in days (≈1.44 min).
 * @returns {number} Derivative estimate df/dt at t (days⁻¹).
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  delta: number = NUMERICAL_DERIVATIVE_STEP_DAYS,
): number {
  const f1 = fn(t + delta);
  const f2 = fn(t - delta);
  return Math.abs(f1 - f2) < FLOATING_POINT_EPSILON_DAYS
    ? 0
    : (f1 - f2) / (2 * delta);
}

/**
 * Newton-Raphson root finder for refining event times.
 * @function refineEvent
 * @param {number} seed - Initial guess in days (JD in TT).
 * @param {(t: number) => number} evaluator - Function to find root of (f(t) = target).
 * @param {number} target - Target value (usually 0).
 * @param {Partial<RefinementConfig>} [config] - Tuning parameters for convergence.
 * @returns {number} Refined JD in TT where |f(t) - target| < eps or max iterations reached.
 * @note Iteration count kept low for performance. May fail to converge for discontinuous or noisy functions.
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
    if (Math.abs(f) < eps || Math.abs(df) < FLOATING_POINT_EPSILON_DAYS) break;

    const step = f / df;
    const adjustedStep =
      Math.abs(step) > maxStepDays ? Math.sign(step) * maxStepDays : step;
    t -= adjustedStep;
    f = evaluator(t) - target;
  }

  return t;
}

/** ================== Event Seed Generation ================== */

/**
 * Generates candidate event times around a reference date with spaced intervals.
 * @function generateEventSeeds
 * @param {number} startJD - Search window start in Julian days (TT).
 * @param {number} endJD - Search window end in Julian days (TT).
 * @param {number} referenceJD - Anchor event JD in TT (historical reference).
 * @param {number} eventIntervalDays - Approximate period between events (e.g., ~365.25 days).
 * @param {number} convergenceWindowDays - Window for refining each candidate.
 * @returns {number[]} Candidate JDs in TT within [start - window, end + window].
 * @warning Assumes regular intervals. Irregular events (e.g., equinoxes) may require multiple reference seeds or adaptive intervals.
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
 * Adds a JD to an array if not already present within a time equality threshold.
 * @function addUniqueJD
 * @param {number[]} jds - Array to modify.
 * @param {number} jd - Candidate JD in TT to add.
 * @param {number} [eps=EVENT_TIME_EQUALITY_THRESHOLD_DAYS] - Equality threshold in days (≈1.44 min).
 */
export function addUniqueJD(
  jds: number[],
  jd: number,
  eps: number = EVENT_TIME_EQUALITY_THRESHOLD_DAYS,
): void {
  if (!jds.some((existing) => Math.abs(existing - jd) < eps)) {
    jds.push(jd);
  }
}
