/**
 * @file constraints/brands/other-rates.ts
 * @module other-rates
 * @description Branded type definitions for non-angular temporal changes.
 *
 * Covers rates of change for physical quantities (mass, velocity, luminosity)
 * commonly used in stellar evolution, orbital decay, and multi-messenger astronomy.
 *
 * @example
 * import { SolarMassesPerYear, KilometersPerSecond } from './other-rates';
 *
 * const betelgeuseMassLoss: SolarMassesPerYear = 1e-5 as SolarMassesPerYear;
 * const pulsarKickVelocity: KilometersPerSecond = 1000 as KilometersPerSecond;
 */

import { Brand } from "../types";

/**
 * Represents mass loss rate in solar masses per annum.
 * @example
 * const agbStarWind: SolarMassesPerYear = 1e-7 as SolarMassesPerYear;
 */
export type SolarMassesPerYear = Brand<number, "SolarMassesPerYear">;

/**
 * Represents linear velocity in kilometers per second.
 * @example
 * const earthOrbitalSpeed: KilometersPerSecond = 29.78 as KilometersPerSecond;
 */
export type KilometersPerSecond = Brand<number, "KilometersPerSecond">;

/**
 * Represents supernova ejecta velocity (percentage of light speed).
 * @example
 * const snIcEjecta: FractionOfC = 0.1 as FractionOfC; // 10% c
 */
export type FractionOfC = Brand<number, "FractionOfC">;

/**
 * Represents orbital period decay (seconds lost per orbit).
 * @example
 * const hulseTaylorDecay: SecondsPerOrbit = 76.5 as SecondsPerOrbit; // PSR B1913+16
 */
export type SecondsPerOrbit = Brand<number, "SecondsPerOrbit">;

/**
 * Represents Schwarzchild radius change rate (gravitational collapse).
 * @example
 * const blackholeGrowth: R_sPerSecond = 1e-4 as R_sPerSecond;
 */
export type R_sPerSecond = Brand<number, "R_sPerSecond">;

/**
 * Represents comet outgassing rate (kg/s of volatiles).
 * @example
 * const halleysCometGas: KilogramsPerSecond = 6e4 as KilogramsPerSecond;
 */
export type KilogramsPerSecond = Brand<number, "KilogramsPerSecond">;

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
 * Represents star formation rate (solar masses per cubic parsec per year).
 * @example
 * const milkyWaySFR: SFRDensity = 2.0 as SFRDensity;
 */
export type SFRDensity = Brand<number, "SFRDensity">;

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
 * Represents γ-ray burst spectral cooling rate (keV/s).
 * @example
 * const grb080319B_Cooling: keVPerSecond = 150 as keVPerSecond;
 */
export type keVPerSecond = Brand<number, "keVPerSecond">;

/**
 * Represents neutrino flux variation (neutrinos/cm²/s/MeV).
 * @example
 * const supernova1987A_Flux: NeutrinoFluxRate = 1e13 as NeutrinoFluxRate;
 */
export type NeutrinoFluxRate = Brand<number, "NeutrinoFluxRate">;

/**
 * Represents cosmic ray bulk flow (particles/steradian/m²/s).
 * @example
 * const ankleFeatureCR: CosmicRayFlux = 5e-24 as CosmicRayFlux;
 */
export type CosmicRayFlux = Brand<number, "CosmicRayFlux">;

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
 * Represents spacecraft/orbital perspective angular rate.
 * @example
 * const transverseVelocity: ParsecsPerKilometer = 0.326 as ParsecsPerKilometer; // Perspective effect scaling
 */
export type ParsecsPerKilometer = Brand<number, "ParsecsPerKilometer">;

/**
 * Milliseconds per Julian Century – **exact** rate across fixed-length centuries.
 * @example
 * const deltaTDrift: MillisecondsPerJulianCentury = 17_500 as MillisecondsPerJulianCentury;
 */
export type MillisecondsPerJulianCentury = Brand<
  number,
  "MillisecondsPerJulianCentury"
>;
