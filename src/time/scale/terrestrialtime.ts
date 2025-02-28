/**
 * @file utilities/terrestrialtime.ts
 * @description Time Related To Earth
 */

import { DELTA_T_POLYNOMIAL_SEGMENTS } from "../../constraints/constants/earth";
import {
  HALF_DAY,
  JULIAN_CONVERSION,
  JULIAN_EPOCH_J1970,
  TIME_UNITS,
} from "../../constraints/constants/time";
import {
  JulianDayTT,
  JulianDayUT1,
  Milliseconds,
  Seconds,
} from "../../constraints/types";

/**
 * Converts a UTC Date to a Terrestrial Time (TT) Julian Date.
 * @param {Date} date - UTC date/time.
 * @returns {JulianDayTT} Julian Date in TT.
 */
export function dateToJulian(date: Date): JulianDayTT {
  const utcMS = date.getTime() as Milliseconds;
  const utcJD =
    utcMS / TIME_UNITS.MILLISECONDS.DAY - HALF_DAY + JULIAN_EPOCH_J1970;
  const deltaTSeconds = deltaT(date);
  return (utcJD + deltaTSeconds / TIME_UNITS.SECONDS.DAY) as JulianDayTT;
}

/**
 * Converts a TT Julian Date to a UTC Date via iterative approximation.
 * @param {JulianDayTT} time - Julian Date in Terrestrial Time.
 * @returns {Date} UTC Date within ±1ms of actual time.
 */
export function julianToDate(time: JulianDayTT): Date {
  let utcJD = time;
  let date: Date;
  for (let i = 0; i < JULIAN_CONVERSION.MAX_ITERATIONS; i++) {
    date = new Date(
      (utcJD + HALF_DAY - JULIAN_EPOCH_J1970) * TIME_UNITS.MILLISECONDS.DAY,
    );
    const delta = deltaT(date) / TIME_UNITS.SECONDS.DAY;
    utcJD = (time - delta) as JulianDayTT;
  }
  const finalUtcJD =
    (utcJD - JULIAN_EPOCH_J1970 + HALF_DAY) * TIME_UNITS.MILLISECONDS.DAY;
  return new Date(Math.round(finalUtcJD));
}

/**
 * Approximates ΔT (TT - UTC in seconds) using polynomial models.
 * @function deltaT
 * @param {Date} date - UTC date to evaluate
 * @returns {Seconds} ΔT in seconds (historical: ±5s post-1972; predictions: >2022)
 * @see Espenak & Meeus (2006) https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html
 * @warning
 * - Pre-1950 accuracy degrades rapidly (especially before 1600)
 * - Post-2022 values are extrapolated; for critical applications after 2023, use IERS ΔT predictions
 */
export function deltaT(date: Date): Seconds {
  const y = date.getUTCFullYear() + date.getUTCMonth() / 12;
  for (const c of DELTA_T_POLYNOMIAL_SEGMENTS) {
    if (y < c.maxYear) {
      const t = (y - c.base) / c.scale;
      const deltaTValue = c.coeffs.reduce(
        (acc, coeff, i) => acc + coeff * t ** i,
        0,
      );
      return deltaTValue as Seconds;
    }
  }
  throw new Error("Year out of range for ΔT calculation");
}

/**
 * Converts Julian Date in Terrestrial Time (TT) to Universal Time (UT1)
 * @function ttToUT1
 * @param {JulianDayTT} jdTT - Julian date in TT time scale
 * @returns {JulianDayUT1} Julian date in UT1 time scale
 * @note This is an approximation that assumes ΔT = TT - UTC ≈ TT - UT1
 * @warning UT1 and UTC differ slightly due to Earth's variable rotation
 * (typically within ±0.9 seconds). For precise UT1 calculations,
 * use IERS EOP data instead of this approximate method
 */
export function ttToUT1(time: JulianDayTT): JulianDayUT1 {
  const date = new Date(((time - 2440587.5) * 86400000) as Milliseconds);
  const ΔT = deltaT(date);
  return (time - ΔT / 86400) as JulianDayUT1;
}
