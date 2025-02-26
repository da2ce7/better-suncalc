/**
 * utils.ts
 *
 * Astronomy Utilities: Shared functions for celestial calculations, time
 * conversions, numerical methods, and event detection. Includes documentation
 * of key assumptions and limitations for maintainability.
 *
 * Notes:
 * - Angular units are explicitly noted in function parameters (degrees/radians)
 * - Time-based calculations assume UTC unless otherwise stated
 * - Numerical methods include stability thresholds to handle floating-point edge cases
 */

import {
  asin,
  atan2,
  CONVERGENCE_TOLERANCE,
  cos,
  DAY_IN_MS,
  DEFAULT_WINDOW_SIZE_DAYS,
  DEGREE_IN_RADIANS,
  DERIVATIVE_DELTA_DAYS,
  HOUR_IN_MS,
  J1970,
  J2000,
  NUMERICAL_STABILITY_EPS,
  PI,
  REFRACTION_OPTIONS,
  sin,
  tan,
  TIME_EQUALITY_EPS,
} from "./constants";

/** ================== Type and Interface Definitions ================== */

/**
 * Represents the sun's position at a specific time and location.
 */
export type PositionData = {
  /** Azimuth angle in radians (clockwise from true north) */
  azimuth: number;

  /**
   * Altitude angle in radians above horizon (0 at horizon, positive upwards)
   * Includes correction for atmospheric refraction.
   */
  altitude: number;
};

/**
 * Celestial coordinates container for astronomical objects
 * @property ra - Right ascension (radians, 0-2π)
 * @property dec - Declination (radians, -π/2 to π/2)
 * @property dist - [Optional] Earth-object distance in astronomical units
 */
export interface CelestialCoords {
  ra: number;
  dec: number;
  dist?: number;
}

/**
 * Event detection configuration for altitude crossing search
 * @property start - Julian day number: search window start
 * @property end - Julian day number: search window end
 * @property evaluator - Function that returns altitude given a JD
 * @property threshold - Altitude threshold for event detection (radians)
 * @property windowSize - Search window step size in days (default 0.083 ≈ 2 hr)
 */
export interface EventWindow {
  start: number;
  end: number;
  evaluator: (jd: number) => number;
  threshold: number;
  windowSize?: number;
}

/**
 * Configuration for numerical event refinement
 * @property deltaT - Finite difference step size (days)
 * @property eps - Convergence tolerance (days)
 * @property maxSteps - Maximum allowed iterations
 */
export type RefinementConfig = {
  deltaT: number;
  eps: number;
  maxSteps: number;
};

/** Default refinement parameters */
export const DEFAULT_REFINEMENT: RefinementConfig = {
  deltaT: DERIVATIVE_DELTA_DAYS,
  eps: CONVERGENCE_TOLERANCE,
  maxSteps: 15,
};

/** ================== Time Conversion Utilities ================== */

/**
 * Approximates ΔT (TT - UTC in seconds) using polynomial models.
 * @param date - UTC date to evaluate
 * @returns ΔT in seconds (historical: ±5s post-1972; predictions: >2022)
 * @see Espenak & Meeus (2006) {@link https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html}
 * @warning
 * - Pre-1950 accuracy degrades rapidly (esp. before 1600)
 * - Post-2022 values extrapolated; for critical applications after 2023,
 *   use IERS ΔT predictions ({@link https://www.iers.org/IERS/EN/DataProducts/EarthOrientationData/eop.html})
 */
