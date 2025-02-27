/**
 * @file transits.ts
 *
 * A collection of astronomical functions for calculating transit times
 * (meridian crossings) of celestial objects for a given observer.
 *
 * Key features:
 * - Computes approximate and precise transit times using iterative methods.
 * - Handles TT➜UT1 conversions for Earth rotation accuracy via {@link ttToUT1}.
 * - Generalized for any celestial object when provided with coordinate functions.
 *
 * ## Usage
 * - **Transit Estimation**: Uses longitude-adjusted Julian days and hour angle
 *   calculations (Meeus Ch. 12, 13).
 * - **Precision Refinement**: Employs root-finding via {@link refineEvent}
 *   to pinpoint exact transit times when H = 0 (meridian crossing).
 *  *
 * @module transits
 * @see {@link https://www.willbell.com/math/mc1.htm Meeus, Astronomical Algorithms} - Core logic for GMST and transit approximation.
 * @see {@link jd_tt} Time scale conversions.
 * @see {@link utils.refineEvent} Root-finding implementation.
 *
 */

import {
  DAILY_DRIFT_DEGREES_PER_DAY,
  DAYS_PER_JULIAN_CENTURY,
  FULL_CIRCLE_DEGREES,
  GMST_COEFF_DEGREES,
  HALF_DAY,
  JULIAN_EPOCH_J2000,
  T_CUBED_DIVISOR,
  T_SQUARED_COEFF_DEGREES,
} from "./constraints/constants";
import { DEGREES_TO_RADIANS, PI, TAU } from "./constraints/math";
import { ttToUT1 } from "./jd_tt";
import { CelestialCoordinates, refineEvent } from "./utils";

export type PreciseTransitData = {
  julianCycle: number;
  transitJD: number;
};

/**
 * Estimates the integer Julian Day number corresponding to the observer’s local solar day,
 * adjusted for their western longitude and aligned approximately with local noon.
 *
 * This function takes a Julian Day in Terrestrial Time (TT) and shifts it based on the
 * observer’s longitude west of the Prime Meridian, then rounds to the nearest integer.
 * By subtracting `HALF_DAY`, the result approximates the Julian Day starting at local midnight,
 * aligning solar noon (~12h local time) with the middle of the Julian day.
 *
 * @param {number} westLongitudeRadians - Observer’s longitude west in radians (positive west of Prime Meridian). Must be in [-π, π].
 * @param {number} julianDayTT - Julian Day in Terrestrial Time (TT), days since JD 0.
 * @returns {number} An integer Julian Day number representing the observer’s local day.
 * @throws {RangeError} If longitude is outside [-π, π].
 */
export function approximateLocalJulianDay(
  westLongitudeRadians: number,
  julianDayTT: number,
): number {
  if (westLongitudeRadians < -PI || westLongitudeRadians > PI) {
    throw new RangeError("Longitude must be in [-π, π] radians.");
  }
  return Math.round(julianDayTT + westLongitudeRadians / TAU - HALF_DAY);
}

/**
 * Computes Greenwich Sidereal Time (GST) in radians for a given Julian Day (TT).
 * Converts TT to UT1 internally to align with Earth’s rotational time scale.
 *
 * Implements Meeus' approximation for GST (Equation 3.3 in "Astronomical Algorithms"),
 * adjusted internally to use Universal Time (UT1) for rotational accuracy.
 *
 * @param {number} jdTT - Julian Day in Terrestrial Time (TT), days since JD 0.
 * @returns {number} GST in radians, normalized to [0, 2π).
 * @see {@link ttToUT1} for TT to UT1 conversion.
 */
function getGSTRadians(jdTT: number): number {
  const jdUT1 = ttToUT1(jdTT); // Convert TT to UT1
  const T = (jdUT1 - JULIAN_EPOCH_J2000) / DAYS_PER_JULIAN_CENTURY; // Julian centuries since J2000

  // Meeus' approximation for GMST in degrees
  let gmstDegrees =
    GMST_COEFF_DEGREES +
    DAILY_DRIFT_DEGREES_PER_DAY * (jdUT1 - JULIAN_EPOCH_J2000) +
    T_SQUARED_COEFF_DEGREES * Math.pow(T, 2) -
    Math.pow(T, 3) / T_CUBED_DIVISOR;

  // Normalize to [0°, 360°)
  gmstDegrees =
    ((gmstDegrees % FULL_CIRCLE_DEGREES) + FULL_CIRCLE_DEGREES) %
    FULL_CIRCLE_DEGREES;

  return gmstDegrees * DEGREES_TO_RADIANS;
}

