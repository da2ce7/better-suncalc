import { DELTA_T_POLYNOMIAL_SEGMENTS } from "./constraints/time";

/**
 * Configuration for ΔT (TT - UTC) polynomial approximations
 * @typedef {Object} DeltaTPolynomialSegment
 * @property {number} maxYear - Upper year bound (exclusive)
 * @property {number} base - Reference year for polynomial calculation
 * @property {number} scale - Year normalization divisor
 * @property {number[]} coeffs - Polynomial coefficients [a₀, a₁t, a₂t²,...]
 */
type DeltaTPolynomialSegment = {
  maxYear: number;
  base: number;
  scale: number;
  coeffs: number[];
};

/**
 * Approximates ΔT (TT - UTC in seconds) using polynomial models.
 * @function deltaT
 * @param {Date} date - UTC date to evaluate
 * @returns {number} ΔT in seconds (historical: ±5s post-1972; predictions: >2022)
 * @see Espenak & Meeus (2006) https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html
 * @warning
 * - Pre-1950 accuracy degrades rapidly (especially before 1600)
 * - Post-2022 values are extrapolated; for critical applications after 2023, use IERS ΔT predictions
 */
function deltaT(date: Date): number {
  const y = date.getUTCFullYear() + date.getUTCMonth() / 12;
  for (const c of DELTA_T_POLYNOMIAL_SEGMENTS) {
    if (y < c.maxYear) {
      const t = (y - c.base) / c.scale;
      return c.coeffs.reduce((acc, coeff, i) => acc + coeff * t ** i, 0);
    }
  }
  throw new Error("Year out of range for ΔT calculation");
}

/**
 * Converts Julian Date in Terrestrial Time (TT) to Universal Time (UT1)
 * @function ttToUT1
 * @param {number} jdTT - Julian date in TT time scale
 * @returns {number} Julian date in UT1 time scale
 * @note This is an approximation that assumes ΔT = TT - UTC ≈ TT - UT1
 * @warning UT1 and UTC differ slightly due to Earth's variable rotation
 * (typically within ±0.9 seconds). For precise UT1 calculations,
 * use IERS EOP data instead of this approximate method
 */
function ttToUT1(jdTT: number): number {
  // Calculate approximate UT1 (via UTC approximation)
  const date = new Date((jdTT - 2440587.5) * 86400000); // JD to Date
  const ΔT = deltaT(date);
  return jdTT - ΔT / 86400; // Convert ΔT seconds to days
}

export { deltaT, DeltaTPolynomialSegment, ttToUT1 };
