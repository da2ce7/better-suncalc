/**
 * Solstice calculations: Finds June/December solstices (peak declinations)
 * @warning Accuracy degrades beyond ±10,000 years due to orbital model limitations!
 */

import {
  CONVERGENCE_WINDOW,
  J2000,
  REFERENCE_SUMMER_JD,
  TROPICAL_YEAR,
} from "./constants";
import { sunCoords } from "./suncalc";
import {
  addUniqueJD,
  generateEventSeeds,
  refineEvent,
  solarDeclinationRate as utilSolarDeclinationRate,
} from "./utils";

export type SolsticeData = {
  summer: number[]; // Northern summer (June) solstices as Julian days
  winter: number[]; // Northern winter (December) solstices
};

/**
 * Calculate solstices within a date range
 * @param startJD Start Julian day
 * @param endJD End Julian day
 * @returns Object with summer/winter solstice JDs sorted ascending
 */
export function getSolstices(startJD: number, endJD: number): SolsticeData {
  if (startJD > endJD) [startJD, endJD] = [endJD, startJD];

  // Generate seeds from both solstice references
  const seeds = generateEventSeeds(
    startJD,
    endJD,
    REFERENCE_SUMMER_JD,
    TROPICAL_YEAR,
    CONVERGENCE_WINDOW,
  ).concat(
    generateEventSeeds(
      startJD,
      endJD,
      REFERENCE_SUMMER_JD + 0.5 * TROPICAL_YEAR,
      TROPICAL_YEAR,
      CONVERGENCE_WINDOW,
    ),
  );

  return validateSolstices(seeds, startJD, endJD);
}

/**
 * Refines seeds into solstice JDs, classifying by declination sign
 */
function validateSolstices(
  seeds: number[],
  startJD: number,
  endJD: number,
): SolsticeData {
  const data: SolsticeData = { summer: [], winter: [] };

  const declinationRate = (t: number) =>
    utilSolarDeclinationRate((innerT) => sunCoords(innerT).dec, t);

  for (const jdApprox of seeds) {
    const t = jdApprox - J2000;

    // Refine where declination rate is zero (peak)
    const refinedJD = refineEvent(t, declinationRate, 0) + J2000;

    // Validate JD range
    if (refinedJD < startJD || refinedJD > endJD) continue;

    // Classify by declination (+ = summer, - = winter)
    const dec = sunCoords(refinedJD - J2000).dec;
    if (dec > 0) {
      addUniqueJD(data.summer, refinedJD);
    } else {
      addUniqueJD(data.winter, refinedJD);
    }
  }

  // Sort results chronologically
  data.summer.sort((a, b) => a - b);
  data.winter.sort((a, b) => a - b);
  return data;
}
