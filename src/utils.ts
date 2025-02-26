/**
 * utils.ts
 *
 * Astronomy Utilities: Shared functions for celestial calculations, time conversions,
 * and numerical methods used in astronomical computations.
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
 * Converts Date object to Julian Day Number
 * @param date - JavaScript Date object
 * @returns Julian day number (days since 4713 BC Jan 1)
 */
export function dateToJulian(date: Date): number {
  return date.getTime() / DAY_IN_MS - 0.5 + J1970;
}

/**
 * Converts Julian Day Number to Date object
 * @param j - Julian day number
 * @returns JavaScript Date object corresponding to UTC time
 */
export function julianToDate(j: number): Date {
  return new Date((j + 0.5 - J1970) * DAY_IN_MS);
}

/**
 * Creates new Date object offset by specified hours from original
 * @param date - Base date for calculation
 * @param hours - Number of hours to add (can be negative)
 * @returns New Date object offset by given hours
 */
export function hoursLater(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * HOUR_IN_MS);
}

/**
 * Converts Julian day number to days since J2000 epoch
 * @param j - Julian day number
 * @returns Days since 2000-01-01 12:00 TD
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
 * Calculates sidereal time (apparent star time) for given days since J2000
 * @param d - Days since J2000 epoch
 * @param lw - Longitude west in radians
 * @returns Sidereal time in radians
 */
export function siderealTime(d: number, lw: number): number {
  return DEGREE_IN_RADIANS * (280.16 + 360.9856235 * d) - lw;
}

/**
 * Calculates sun's altitude angle (geometric altitude before refraction correction)
 * @param H - Hour angle in radians
 * @param phi - Observer's latitude in radians
 * @param dec - Sun's declination in radians
 * @returns Altitude angle in radians
 */
export function altitude(H: number, phi: number, dec: number): number {
  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

/**
 * Calculates azimuth angle for the sun
 * @param H - Hour angle in radians
 * @param phi - Observer's latitude in radians
 * @param dec - Sun's declination in radians
 * @returns Azimuth angle in radians (clockwise from north)
 */
export function azimuth(H: number, phi: number, dec: number): number {
  return atan2(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}

/**
 * Calculates observed celestial position including atmospheric effects
 * @param jd - Julian day number (J2000-based)
 * @param lat - Observer's latitude in degrees
 * @param lng - Observer's longitude in degrees
 * @param coordFn - Coordinate calculation function (returns RA/Dec)
 * @returns Object containing observed azimuth (rad, 0-2π) and altitude (rad)
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
 * Calculates atmospheric refraction using Saemundsson's formula
 * @param h - True geometric altitude in RADIANS (negative values allowed)
 * @returns Refraction adjustment in RADIANS to add to geometric altitude
 */
export function astroRefraction(h: number): number {
  const { COEFF_DEG, OFFSET_DEG, DENOM_ADD_DEG, MIN_ALT_RAD } =
    REFRACTION_OPTIONS;

  h = Math.max(h, MIN_ALT_RAD); // Ensure no invalid angles
  const hDeg = h * (180 / PI); // Convert input to degrees
  const adjustment = OFFSET_DEG / (hDeg + DENOM_ADD_DEG); // 10.3/(h + 5.11)
  const trueAltAdjustedDeg = hDeg + adjustment; // Adjusted altitude
  const tanTerm = Math.tan(trueAltAdjustedDeg * DEGREE_IN_RADIANS);

  // Apply Saemundsson: R = COEFF_DEG / tan(trueAltAdjusted_rad)
  const refractionDeg = COEFF_DEG / tanTerm;

  return refractionDeg * DEGREE_IN_RADIANS; // Convert result back to radians
}

/** ================== Astronomical Event Detection ================== */

/**
 * Linear interpolation for threshold crossing between two time points
 * @internal Private helper for event detection
 */
function linearInterpolateCrossing(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return x1 - y1 * (dx / dy);
}

/**
 * Detects astronomical rise/set events using altitude thresholds
 * @param config - Event detection configuration parameters
 * @returns Object with event times and visibility flags
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
      prevAlt < 0 ? (result.rise = crossing) : (result.set = crossing);
    }

    prevAlt = nextAlt;
    current = next;
  }

  if (!result.rise && !result.set) {
    const mainAlt = evaluator(start + (end - start) / 2);
    mainAlt > 0 ? (result.alwaysUp = true) : (result.alwaysDown = true);
  }

  return result;
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Computes numerical derivative of function at given point
 * @param fn - Function to differentiate
 * @param t - Evaluation point (days)
 * @param delta - Step size for finite difference (days)
 * @returns Central difference derivative df/dt|t
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  delta: number = DERIVATIVE_DELTA_DAYS,
): number {
  const f1 = fn(t + delta);
  const f2 = fn(t - delta);
  return (f1 - f2) / (2 * delta);
}

/**
 * Refines event time using numerical root-finding
 * @param seed - Initial event estimate (days)
 * @param evaluator - Target function f(t) = 0 at solution
 * @param target - Function target value (typically 0)
 * @param config - Refinement parameters
 * @returns Improved estimate of event time (days)
 */
export function refineEvent(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: Partial<RefinementConfig> = {},
): number {
  const { deltaT, eps, maxSteps } = { ...DEFAULT_REFINEMENT, ...config };
  let t = seed;

  for (let i = 0; i < maxSteps; i++) {
    const f = evaluator(t) - target;
    const f1 = evaluator(t + deltaT);
    const f0 = evaluator(t - deltaT);
    const df = (f1 - f0) / (2 * deltaT);

    if (Math.abs(df) < NUMERICAL_STABILITY_EPS || Math.abs(f) < eps) break;
    t -= f / df;
  }

  return t;
}

/** ================== Solar-Specific Calculations ================== */

/**
 * Solar-specific declination rate calculation
 * @param sunCoordsDecFn - Declination calculation function
 * @param t - Days since J2000
 * @param delta - Timestep for derivative (days)
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
 * Generates equidistant candidate JDs for event search
 * @param startJD - Start of search range
 * @param endJD - End of search range
 * @param referenceJD - Known event JD to anchor seeds
 * @param eventIntervalDays - Approximate period between events
 * @param convergenceWindowDays - Search window around seeds
 * @returns Array of candidate Julian days
 */
export function generateEventSeeds(
  startJD: number,
  endJD: number,
  referenceJD: number,
  eventIntervalDays: number,
  convergenceWindowDays: number,
): number[] {
  const seeds: number[] = [];
  const start =
    referenceJD -
    Math.ceil(
      (referenceJD - (startJD - convergenceWindowDays)) / eventIntervalDays,
    ) *
      eventIntervalDays;

  for (
    let jd = start;
    jd < endJD + convergenceWindowDays;
    jd += eventIntervalDays
  ) {
    if (jd > startJD - convergenceWindowDays) seeds.push(jd);
  }

  return seeds;
}

/** ================== Data Management Utilities ================== */

/**
 * Adds Julian day to list with duplication protection
 * @param jds - Array of existing Julian days
 * @param jd - New day to potentially add
 * @param eps - Time equality threshold (days)
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
