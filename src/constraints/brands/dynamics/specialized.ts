/**
 * @file constraints/brands/dynamics/specialized.ts
 * @description Branded types for specialized rate measurements in astronomical computations.
 *
 * This file provides types for rates that do not fit into other categories but are
 * nonetheless important for specific astronomical applications. These types ensure
 * that unique or specialized rate measurements are handled with the same rigor and
 * type safety as more common rates.
 */

import { Brand } from "../../types";

/**
 * Represents orbital period decay (seconds lost per orbit).
 * @example
 * const hulseTaylorDecay: SecondsPerOrbit = 76.5 as SecondsPerOrbit; // PSR B1913+16
 */
export type SecondsPerOrbit = Brand<number, "SecondsPerOrbit">;

/**
 * Represents dark matter annihilation rate (particles/cm³/s).
 * @example
 * const galacticCenterWIMP: DM_AnnihilationRate = 1e-26 as DM_AnnihilationRate;
 */
export type DM_AnnihilationRate = Brand<number, "DM_AnnihilationRate">;

/**
 * Represents GRB brightness decline rate (magnitudes per minute).
 * @example
 * const grbAfterglow: MagnitudeDeclinePerMinute = 1.2 as MagnitudeDeclinePerMinute;
 */
export type MagnitudeDeclinePerMinute = Brand<
  number,
  "MagnitudeDeclinePerMinute"
>;

/**
 * Represents interstellar medium metal enrichment (Z☉/Gyr).
 * @example
 * const stelliferousEraEnrichment: MetallicityRate = 0.02 as MetallicityRate;
 */
export type MetallicityRate = Brand<number, "MetallicityRate">;

/**
 * Represents cosmic expansion acceleration (km/s/Mpc/cm).
 * @example
 * const darkEnergyEffect: HubbleFlowRate = 70 as HubbleFlowRate;
 */
export type HubbleFlowRate = Brand<number, "HubbleFlowRate">;

/**
 * Represents exoplanet atmospheric loss (earth atmospheres/Gyr).
 * @example
 * const marsAtmLoss: AtmospheresPerGyr = 0.95 as AtmospheresLossRate;
 */
export type AtmospheresLossRate = Brand<number, "AtmospheresLossRate">;

/**
 * Represents volumetric compression rate (m³/s²) for asteroid rubble piles.
 * @example
 * const asteroidCollapse: MetersCubedPerSecondSquared = 3e-5 as MetersCubedPerSecondSquared;
 */
export type MetersCubedPerSecondSquared = Brand<
  number,
  "MetersCubedPerSecondSquared"
>;

/**
 * Milliseconds per Julian Century – **exact** rate across fixed-length centuries.
 * @example
 * const deltaTDrift: MillisecondsPerJulianCentury = 17_500 as MillisecondsPerJulianCentury;
 */
export type MillisecondsPerJulianCentury = Brand<
  number,
  "MillisecondsPerJulianCentury"
>;
