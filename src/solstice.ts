/* solstice.ts */

import { sunCoords } from "./suncalc";
import { fromJulian, toDays } from "./utils";

/**
 * Returns the sun’s declination (in radians) at a given time expressed as days since J2000.
 * This is the function whose extrema correspond to the solstices.
 * @param d - Days since J2000.
 * @returns Declination in radians.
 */
function solDec(d: number): number {
  return sunCoords(d).dec;
}

/**
 * Refines an approximate solstice time (given in days since J2000) by Newton–Raphson iteration.
 * The method uses finite-difference estimates of the first and second derivatives of the sun's declination.
 *
 * @param guess - The initial guess (in days since J2000).
 * @returns A refined value of d (days since J2000) where the derivative is nearly zero.
 */
function refineSolstice(guess: number): number {
  let d = guess;
  const delta = 0.001; // small time step in days (~86.4 seconds)
  const eps = 1e-8; // convergence tolerance in days
  for (let i = 0; i < 20; i++) {
    // Finite-difference estimates:
    const fPlus = solDec(d + delta);
    const fMinus = solDec(d - delta);
    const f0 = solDec(d);
    // First derivative estimate:
    const fPrime = (fPlus - fMinus) / (2 * delta);
    // Second derivative estimate:
    const fDouble = (fPlus - 2 * f0 + fMinus) / (delta * delta);
    // Prevent division by near-zero:
    if (Math.abs(fDouble) < 1e-14) break;
    const dNew = d - fPrime / fDouble;
    if (Math.abs(dNew - d) < eps) {
      d = dNew;
      break;
    }
    d = dNew;
  }
  return d;
}

/**
 * For a given year, returns an approximate starting guess for the summer and winter solstices.
 * (Note: In JavaScript Date, month is 0-indexed: 5 for June and 11 for December.)
 *
 * @param year - The calendar year.
 * @returns Object with properties 'summer' and 'winter', each expressed in days since J2000.
 */
function approximateSolsticeForYear(year: number): {
  summer: number;
  winter: number;
} {
  // Use June 21 and December 21 UT as rough initial guesses.
  const summerDate = new Date(Date.UTC(year, 5, 21, 0, 0, 0)); // June 21
  const winterDate = new Date(Date.UTC(year, 11, 21, 0, 0, 0)); // December 21
  return {
    summer: toDays(summerDate),
    winter: toDays(winterDate),
  };
}

export type SolsticeData = { summer: Date[]; winter: Date[] };

/**
 * Finds all solstice events (summer and winter) that occur within the given datetime range.
 * The algorithm uses a per-year approximate guess, then refines via Newton’s method applied
 * to the derivative of the sun's declination.
 *
 * The function returns an object containing arrays of Date objects for summer and winter solstices.
 *
 * @param rangeStart - Starting Date of the range.
 * @param rangeEnd - Ending Date of the range.
 * @returns Object with keys 'summer' and 'winter', each an array of Date instances.
 */
export function getSolstices(rangeStart: Date, rangeEnd: Date): SolsticeData {
  const solstices = { summer: [] as Date[], winter: [] as Date[] };

  // Determine the range in calendar years. Include one extra year on each end to catch edge events.
  const startYear = rangeStart.getUTCFullYear();
  const endYear = rangeEnd.getUTCFullYear();

  for (let year = startYear - 1; year <= endYear + 1; year++) {
    const approx = approximateSolsticeForYear(year);

    // Refine each approximate event: obtain refined times in days since J2000.
    const refinedSummer = refineSolstice(approx.summer);
    const refinedWinter = refineSolstice(approx.winter);

    // Convert days since J2000 back to full Julian date and then to Date.
    // Note: J2000 corresponds to JD 2451545.
    const jdSummer = refinedSummer + 2451545;
    const jdWinter = refinedWinter + 2451545;
    const summerDate = fromJulian(jdSummer);
    const winterDate = fromJulian(jdWinter);

    // If the calculated event falls within the requested range, add it to the results.
    if (summerDate >= rangeStart && summerDate <= rangeEnd) {
      solstices.summer.push(summerDate);
    }
    if (winterDate >= rangeStart && winterDate <= rangeEnd) {
      solstices.winter.push(winterDate);
    }
  }

  return solstices;
}