/**
 * Computes the hour angle of a celestial object at a reference time (TT),
 * converted to UT1 for Local Sidereal Time (LST) accuracy.
 *
 * Hour angle (H) is calculated as `H = LST - RA`, where LST is derived from GST
 * adjusted for the observer’s longitude. Angles wrap to [0, 2π).
 *
 * @param {number} referenceJulianDayTT - Reference Julian Day in TT. Converted to UT1 internally.
 * @param {number} westLongitudeRadians - Observer’s longitude west in radians (positive west of Prime Meridian).
 * @param {number} raRadians - Right ascension of the celestial object in radians.
 * @returns {number} Hour angle in radians (0 ≤ H < 2π).
 */
export function computeHourAngleAtRef(
  referenceJulianDayTT: number,
  westLongitudeRadians: number,
  raRadians: number,
): number {
  const gst = getGSTRadians(referenceJulianDayTT);
  const lst = gst - westLongitudeRadians; // Local Sidereal Time
  let hourAngle = (lst - raRadians) % TAU;
  return hourAngle < 0 ? hourAngle + TAU : hourAngle;
}

/**
 * Estimates the Julian Day of a celestial object's transit (meridian crossing)
 * using a linear approximation of Earth’s rotation.
 *
 * Transit occurs when the hour angle (H) is 0. This assumes Earth rotates at
 * a constant rate of 2π radians per sidereal day. For higher precision, iterate
 * with updated RA/dec values.
 *
 * @param {number} westLongitudeRadians - Observer’s longitude west in radians.
 * @param {number} julianDayTT - Initial guess Julian Day in TT. Converted to UT1 internally.
 * @param {number} raRadians - Right ascension of the object in radians.
 * @returns {number} Estimated transit time in Julian Day (TT).
 */
export function estimateTransitTime(
  westLongitudeRadians: number,
  julianDayTT: number,
  raRadians: number,
): number {
  const referenceJulianDay = approximateLocalJulianDay(
    westLongitudeRadians,
    julianDayTT,
  );
  const hourAngleAtRef = computeHourAngleAtRef(
    referenceJulianDay,
    westLongitudeRadians,
    raRadians,
  );
  // Earth rotates at ~2π radians per solar day (~366.24 sidereal rotations/year)
  return referenceJulianDay - hourAngleAtRef / TAU;
}

/**
 * Generalized refined transit finder.
 * @param {number} referenceJulianCycle - Reference cycle number for iteration.
 * @param {number} lw - Observer's west longitude (radians).
 * @param {(jd_tt: number) => CelestialCoordinates} getObjectCoords - Function to compute celestial object's coordinates.
 * @returns {number} Precise JD TT of transit for the given cycle.
 */
export function getPreciseTransitForCycle(
  referenceJulianCycle: number,
  lw: number,
  getObjectCoords: (jd_tt: number) => CelestialCoordinates,
): number {
  // Generalized transit estimation from existing code
  const jd_initial = estimateTransitTime(
    lw,
    referenceJulianCycle,
    getObjectCoords(referenceJulianCycle).ra,
  );

  const evaluator = (jd_tt: number): number => {
    const coords = getObjectCoords(jd_tt);
    const gmst = getGSTRadians(jd_tt);
    const lst = (gmst - lw + TAU) % TAU;
    let diff = lst - coords.ra;
    // Normalize to [-π, π)
    if (diff > PI) diff -= TAU;
    if (diff < -PI) diff += TAU;
    return diff;
  };

  return refineEvent(jd_initial, evaluator, 0); // Assuming refineEvent is implemented
}

/**
 * Finds the closest transit cycle for any celestial object.
 * @param {number} jd_tt - Reference JD TT for the search.
 * @param {number} lw - Observer's longitude west (radians).
 * @param {(jd_tt: number) => CelestialCoordinates} getObjectCoords - Coordinates function.
 * @param {number} [maxCycleErrorDays=HALF_DAY] - Window to compare adjacent cycles (default for daily transits).
 * @returns {PreciseTransitData} Closest transit cycle and JD TT.
 */
export function getClosestTransitCycle(
  jd_tt: number,
  lw: number,
  getObjectCoords: (jd_tt: number) => CelestialCoordinates,
  maxCycleErrorDays: number = HALF_DAY,
): PreciseTransitData {
  // Generalized cycle estimation using existing transit tools
  const initialCycle = Math.round(approximateLocalJulianDay(lw, jd_tt));

  const t_n_precise = getPreciseTransitForCycle(
    initialCycle,
    lw,
    getObjectCoords,
  );
  const diff_n = Math.abs(t_n_precise - jd_tt);

  if (diff_n <= maxCycleErrorDays) {
    return { julianCycle: initialCycle, transitJD: t_n_precise };
  }

  const adjacentCycle =
    t_n_precise < jd_tt ? initialCycle + 1 : initialCycle - 1;
  const t_adjacent = getPreciseTransitForCycle(
    adjacentCycle,
    lw,
    getObjectCoords,
  );
  const diff_adjacent = Math.abs(t_adjacent - jd_tt);

  return diff_adjacent < diff_n
    ? { julianCycle: adjacentCycle, transitJD: t_adjacent }
    : { julianCycle: initialCycle, transitJD: t_n_precise };
}
