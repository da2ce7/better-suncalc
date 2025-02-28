/**
 * moonphase.ts
 *
 * Moon phase calculations: Finds times when the moon is at a specified phase within a given JD TT range.
 * Phases are defined between 0 (new moon) and 1, with 0.5 being full moon, etc.
 *
 * @warning Accuracy may degrade over very long time spans due to perturbations in the moon's orbit.
 */

import { LUNAR } from "../constraints/constants/lunar";
import { JULIAN_EPOCH_J2000 } from "../constraints/constants/time";
import { Days, JulianDayTT } from "../constraints/types";
import {
  addUniqueJulianDate,
  generateEventCandidates,
} from "../events/celestial/seed-finders";
import { getMoonIllumination } from "../mooncalc";

/**
 * Finds all times within a JD TT range when the moon is at a specified phase.
 *
 * @param startJD - Start of the JD TT range (inclusive)
 * @param endJD - End of the JD TT range (inclusive)
 * @param targetPhase - Desired moon phase (0 to 1, where 0 is new moon, 0.5 is full moon, etc.)
 * @returns Array of JD TT values when the moon is at the target phase, sorted in ascending order
 * @throws Error if targetPhase is not in [0,1)
 */
export function getMoonPhases(
  startJD: JulianDayTT,
  endJD: JulianDayTT,
  targetPhase: number,
): JulianDayTT[] {
  // Ensure startJD is less than or equal to endJD by swapping if necessary
  let start: JulianDayTT = startJD;
  let end: JulianDayTT = endJD;
  if (start > end) [start, end] = [end, start];

  // Validate targetPhase
  if (targetPhase < 0 || targetPhase >= 1) {
    throw new Error("Target phase must be in [0,1)");
  }

  // Calculate the reference JD for the target phase based on the new moon reference
  const phaseOffset: Days = (targetPhase * LUNAR.PHASES.SYNODIC_MONTH) as Days;
  const referenceJD: JulianDayTT = addDaysToJD(
    LUNAR.PHASES.REFERENCE_NEW_MOON,
    phaseOffset,
  );

  // Generate approximate seed times for the target phase events
  const seeds: JulianDayTT[] = generateEventCandidates(
    start,
    end,
    referenceJD,
    LUNAR.PHASES.SYNODIC_MONTH,
    5 as Days, // Convergence window of 5 days to ensure all events are captured
  );

  const results: JulianDayTT[] = [];

  // Refine each seed to find the exact JD where the moon's phase matches the target phase
  for (const jdSeed of seeds) {
    // Convert seed JD to days since J2000 for refinement
    const tSeed: Days = subtractJDs(jdSeed, JULIAN_EPOCH_J2000);

    // Define the evaluator function: difference between current phase and target phase
    const evaluator = (t: Days): number =>
      getMoonIllumination(addDaysToJD(JULIAN_EPOCH_J2000, t)).phase -
      targetPhase;

    // Refine the seed to find where the evaluator equals zero
    const tRefined: Days = refineEvent(
      tSeed,
      evaluator as (t: number) => number,
      0,
    ) as Days;
    const jdRefined: JulianDayTT = addDaysToJD(JULIAN_EPOCH_J2000, tRefined);

    // Include the refined JD if it falls within the specified range
    if (jdRefined >= start && jdRefined <= end) {
      addUniqueJulianDate(results, jdRefined);
    }
  }

  // Sort the results in ascending order
  results.sort((a, b) => a - b);
  return results;
}
function subtractJDs(
  jdSeed: JulianDayTT,
  JULIAN_EPOCH_J2000: JulianDayTT,
): Days {
  throw new Error("Function not implemented.");
}

function addDaysToJD(JULIAN_EPOCH_J2000: JulianDayTT, t: Days): JulianDayTT {
  throw new Error("Function not implemented.");
}
