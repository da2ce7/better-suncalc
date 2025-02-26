/**
 * equinox.ts
 *
 * Equinox calculations: Finds March/September equinoxes (zero solar declination)
 * @warning Accuracy declines beyond ±10,000 years due to orbital model J2000 assumptions!
 */

import {
  CONVERGENCE_WINDOW,
  J2000,
  REFERENCE_EQUINOX_JD,
  TROPICAL_YEAR,
} from "./constants";
import { sunCoords } from "./suncalc";
import {
  addUniqueJD,
  generateEventSeeds,
  refineEvent,
  solarDeclinationRate as utilSolarDeclinationRate,
} from "./utils";

export type EquinoxData = {
  vernal: number[]; // March equinoxes (northward declination)
  autumnal: number[]; // September equinoxes (southward declination)
};

/**
 * Calculate equinoxes within a date range
 * @param startJD Start Julian day
 * @param endJD End Julian day
 * @returns Object with equinox JDs sorted ascending
 */
export function getEquinoxes(startJD: number, endJD: number): EquinoxData {
  if (startJD > endJD) [startJD, endJD] = [endJD, startJD];

  // Generate seeds at half-year intervals from reference equinox
  const seeds = generateEventSeeds(
    startJD,
    endJD,
    REFERENCE_EQUINOX_JD,
    0.5 * TROPICAL_YEAR,
    CONVERGENCE_WINDOW,
  );

  return validateEquinoxes(seeds, startJD, endJD);
}

/**
 * Refines seeds into equinox JDs, classifying by declination slope
 */
function validateEquinoxes(
  seeds: number[],
  startJD: number,
  endJD: number,
): EquinoxData {
  const data: EquinoxData = { vernal: [], autumnal: [] };

  const declinationRate = (t: number) =>
    utilSolarDeclinationRate((innerT) => sunCoords(innerT).dec, t);

  for (const jdApprox of seeds) {
    const t = jdApprox - J2000;

    // Refine to declination = 0 with NR
    const refinedJD = refineEvent(t, (t) => sunCoords(t).dec, 0) + J2000;

    if (refinedJD < startJD || refinedJD > endJD) continue;

    // Check declination rate to distinguish vernal (positive rate) vs autumnal
    const rate = declinationRate(refinedJD - J2000);
    if (rate > 0) {
      addUniqueJD(data.vernal, refinedJD); // Heading north -> March equinox
    } else {
      addUniqueJD(data.autumnal, refinedJD);
    }
  }

  data.vernal.sort((a, b) => a - b);
  data.autumnal.sort((a, b) => a - b);
  return data;
}
