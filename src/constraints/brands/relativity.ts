/**
 * @file constraints/brands/relativity.ts
 * @description Branded types for relativistic and light-travel relationships
 */

import { Brand } from "../types";

/**
 * Represents light-travel time per astronomical unit (AU/c).
 * Fundamental constant for relativistic time correction calculations.
 *
 * @unit seconds per astronomical unit (s/AU)
 * @value 499.004783806 ± 0.000000010 s/AU (IAU 2012 Resolution B2)
 *
 * @example
 * // Calculate light-time to Mars at 1.5 AU
 * const marsLightTime = (1.5 as AstronomicalUnits) * (499.004783806 as SecondsPerAstronomicalUnit); // ≈ 748.5 seconds
 *
 * @see {@link https://www.iau.org/static/resolutions/IAU2012_English.pdf} IAU Resolution B2
 */
export type SecondsPerAstronomicalUnit = Brand<number, "SecondsPerAU">;

/**
 * Represents relativistic time dilation factor (unitless ratio of proper time)
 * @unit dimensionless (τ/t)
 */
export type TimeDilationFactor = Brand<number, "TimeDilation">;
