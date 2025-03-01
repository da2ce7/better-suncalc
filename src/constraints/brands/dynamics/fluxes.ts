/**
 * @file constraints/brands/dynamics/fluxes.ts
 * @description Branded types for flux rate measurements in astronomical computations.
 *
 * This file includes types for flux rates, which measure the rate of flow of quantities
 * like energy, particles, or radiation through a surface. These types are crucial for
 * ensuring accurate and context-aware handling of flux measurements in astrophysical contexts.
 */

import { Brand } from "../../types";

/**
 * Represents cosmic ray bulk flow (particles/steradian/m²/s).
 * @example
 * const ankleFeatureCR: CosmicRayFlux = 5e-24 as CosmicRayFlux;
 */
export type CosmicRayFlux = Brand<number, "CosmicRayFlux">;

/**
 * Represents neutrino flux variation (neutrinos/cm²/s/MeV).
 * @example
 * const supernova1987A_Flux: NeutrinoFluxRate = 1e13 as NeutrinoFluxRate;
 */
export type NeutrinoFluxRate = Brand<number, "NeutrinoFluxRate">;

/**
 * Represents star formation rate (solar masses per cubic parsec per year).
 * @example
 * const milkyWaySFR: SFRDensity = 2.0 as SFRDensity;
 */
export type SFRDensity = Brand<number, "SFRDensity">;
