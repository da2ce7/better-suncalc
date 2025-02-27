/**
 * @file constraints/time.ts
 */

// Add type-safe conversion helpers
export type JulianYear = number & { readonly __brand: "JulianYear" };
export type TerrestrialTime = number & { readonly __brand: "TT" };

/** ====================== Time Definitions and Epochs ====================== */

export const DAYS_PER_JULIAN_CENTURY = 36525;
export const JULIAN_EPOCH_J1970 = 2440588.0;
export const JULIAN_EPOCH_J2000 = 2451545.0;

export const TIME_UNITS = {
  MILLISECONDS: {
    HOUR: 3_600_000,
    DAY: 86_400_000,
    HALF_DAY: 43_200_000,
  },
  SECONDS: {
    DAY: 86400,
    HOUR: 3600,
  },
  HOURS: { DAY: 24 },
};

/** ======================= ΔT Polynomial Segments ======================== */

/**
 * Configuration for ΔT (TT - UTC) polynomial approximations
 * @typedef {Object} DeltaTPolynomialSegment
 * @property {number} maxYear - Upper year bound (exclusive)
 * @property {number} base - Reference year for polynomial calculation
 * @property {number} scale - Year normalization divisor
 * @property {number[]} coeffs - Polynomial coefficients [a₀, a₁t, a₂t²,...]
 */
export type DeltaTPolynomialSegment = {
  maxYear: number;
  base: number;
  scale: number;
  coeffs: number[];
};

/**
 * Polynomial segments for ΔT approximation by historical period
 * @constant {DeltaTPolynomialSegment[]}
 */
export const DELTA_T_POLYNOMIAL_SEGMENTS: DeltaTPolynomialSegment[] = [
  { maxYear: -500, base: 1820, scale: 100, coeffs: [-20, 0, 32] },
  {
    maxYear: 500,
    base: 0,
    scale: 100,
    coeffs: [10583.6, -1014.41, 33.78311, -5.952053],
  },
  {
    maxYear: 1600,
    base: 1000,
    scale: 100,
    coeffs: [1574.2, -556.01, 71.23472, 0.319781],
  },
  {
    maxYear: 1700,
    base: 1600,
    scale: 1,
    coeffs: [120, -0.9808, -0.01532, 1 / 7129],
  },
  {
    maxYear: 1800,
    base: 1700,
    scale: 1,
    coeffs: [8.83, 0.1603, -0.0059285, 0.00013336],
  },
  {
    maxYear: 1860,
    base: 1800,
    scale: 1,
    coeffs: [13.72, -0.332447, 0.0068612, 0.0041116],
  },
  {
    maxYear: 1900,
    base: 1860,
    scale: 1,
    coeffs: [7.62, 0.5737, -0.251754, 0.01680668],
  },
  {
    maxYear: 1920,
    base: 1900,
    scale: 1,
    coeffs: [-2.79, 1.494119, -0.0598939, 0.0061966],
  },
  {
    maxYear: 1941,
    base: 1920,
    scale: 1,
    coeffs: [21.2, 0.84493, -0.0761, 0.0020936],
  },
  {
    maxYear: 1961,
    base: 1950,
    scale: 1,
    coeffs: [29.07, 0.407, -1 / 233, 1 / 2547],
  },
  {
    maxYear: 1986,
    base: 1975,
    scale: 1,
    coeffs: [45.45, 1.067, -1 / 260, -1 / 718],
  },
  {
    maxYear: 2005,
    base: 2000,
    scale: 1,
    coeffs: [63.86, 0.3345, -0.060374, 0.0017275],
  },
  { maxYear: 2050, base: 2000, scale: 1, coeffs: [62.92, 0.32217, 0.005589] },
  { maxYear: Infinity, base: 2020, scale: 1, coeffs: [71.0, 0.3875, 0.00325] },
];
