/**
 * @file constraints/brands/dynamics/velocity.ts
 * @description Branded types for velocity-related rate measurements in astronomical computations.
 *
 * This file includes types for rates that measure speed or velocity, such as distance
 * per unit time. These types are essential for calculations involving motion, whether
 * of celestial bodies, particles, or other entities in astronomical contexts.
 */

import { RateBrand } from "..";

/**
 * AU per second – **exact astronomical units** (149,597,870,700m) per SI second.
 * @example
 * const solarEscapeVel: AUPerSecond = 0.0025 as AUPerSecond; // ~150 km/s
 */
export type AUPerSecond = RateBrand<number, "AUPerSecond">;

/**
 * Represents supernova ejecta velocity (percentage of light speed).
 * @example
 * const snIcEjecta: FractionOfC = 0.1 as FractionOfC; // 10% c
 */
export type FractionOfC = RateBrand<number, "FractionOfC">;

/**
 * Represents linear velocity in kilometers per second.
 * @example
 * const earthOrbitalSpeed: KilometersPerSecond = 29.78 as KilometersPerSecond;
 */
export type KilometersPerSecond = RateBrand<number, "KilometersPerSecond">;

/**
 * Represents Schwarzchild radius change rate (gravitational collapse).
 * @example
 * const blackholeGrowth: R_sPerSecond = 1e-4 as R_sPerSecond;
 */
export type R_sPerSecond = RateBrand<number, "R_sPerSecond">;
