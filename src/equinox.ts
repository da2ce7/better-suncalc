/* equinox.ts */

import { J2000 } from "./constants";
import { sunCoords } from "./suncalc";
import { fromJulian, toDays } from "./utils";

/**
 * For a given day (expressed in days since J2000), returns the sun's declination (in radians).
 * At the equinox, we want to find when this value is zero.
 *
 * @param d - Days since the J2000 epoch.
 * @returns Sun's declination in radians.
 */
function equinoxFunction(d: number): number {
  return sunCoords(d).dec;
}

/**
 * Refines an approximate equinox time (given in days since J2000) using Newton–Raphson iteration.
 * It seeks the solution to f(d)=0, where f(d) is the sun’s declination.
 *
 * @param guess - The initial guess (in days since J2000).
 * @returns A refined value of d (days since J2000) when the declination is near zero.
 */
function refineEquinox(guess: number): number {
  let d = guess;
  const delta = 0.001; // step in days (~86.4 sec)
  const eps = 1e-8; // convergence tolerance in days
  for (let i = 0; i < 20; i++) {
    const f0 = equinoxFunction(d);
    // Finite-difference estimate of the derivative: f'(d)
    const fPrime =
      (equinoxFunction(d + delta) - equinoxFunction(d - delta)) / (2 * delta);
    if (Math.abs(fPrime) < 1e-14) break; // safeguard against division by near-zero
    const dNew = d - f0 / fPrime;
    if (Math.abs(dNew - d) < eps) {
      return dNew;
    }
    d = dNew;
  }
  return d;
}

/**
 * Provides approximate guesses for the vernal (spring) and autumnal (fall) equinoxes
 * of a given calendar year. Note: In JavaScript Dates, months are 0-indexed:
 *   - March (month 2) for the vernal equinox (around March 20)
 *   - September (month 8) for the autumnal equinox (around September 22)
 *
 * @param year - The calendar year.
 * @returns An object with 'vernal' and 'autumnal' as approximate days since J2000.
 */
function approximateEquinoxForYear(year: number): {
  vernal: number;
  autumnal: number;
} {
  const vernalDate = new Date(Date.UTC(year, 2, 20, 0, 0, 0)); // March 20 (approx.)
  const autumnalDate = new Date(Date.UTC(year, 8, 22, 0, 0, 0)); // September 22 (approx.)
  return {
    vernal: toDays(vernalDate),
    autumnal: toDays(autumnalDate),
  };
}

export type EquinoxData = { vernal: Date[]; autumnal: Date[] };

/**
 * Finds all equinox events (vernal and autumnal) occurring within the given date range.
 * The algorithm uses an approximate guess per year then refines the guess via Newton’s method.
 *
 * The returned object contains arrays of Date objects for the vernal and autumnal equinoxes.
 *
 * @param rangeStart - Starting Date of the search range.
 * @param rangeEnd - Ending Date of the search range.
 * @returns Object with keys 'vernal' and 'autumnal', each an array of Date instances.
 */
export function getEquinoxes(rangeStart: Date, rangeEnd: Date): EquinoxData {
  const equinoxes = { vernal: [] as Date[], autumnal: [] as Date[] };

  // Extend the search range by one year on each side in case events occur near the boundaries.
  const startYear = rangeStart.getUTCFullYear();
  const endYear = rangeEnd.getUTCFullYear();
  for (let year = startYear - 1; year <= endYear + 1; year++) {
    const approx = approximateEquinoxForYear(year);
    const refinedVernal = refineEquinox(approx.vernal);
    const refinedAutumnal = refineEquinox(approx.autumnal);

    // Convert days since J2000 back to a full Julian date then to a Date.
    // J2000 corresponds to Julian Date 2451545.
    const vernalDate = fromJulian(refinedVernal + J2000);
    const autumnalDate = fromJulian(refinedAutumnal + J2000);

    if (vernalDate >= rangeStart && vernalDate <= rangeEnd) {
      equinoxes.vernal.push(vernalDate);
    }
    if (autumnalDate >= rangeStart && autumnalDate <= rangeEnd) {
      equinoxes.autumnal.push(autumnalDate);
    }
  }

  return equinoxes;
}
