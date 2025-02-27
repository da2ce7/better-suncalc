/**
 * moonphase.ts
 *
 * Moon phase calculations: Finds times when the moon is at a specified phase within a given JD TT range.
 * Phases are defined between 0 (new moon) and 1, with 0.5 being full moon, etc.
 *
 * @warning Accuracy may degrade over very long time spans due to perturbations in the moon's orbit.
 */

import {
  JULIAN_EPOCH_J2000,
  REFERENCE_NEW_MOON_JD,
  SYNODIC_MONTH_DAYS,
} from "./constraints/constants";
import { getMoonIllumination } from "./mooncalc";
import { addUniqueJD, generateEventSeeds, refineEvent } from "./utils";

/**
 * Finds all times within a JD TT range when the moon is at a specified phase.
 *
 * @param startJD Start of the JD TT range (inclusive)
 * @param endJD End of the JD TT range (inclusive)
 * @param targetPhase Desired moon phase (0 to 1, where 0 is new moon, 0.5 is full moon, etc.)
 * @returns Array of JD TT values when the moon is at the target phase, sorted in ascending order
 * @throws Error if targetPhase is not in [0,1)
 */
export function getMoonPhases(
  startJD: number,
  endJD: number,
  targetPhase: number,
): number[] {
  // Ensure startJD is less than or equal to endJD
  if (startJD > endJD) [startJD, endJD] = [endJD, startJD];

  // Validate targetPhase
  if (targetPhase < 0 || targetPhase >= 1) {
    throw new Error("Target phase must be in [0,1)");
  }

  // Calculate the reference JD for the target phase based on the new moon reference
  const referenceJD = REFERENCE_NEW_MOON_JD + targetPhase * SYNODIC_MONTH_DAYS;

  // Generate approximate seed times for the target phase events
  const seeds = generateEventSeeds(
    startJD,
    endJD,
    referenceJD,
    SYNODIC_MONTH_DAYS,
    5, // Convergence window of 5 days to ensure all events are captured
  );

  const results: number[] = [];

  // Refine each seed to find the exact JD where the moon's phase matches the target phase
  for (const jdSeed of seeds) {
    // Convert seed JD to days since J2000 for refinement
    const tSeed = jdSeed - JULIAN_EPOCH_J2000;

    // Define the evaluator function: difference between current phase and target phase
    const evaluator = (t: number) =>
      getMoonIllumination(t + JULIAN_EPOCH_J2000).phase - targetPhase;

    // Refine the seed to find where the evaluator equals zero
    const tRefined = refineEvent(tSeed, evaluator, 0);
    const jdRefined = tRefined + JULIAN_EPOCH_J2000;

    // Include the refined JD if it falls within the specified range
    if (jdRefined >= startJD && jdRefined <= endJD) {
      addUniqueJD(results, jdRefined);
    }
  }

  // Sort the results in ascending order
  results.sort((a, b) => a - b);
  return results;
}