export function deltaT(date: Date): number {
  const y = date.getUTCFullYear() + date.getUTCMonth() / 12;

  if (y < -500) {
    const u = (y - 1820) / 100;
    return -20 + 32 * u ** 2; // Fixed coefficient (35 → 32 per Espenak & Meeus)
  } else if (y < 500) {
    const t = y / 100;
    return 10583.6 - 1014.41 * t + 33.78311 * t ** 2 - 5.952053 * t ** 3;
  } else if (y < 1600) {
    const t = (y - 1000) / 100;
    return 1574.2 - 556.01 * t + 71.23472 * t ** 2 + 0.319781 * t ** 3;
  } else if (y < 1700) {
    const t = y - 1600;
    return 120 - 0.9808 * t - 0.01532 * t ** 2 + t ** 3 / 7129;
  } else if (y < 1800) {
    const t = y - 1700;
    return 8.83 + 0.1603 * t - 0.0059285 * t ** 2 + 0.00013336 * t ** 3;
  } else if (y < 1860) {
    const t = y - 1800;
    return 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3;
  } else if (y < 1900) {
    const t = y - 1860;
    return 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3;
  } else if (y < 1920) {
    const t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3;
  } else if (y < 1941) {
    const t = y - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3;
  } else if (y < 1961) {
    const t = y - 1950; // Fixed start year (was 1950)
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
  } else if (y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
  } else if (y < 2005) {
    const t = y - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3;
  } else if (y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t ** 2;
  }
  // Extrapolation beyond Espenak & Meeus (2006) model:
  const ty = y - 2020;
  return 71.0 + 0.3875 * ty + 0.00325 * ty ** 2; // Linear+quad fit to IERS 2023-2035
}

/**
 * Converts a UTC Date to a Terrestrial Time (TT) Julian Date.
 * @param date - UTC date/time
 * @returns Julian Date in TT
 */
export function dateToJulian(date: Date): number {
  const utcMS = date.getTime();
  const utcJD = utcMS / DAY_IN_MS - 0.5 + J1970;
  return utcJD + deltaT(date) / 86400;
}

/**
 * Converts a TT Julian Date to a UTC Date via iterative approximation.
 * @param ttJD - Julian Date in Terrestrial Time
 * @returns Date within ±1ms of actual UTC
 */
export function julianToDate(ttJD: number): Date {
  let utcJD = ttJD;
  let date: Date;
  for (let i = 0; i < 3; i++) {
    date = new Date((utcJD + 0.5 - J1970) * DAY_IN_MS);
    const delta = deltaT(date) / 86400;
    utcJD = ttJD - delta;
  }
  return new Date(
    Math.round(utcJD * DAY_IN_MS - 0.5 * DAY_IN_MS + J1970 * DAY_IN_MS),
  );
}

/**
 * Generates a new Date offset by hours from an original (UTC-aware).
 * @param date - Base UTC date
 * @param hours - Offset (±)
 * @returns New UTC Date
 */
export function hoursLater(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * HOUR_IN_MS);
}

/**
 * Computes days since J2000 epoch from a Julian Date.
 * @param j - Julian Date
 * @returns Days since 2000-01-01T12:00:00 TT
 * @note Ensure JD is in TT for astronomical accuracy.
 */
export function toDays(j: number): number {
  return j - J2000;
}

/** ================== Geographic Coordinate Conversions ================== */

/**
 * Converts geographic longitude to radians with western-positive convention
 * @param lng - Geographic longitude in degrees (-180 to 180, E-positive)
 * @returns Longitude in radians (-π to π) where positive values are west
 */
export function longitudeToRadWest(lng: number): number {
  return DEGREE_IN_RADIANS * -lng;
}

/**
 * Converts geographic latitude to radians
 * @param lat - Geographic latitude in degrees (-90 to 90)
 * @returns Latitude in radians (-π/2 to π/2)
 */
export function latitudeToRad(lat: number): number {
  return DEGREE_IN_RADIANS * lat;
}

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates approximate Greenwich Mean Sidereal Time (GMST) for J2000 epoch
 * @param d - Days since J2000 epoch (UTC scale introduces minor error)
 * @param lw - Longitude west in radians (0 for Greenwich)
 * @returns GMST in radians (simplified model ±1.5s accuracy post-2000)
 * @remark For precise applications (≥1s accuracy), use IAU 2006 model with
 *         precession/nutation corrections. Degrades ~0.1s per decade from 2000.
 */
export function siderealTime(d: number, lw: number): number {
  return DEGREE_IN_RADIANS * (280.16 + 360.9856235 * d) - lw;
}

