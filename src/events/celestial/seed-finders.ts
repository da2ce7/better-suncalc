/**
 * @file events/celestial/seed-finders.ts
 * @description Event candidate generation and management
 */

import { NUMERICAL } from "../../constraints/math";
import type { Days, JulianDayTT } from "../../constraints/types";
import {
  addDaysToJD,
  subtractDaysFromJD,
  subtractJDs,
} from "../../math/austomath";

/**
 * Generates candidate times for celestial events
 * @param {JulianDayTT} start - Start in Julian days (TT).
 * @param {JulianDayTT} end - End in Julian days (TT).
 * @param {JulianDayTT} referenceJD - Anchor event JD.
 * @param {Days} eventIntervalDays - Period between events.
 * @param {Days} convergenceWindowDays - Refinement window.
 * @returns {JulianDayTT[]} Candidate JDs in TT.
 */
export function generateEventCandidates(
  start: JulianDayTT,
  end: JulianDayTT,
  reference: JulianDayTT,
  interval: Days,
  windowSize: Days,
): JulianDayTT[] {
  const seeds: JulianDayTT[] = [];

  // Compute the offset from referenceJD to start in days
  const startPhaseOffset: Days = subtractJDs(reference, start);

  // Calculate how many intervals before referenceJD to cover startJD - convergenceWindowDays
  const seedCountBefore = Math.ceil(
    (((startPhaseOffset as number) + windowSize) as number) /
      (interval as number),
  );

  // Compute initial jd by stepping back from referenceJD
  const initialOffset: Days = (seedCountBefore * interval) as number as Days;
  let jd: JulianDayTT = subtractDaysFromJD(reference, initialOffset);

  // Define thresholds for the loop
  const endThreshold: JulianDayTT = addDaysToJD(end, windowSize);
  const startThreshold: JulianDayTT = subtractDaysFromJD(start, windowSize);

  // Generate seeds within the range
  while (jd < endThreshold) {
    if (jd > startThreshold) {
      seeds.push(jd);
    }
    jd = addDaysToJD(jd, interval);
  }

  return seeds;
}

/**
 * Adds a JD to an array if unique within threshold.
 * @param {JulianDayTT[]} times - Array to modify.
 * @param {JulianDayTT} jd - Candidate JD in TT.
 * @param {Days} [eps] - Equality threshold in days.
 */
export function addUniqueJulianDate(
  times: JulianDayTT[],
  candidate: JulianDayTT,
  tolerance: Days = NUMERICAL.EPSILON.EVENT_TIME_EQUALITY_DAYS,
): void {
  if (!times.some((existing) => Math.abs(existing - candidate) < tolerance)) {
    times.push(candidate);
  }
}
