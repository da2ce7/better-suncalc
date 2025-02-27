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
 *
 * @module transits
 * @see {@link https://www.willbell.com/math/mc1.htm Meeus, Astronomical Algorithms}
 * @see {@link jd_tt} Time scale conversions
 * @see {@link utils.refineEvent} Root-finding implementation
 */

import { SIDEREAL } from "./constraints/earth";
import {
  DEGREES_TO_RADIANS,
  FULL_CIRCLE_DEGREES,
  PI,
  TAU,
} from "./constraints/math";
import {
  DAYS_PER_JULIAN_CENTURY,
  HALF_DAY,
  JULIAN_EPOCH_J2000,
} from "./constraints/time";
import {
  Degrees,
  JulianCenturyUT1,
  JulianDayTT,
  JulianDayUT1,
  Radians,
} from "./constraints/types";
import { ttToUT1 } from "./terrestrialtime";
import { CelestialCoordinates, refineEvent } from "./utils";

// Update PreciseTransitData to use branded types
export type PreciseTransitData = {
  julianCycle: JulianDayTT;
  transitJD: JulianDayTT;
};

/**
 * Estimates the integer Julian Day number corresponding to the observer’s local solar day,
 * adjusted for their western longitude and aligned approximately with local noon.
 *
 * @param {Radians} westLongitudeRadians - Observer’s longitude west in radians (positive west of Prime Meridian). Must be in [-π, π].
 * @param {JulianDayTT} julianDayTT - Julian Day in Terrestrial Time (TT), days since JD 0.
 * @returns {JulianDayTT} An integer Julian Day number representing the observer’s local day.
 * @throws {RangeError} If longitude is outside [-π, π].
 */
export function approximateLocalJulianDay(
  westLongitudeRadians: Radians,
  julianDayTT: JulianDayTT,
): JulianDayTT {
  if (westLongitudeRadians < -PI || westLongitudeRadians > PI) {
    throw new RangeError("Longitude must be in [-π, π] radians.");
  }
  const adjustedJD = julianDayTT + westLongitudeRadians / TAU - HALF_DAY;
  return Math.round(adjustedJD) as JulianDayTT;
}

/**
 * Computes Greenwich Sidereal Time (GST) in radians for a given Julian Day (TT).
 * Converts TT to UT1 internally to align with Earth’s rotational time scale.
 *
 * @param {JulianDayTT} jdTT - Julian Day in Terrestrial Time (TT), days since JD 0.
 * @returns {Radians} GST in radians, normalized to [0, 2π).
 */
function getGSTRadians(jdTT: JulianDayTT): Radians {
  const jdUT1: JulianDayUT1 = ttToUT1(jdTT);
  const T: JulianCenturyUT1 = ((jdUT1 - JULIAN_EPOCH_J2000) /
    DAYS_PER_JULIAN_CENTURY) as JulianCenturyUT1;
  const gmstDegreesNumber =
    SIDEREAL.GMST.BASE +
    SIDEREAL.GMST.DRIFT_RATE * (jdUT1 - JULIAN_EPOCH_J2000) +
    SIDEREAL.GMST.T_SQUARED_COEFF * Math.pow(T, 2) -
    Math.pow(T, 3) / SIDEREAL.GMST.T_CUBED_DIVISOR;
  const gmstDegrees: Degrees = (((gmstDegreesNumber % FULL_CIRCLE_DEGREES) +
    FULL_CIRCLE_DEGREES) %
    FULL_CIRCLE_DEGREES) as Degrees;
  return (gmstDegrees * DEGREES_TO_RADIANS) as Radians;
}

/**
 * Computes the hour angle of a celestial object at a reference time (TT),
 * converted to UT1 for Local Sidereal Time (LST) accuracy.
 *
 * @param {JulianDayTT} referenceJulianDayTT - Reference Julian Day in TT. Converted to UT1 internally.
 * @param {Radians} westLongitudeRadians - Observer’s longitude west in radians (positive west of Prime Meridian).
 * @param {Radians} raRadians - Right ascension of the celestial object in radians.
 * @returns {Radians} Hour angle in radians (0 ≤ H < 2π).
 */
export function computeHourAngleAtRef(
  referenceJulianDayTT: JulianDayTT,
  westLongitudeRadians: Radians,
  raRadians: Radians,
): Radians {
  const gst: Radians = getGSTRadians(referenceJulianDayTT);
  const lst: Radians = ((((gst - westLongitudeRadians) % TAU) + TAU) %
    TAU) as Radians;
  let hourAngle: Radians = ((lst - raRadians) % TAU) as Radians;
  return hourAngle < 0 ? ((hourAngle + TAU) as Radians) : hourAngle;
}

/**
 * Estimates the Julian Day of a celestial object's transit (meridian crossing)
 * using a linear approximation of Earth’s rotation.
 *
 * @param {Radians} westLongitudeRadians - Observer’s longitude west in radians.
 * @param {JulianDayTT} julianDayTT - Initial guess Julian Day in TT. Converted to UT1 internally.
 * @param {Radians} raRadians - Right ascension of the object in radians.
 * @returns {JulianDayTT} Estimated transit time in Julian Day (TT).
 */
export function estimateTransitTime(
  westLongitudeRadians: Radians,
  julianDayTT: JulianDayTT,
  raRadians: Radians,
): JulianDayTT {
  const referenceJulianDay: JulianDayTT = approximateLocalJulianDay(
    westLongitudeRadians,
    julianDayTT,
  );
  const hourAngleAtRef: Radians = computeHourAngleAtRef(
    referenceJulianDay,
    westLongitudeRadians,
    raRadians,
  );
  return (referenceJulianDay - hourAngleAtRef / TAU) as JulianDayTT;
}

/**
 * Generalized refined transit finder.
 * @param {JulianDayTT} referenceJulianCycle - Reference cycle number for iteration.
 * @param {Radians} lw - Observer's west longitude (radians).
 * @param {(jd_tt: JulianDayTT) => CelestialCoordinates} getObjectCoords - Function to compute celestial object's coordinates.
 * @returns {JulianDayTT} Precise JD TT of transit for the given cycle.
 */
export function getPreciseTransitForCycle(
  referenceCycleJdTT: JulianDayTT,
  westLongitudeRad: Radians,
  getObjectCoords: (jd_tt: JulianDayTT) => CelestialCoordinates,
): JulianDayTT {
  const initialTransitEstimateJdTT: JulianDayTT = estimateTransitTime(
    westLongitudeRad,
    referenceCycleJdTT,
    getObjectCoords(referenceCycleJdTT).ra,
  );

  const evaluator = (jd_tt: JulianDayTT): number => {
    const coords = getObjectCoords(jd_tt);
    const gmst: Radians = getGSTRadians(jd_tt);
    const lst: Radians = ((gmst - westLongitudeRad + TAU) % TAU) as Radians;
    let diff = lst - coords.ra;
    if (diff > PI) diff -= TAU;
    if (diff < -PI) diff += TAU;
    return diff;
  };

  return refineEvent(
    initialTransitEstimateJdTT as number,
    evaluator as (t: number) => number,
    0,
  ) as JulianDayTT;
}

/**
 * Finds the closest transit cycle for any celestial object.
 * @param {JulianDayTT} jd_tt - Reference JD TT for the search.
 * @param {Radians} lw - Observer's longitude west (radians).
 * @param {(jd_tt: JulianDayTT) => CelestialCoordinates} getObjectCoords - Coordinates function.
 * @param {number} [maxCycleErrorDays=HALF_DAY] - Window to compare adjacent cycles (default for daily transits).
 * @returns {PreciseTransitData} Closest transit cycle and JD TT.
 */
export function getClosestTransitCycle(
  jd_tt: JulianDayTT,
  lw: Radians,
  getObjectCoords: (jd_tt: JulianDayTT) => CelestialCoordinates,
  maxCycleErrorDays = HALF_DAY,
): PreciseTransitData {
  const initialCycle: JulianDayTT = Math.round(
    approximateLocalJulianDay(lw, jd_tt),
  ) as JulianDayTT;
  const t_n_precise: JulianDayTT = getPreciseTransitForCycle(
    initialCycle,
    lw,
    getObjectCoords,
  );
  const diff_n = Math.abs(t_n_precise - jd_tt);

  if (diff_n <= maxCycleErrorDays) {
    return { julianCycle: initialCycle, transitJD: t_n_precise };
  }

  const adjacentCycle: JulianDayTT = (
    t_n_precise < jd_tt ? initialCycle + 1 : initialCycle - 1
  ) as JulianDayTT;
  const t_adjacent: JulianDayTT = getPreciseTransitForCycle(
    adjacentCycle,
    lw,
    getObjectCoords,
  );
  const diff_adjacent = Math.abs(t_adjacent - jd_tt);

  return diff_adjacent < diff_n
    ? { julianCycle: adjacentCycle, transitJD: t_adjacent }
    : { julianCycle: initialCycle, transitJD: t_n_precise };
}