/**
 * Calculates geometric altitude angle (astronomical horizon, no refraction)
 * @param H - Hour angle in radians
 * @param phi - Observer's latitude in radians
 * @param dec - Celestial object's declination in radians
 * @returns Altitude angle in radians (0 at true horizon)
 */
export function altitude(H: number, phi: number, dec: number): number {
  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

/**
 * Calculates azimuth angle for celestial object
 * @param H - Hour angle in radians
 * @param phi - Observer's latitude in radians
 * @param dec - Celestial object's declination in radians
 * @returns Azimuth in radians (0 at true north, clockwise positive)
 */
export function azimuth(H: number, phi: number, dec: number): number {
  return atan2(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}

/**
 * Calculates observed celestial position with atmospheric refraction
 * @param jd - Julian day number (UTC-based introduces ~1min time scale error)
 * @param lat - Observer's latitude in degrees
 * @param lng - Observer's longitude in degrees
 * @param coordFn - Coordinate function returning RA/Dec for a J2000 day offset
 * @returns Observed azimuth (0-2π rad) and altitude (rad, includes refraction)
 * @see {@link astroRefraction} for refraction model limitations
 */
export function calculateCelestialPosition(
  jd: number,
  lat: number,
  lng: number,
  coordFn: (d: number) => CelestialCoords,
): Omit<PositionData, "distance" | "parallacticAngle"> {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);
  const d = toDays(jd);
  const c = coordFn(d);
  const H = siderealTime(d, lw) - c.ra;
  const geomAlt = altitude(H, phi, c.dec);

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: geomAlt + astroRefraction(geomAlt),
  };
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model (1986) for apparent altitude correction
 * @param h - True geometric altitude in radians (clamped to -0.83° threshold)
 * @returns Refraction adjustment in radians (add to geometric altitude)
 * @remark Based on: https://en.wikipedia.org/wiki/Atmospheric_refraction
 *         Valid for h ≥ -0.83°. Extrapolates below with reduced accuracy.
 *         Typical error ±0.07° near horizon, ±0.02° above 20° altitude.
 */
export function astroRefraction(h: number): number {
  const { COEFF_DEG, OFFSET_DEG, DENOM_ADD_DEG, MIN_ALT_RAD } =
    REFRACTION_OPTIONS;

  h = Math.max(h, MIN_ALT_RAD); // Model valid down to -0.83° (≈1.02' refraction)
  const hDeg = h * (180 / PI);
  const adjustment = OFFSET_DEG / (hDeg + DENOM_ADD_DEG);
  const trueAltAdjustedDeg = hDeg + adjustment;
  const tanTerm = Math.tan(trueAltAdjustedDeg * DEGREE_IN_RADIANS);

  // Prevent division by zero (occurs below ~-5° clamped to -0.83°)
  return tanTerm !== 0 ? (COEFF_DEG / tanTerm) * DEGREE_IN_RADIANS : 0;
}

/** ================== Astronomical Event Detection ================== */

/**
 * Linear interpolation for crossing estimation between two time points
 * @internal Actual implementation details matter here - see numerical stability
 */
function linearInterpolateCrossing(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Avoid division by tiny dy which could amplify noise
  return dy === 0 ? x1 : x1 - y1 * (dx / dy);
}

/**
 * Detects altitude threshold crossings using linear search with adaptive window
 * @param config - Search parameters (start/end JD, threshold, evaluator)
 * @returns Object with rise/set JDs and flags for continuous visibility
 * @warning False negatives possible if windowSize > event duration. Ensure
 *          windowSize << eventInterval (e.g., 2hr window for daily events).
 */
export function findAltitudeCrossingEvents({
  start,
  end,
  evaluator,
  threshold,
  windowSize = DEFAULT_WINDOW_SIZE_DAYS,
}: EventWindow): {
  rise?: number;
  set?: number;
  alwaysUp?: boolean;
  alwaysDown?: boolean;
} {
  let current = start;
  let prevAlt = evaluator(start) - threshold;
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
      // Prefer earlier events on ambiguous zero-crossings
      prevAlt < 0 ? (result.rise = crossing) : (result.set = crossing);
    }

    prevAlt = nextAlt;
    current = next;
  }

  // Handle edge case: No crossings in window
  if (!result.rise && !result.set) {
    const meanAlt = evaluator(start + (end - start) / 2);
    meanAlt > 0 ? (result.alwaysUp = true) : (result.alwaysDown = true);
  }

  return result;
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Central-difference derivative with numerical stabilization
 * @param fn - Function to differentiate
 * @param t - Evaluation point (days)
 * @param delta - Step size (days ≈1.44 min)
 * @returns Derivative estimate df/dt at t (days⁻¹)
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  delta: number = DERIVATIVE_DELTA_DAYS,
): number {
  const f1 = fn(t + delta);
  const f2 = fn(t - delta);
  // Stabilize against machine precision limits
  return Math.abs(f1 - f2) < NUMERICAL_STABILITY_EPS
    ? 0
    : (f1 - f2) / (2 * delta);
}

