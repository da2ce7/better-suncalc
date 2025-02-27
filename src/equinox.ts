/**
 * equinox.ts
 *
 * Equinox calculations: Finds March and September equinoxes using solar phases.
 * - Phase 0.0 corresponds to the March equinox (start of astronomical spring, Northern Hemisphere).
 * - Phase 0.5 corresponds to the September equinox (start of astronomical autumn, Northern Hemisphere).
 *
 * @warning Accuracy may degrade over very long time spans (e.g., ±10,000 years) due to variations in Earth's orbit.
 */

import { getSunPhases } from "./sunphase";

export type EquinoxData = {
  vernal: number[]; // March equinoxes as Julian days
  september: number[]; // September equinoxes as Julian days
};

/**
 * Calculate equinoxes within a date range using solar phases.
 * @param startJD Start Julian day (Terrestrial Time, TT)
 * @param endJD End Julian day (Terrestrial Time, TT)
 * @returns Object with March and September equinox JDs, sorted in ascending order
 */
export function getEquinoxes(startJD: number, endJD: number): EquinoxData {
  // Calculate March equinoxes at phase 0.0
  const vernal = getSunPhases(startJD, endJD, 0.0);

  // Calculate September equinoxes at phase 0.5
  const september = getSunPhases(startJD, endJD, 0.5);

  return { vernal, september };
}
