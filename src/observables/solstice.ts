/**
 * solstice.ts
 *
 * Solstice calculations: Finds June and December solstices using solar phases.
 * - Phase 0.25 corresponds to the June solstice (Northern summer).
 * - Phase 0.75 corresponds to the December solstice (Northern winter).
 *
 * @warning Accuracy may degrade over very long time spans (e.g., ±10,000 years) due to variations in Earth's orbit.
 */

import { JulianDayTT } from "../constraints/types";
import { getSunPhases } from "./sunphase";

// Define the SolsticeData type with branded JulianDayTT
export type SolsticeData = {
  summer: JulianDayTT[]; // Northern summer (June) solstices as Julian days
  winter: JulianDayTT[]; // Northern winter (December) solstices as Julian days
};

/**
 * Calculate solstices within a date range using solar phases.
 * @param startJD - Start Julian day (Terrestrial Time, TT)
 * @param endJD - End Julian day (Terrestrial Time, TT)
 * @returns Object with summer and winter solstice JDs, sorted in ascending order
 */
export function getSolstices(
  startJD: JulianDayTT,
  endJD: JulianDayTT,
): SolsticeData {
  // Calculate summer solstices (June) at phase 0.25
  const summer: JulianDayTT[] = getSunPhases(startJD, endJD, 0.25);

  // Calculate winter solstices (December) at phase 0.75
  const winter: JulianDayTT[] = getSunPhases(startJD, endJD, 0.75);

  return { summer, winter };
}