/**
 * Newton-Raphson root finder with fallback to bisection if needed
 * @param seed - Initial guess (days)
 * @param evaluator - Function to find root of (f(t) = 0)
 * @param target - Target value (usually 0)
 * @param config - Tuning parameters for convergence
 * @returns Refined JD where |f(t)| < eps or max iterations reached
 * @note Iteration count kept low (15) for performance. May fail to converge
 *       for discontinuous or noisy functions - ensure smooth evaluator input.
 */
export function refineEvent(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: Partial<RefinementConfig> = {},
): number {
  const { deltaT, eps, maxSteps } = { ...DEFAULT_REFINEMENT, ...config };
  let t = seed;
  let f = evaluator(t) - target;

  for (let i = 0; i < maxSteps; i++) {
    const df = computeDerivative(evaluator, t, deltaT);
    if (Math.abs(f) < eps || Math.abs(df) < NUMERICAL_STABILITY_EPS) break;

    const step = f / df;
    // Avoid overshoot by dampening large steps
    t -= Math.abs(step) > 5 * deltaT ? Math.sign(step) * deltaT : step;
    f = evaluator(t) - target;
  }

  return t;
}

/** ================== Solar-Specific Calculations ================== */

/**
 * Calculates solar declination rate of change for transit time correction
 * @param sunCoordsDecFn - Solar declination function f(t) → dec(radians)
 * @param t - Days since J2000
 * @param delta - Derivation step (days)
 * @returns Declination rate in radians/day
 */
export function solarDeclinationRate(
  sunCoordsDecFn: (t: number) => number,
  t: number,
  delta: number = DERIVATIVE_DELTA_DAYS,
): number {
  return computeDerivative(sunCoordsDecFn, t, delta);
}

/** ================== Event Seed Generation ================== */

/**
 * Generates candidate event times around a reference date with spaced intervals
 * @param startJD - Search window start (Julian days)
 * @param endJD - Search window end (Julian days)
 * @param referenceJD - Anchor event JD (historical reference)
 * @param eventIntervalDays - Approx. period between events (e.g., ~365.25 days)
 * @param convergenceWindowDays - Window for refining each candidate
 * @returns Candidate JDs within [start - window, end + window]
 * @warning Assumes regular intervals. Actual irregular events (e.g., equinoxes)
 *          may require multiple reference seeds or adaptive intervals.
 */
export function generateEventSeeds(
  startJD: number,
  endJD: number,
  referenceJD: number,
  eventIntervalDays: number,
  convergenceWindowDays: number,
): number[] {
  const seeds: number[] = [];
  // Phase seeds backward from reference to cover start of window
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
 * Adds JD to array if not already present within time equality threshold
 * @param jds - Array to modify
 * @param jd - Candidate JD to add
 * @param eps - Equality threshold (days ≈1.44 min)
 */
export function addUniqueJD(
  jds: number[],
  jd: number,
  eps = TIME_EQUALITY_EPS,
): void {
  if (!jds.some((existing) => Math.abs(existing - jd) < eps)) {
    jds.push(jd);
  }
}
