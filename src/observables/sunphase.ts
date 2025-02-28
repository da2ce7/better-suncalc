/**
 * sunphase.ts
 *
 * Calculates the times within a given JD TT range when the sun reaches a specified phase.
 * The phase is a fraction of the tropical year (0 to 1), where:
 * - 0.0 corresponds to the March equinox (start of astronomical spring, Northern Hemisphere),
 * - 0.25 is the June solstice,
 * - 0.5 is the September equinox,
 * - 0.75 is the December solstice.
 *
 * @warning Accuracy may degrade over very long time spans due to variations in Earth's orbit.
 */

import { EARTH } from "../constraints/constants/earth";
import { JULIAN_EPOCH_J2000 } from "../constraints/constants/time";
import { PI, TAU } from "../constraints/math";
import { Days, JulianDayTT, Radians } from "../constraints/types";
import {
  addUniqueJulianDate,
  generateEventCandidates,
} from "../events/celestial/seed-finders";
import { eclipticLongitude } from "../suncoords";

/**
 * Finds all times within a JD TT range when the sun is at a specified phase.
 *
 * @param startJD Start of the JD TT range (inclusive)
 * @param endJD End of the JD TT range (inclusive)
 * @param targetPhase Desired sun phase (between 0 inclusive and 1 exclusive)
 * @returns Array of JD TT values when the sun is at the target phase, sorted in ascending order
 * @throws Error if targetPhase is not in [0,1)
 */
export function getSunPhases(
  startJD: JulianDayTT,
  endJD: JulianDayTT,
  targetPhase: number,
): JulianDayTT[] {
  // Normalize the range to ensure startJD <= endJD
  if (startJD > endJD) {
    [startJD, endJD] = [endJD, startJD];
  }

  // Validate the target phase
  if (targetPhase < 0 || targetPhase >= 1) {
    throw new Error("Target phase must be in [0,1)");
  }

  // Calculate the reference JD for the target phase relative to the reference March equinox
  const referenceJD = (EARTH.SEASONAL_EVENTS.VERNAL_EQUINOX_2000 +
    targetPhase * EARTH.ORBIT.TROPICAL_YEAR) as JulianDayTT;

  // Generate approximate seed times for the phase events within the range
  const seeds = generateEventCandidates(
    startJD,
    endJD,
    EARTH.SEASONAL_EVENTS.VERNAL_EQUINOX_2000 as JulianDayTT,
    EARTH.ORBIT.TROPICAL_YEAR as Days,
    5 as Days,
  ) as JulianDayTT[];

  const results: JulianDayTT[] = [];

  // Define the target ecliptic longitude in radians (phase fraction of a full circle)
  const targetLongitude = (TAU * targetPhase) as Radians;

  // Refine each seed to find the exact JD when the sun's ecliptic longitude matches the target
  for (const jdSeed of seeds) {
    // Convert JD to days since J2000 for calculations
    const tSeed = (jdSeed - JULIAN_EPOCH_J2000) as Days;

    // Evaluator function: computes the difference between current and target ecliptic longitude
    const evaluator = (t: JulianDayTT): number => {
      const L = eclipticLongitude(t); // Corrected: use t instead of M
      // Normalize longitude to [0, 2π)
      const adjustedL = (((L % TAU) + TAU) % TAU) as Radians;
      // Compute the smallest angular difference, accounting for periodicity
      const diff = adjustedL - targetLongitude;
      return ((diff + PI) % TAU) - PI;
    };

    // Refine the seed to find the exact time where the evaluator is zero
    const tRefined = refineEvent(
      tSeed,
      evaluator as (t: number) => number,
      0,
    ) as Days;
    const jdRefined = (tRefined + JULIAN_EPOCH_J2000) as JulianDayTT;

    // Add the refined JD to results if it falls within the specified range
    if (jdRefined >= startJD && jdRefined <= endJD) {
      addUniqueJulianDate(results, jdRefined);
    }
  }

  // Return the results sorted in ascending order
  results.sort((a, b) => a - b);
  return results;
}
