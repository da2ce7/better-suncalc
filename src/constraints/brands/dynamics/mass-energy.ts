/**
 * @file constraints/brands/dynamics/mass-energy.ts
 * @description Branded types for mass and energy rate measurements in astronomical computations.
 *
 * This file contains types for rates that describe changes in mass or energy over time,
 * such as mass loss rates or energy emission rates. These types help maintain precision
 * and prevent errors in calculations involving mass and energy dynamics.
 */

import { Brand } from "../../types";

/**
 * Represents comet outgassing rate (kg/s of volatiles).
 * @example
 * const halleysCometGas: KilogramsPerSecond = 6e4 as KilogramsPerSecond;
 */
export type KilogramsPerSecond = Brand<number, "KilogramsPerSecond">;

/**
 * Represents γ-ray burst spectral cooling rate (keV/s).
 * @example
 * const grb080319B_Cooling: keVPerSecond = 150 as keVPerSecond;
 */
export type keVPerSecond = Brand<number, "keVPerSecond">;

/**
 * Represents mass loss rate in solar masses per annum.
 * @example
 * const agbStarWind: SolarMassesPerYear = 1e-7 as SolarMassesPerYear;
 */
export type SolarMassesPerYear = Brand<number, "SolarMassesPerYear">;
