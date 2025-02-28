/**
 * @file constraints/brands/distances.ts
 * @module distances
 * @description Branded type definitions for astronomical distance measurements.
 *
 * This module provides nominal typing for length/distance values to prevent accidental mixing
 * of units (e.g., meters vs parsecs) and ensure dimensional correctness in calculations.
 * Includes both SI units and specialized astronomical distance measures.
 *
 * @example
 * import { Meters, AstronomicalUnits, Parsecs } from './distances';
 *
 * const earthDiameter: Meters = 12_742_000 as Meters;
 * const marsOrbit: AstronomicalUnits = 1.524 as AstronomicalUnits;
 * // const invalid = earthDiameter + marsOrbit; 🚫 Type Error
 *
 * @see {@link https://www.iau.org/public/themes/measuring/|IAU Distance Standards}
 */

import { Brand } from "../types";

/**
 * Represents distance in meters (SI base unit).
 * @example
 * const lunarOrbit: Meters = 384_399_000 as Meters; // Earth-Moon average distance
 */
export type Meters = Brand<number, "Meters">;

/**
 * Represents distance in kilometers (1,000 meters).
 * @example
 * const earthCircumference: Kilometers = 40_075 as Kilometers;
 */
export type Kilometers = Brand<number, "Kilometers">;

/**
 * Represents distance in Astronomical Units (IAU 2012 definition: 149,597,870.7 km).
 * @example
 * const jupiterOrbit: AstronomicalUnits = 5.20 as AstronomicalUnits;
 */
export type AstronomicalUnits = Brand<number, "AstronomicalUnits">;

/**
 * Represents distance as light-travel time in seconds.
 * @example
 * const sunToPluto: LightSeconds = 19_836 as LightSeconds; // ~5.5 hours
 */
export type LightSeconds = Brand<number, "LightSeconds">;

/**
 * Represents distance as light-travel time in years (julian year basis).
 * @example
 * const nearestStar: LightYears = 4.246 as LightYears; // Proxima Centauri
 */
export type LightYears = Brand<number, "LightYears">;

/**
 * Represents distance in parsecs (1 pc ≈ 3.0857e16 m = 3.26156 ly).
 * @example
 * const solarNeighborhood: Parsecs = 12.4 as Parsecs; // 40 ly bubble radius
 */
export type Parsecs = Brand<number, "Parsecs">;

/**
 * Represents distance in solar radii (1 R⊙ = 696,342 km).
 * @example
 * const betelgeuseRadius: SolarRadii = 764 as SolarRadii;
 */
export type SolarRadii = Brand<number, "SolarRadii">;

/**
 * Represents distance in Earth-Moon average orbital distances (384,399 km).
 * @example
 * const asteroidApproach: LunarDistances = 0.85 as LunarDistances;
 */
export type LunarDistances = Brand<number, "LunarDistances">;

/**
 * Represents distance in Hubble-length units (c/H0 ≈ 14.4 billion ly).
 * @example
 * const cosmicStructure: HubbleLengths = 0.023 as HubbleLengths;
 */
export type HubbleLengths = Brand<number, "HubbleLengths">;

/**
 * Represents proper motion distance in kiloparsecs (kpc).
 * @example
 * const galacticCenter: Kiloparsecs = 8.277 as Kiloparsecs;
 */
export type Kiloparsecs = Brand<number, "Kiloparsecs">;

/**
 * Represents redshift (z) based distance measure for cosmology.
 * @example
 * const quasarDistance: RedshiftZ = 7.54 as RedshiftZ;
 */
export type RedshiftZ = Brand<number, "RedshiftZ">;

/**
 * Represents distance in gravitational radii (Rg = GM/c²).
 * @example
 * const sagittariusA: GravitationalRadii = 12.7e6 as GravitationalRadii;
 */
export type GravitationalRadii = Brand<number, "GravitationalRadii">;

/**
 * Represents electromagnetic wavelength in meters.
 * @example
 * const hAlpha: WavelengthMeters = 656.3e-9 as WavelengthMeters; // H-alpha emission line
 */
export type WavelengthMeters = Brand<number, "WavelengthMeters">;

/**
 * Light-travel time – **exact meters** = distance light travels in vacuum over X seconds.
 * @example
 * const lunarDistance: LightTravelTimeSeconds = 1.282 as LightTravelTimeSeconds; // Exactly 384,000 km
 */
export type LightTravelTimeSeconds = Brand<number, "LightTravelTimeSeconds">;
