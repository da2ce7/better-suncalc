/**
 * equinox.ts
 *
 * Equinox calculations: Finds March and September equinoxes using solar phases.
 * - Phase 0.0 corresponds to the March equinox (start of astronomical spring, Northern Hemisphere).
 * - Phase 0.5 corresponds to the September equinox (start of astronomical autumn, Northern Hemisphere).
 *
 * @warning Accuracy may degrade over very long time spans (e.g., ±10,000 years) due to variations in Earth's orbit.
 */

import { JulianDayTT } from "./constraints/types";
import { getSunPhases } from "./sunphase";

// Define the EquinoxData type with branded JulianDayTT
export type EquinoxData = {
  vernal: JulianDayTT[]; // March equinoxes as Julian days
  september: JulianDayTT[]; // September equinoxes as Julian days
};

/**
 * Calculate equinoxes within a date range using solar phases.
 * @param startJD - Start Julian day (Terrestrial Time, TT)
 * @param endJD - End Julian day (Terrestrial Time, TT)
 * @returns Object with March and September equinox JDs, sorted in ascending order
 */
export function getEquinoxes(
  startJD: JulianDayTT,
  endJD: JulianDayTT,
): EquinoxData {
  // Calculate March equinoxes at phase 0.0
  const vernal: JulianDayTT[] = getSunPhases(startJD, endJD, 0.0);

  // Calculate September equinoxes at phase 0.5
  const september: JulianDayTT[] = getSunPhases(startJD, endJD, 0.5);

  return { vernal, september };
}
