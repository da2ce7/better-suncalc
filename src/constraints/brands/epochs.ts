/**
 * @file constraints/brands/epochs.ts
 * @module epochs
 * @description Branded types for astronomical epoch specifications.
 *
 * These represent absolute reference moments in time, defined either through:
 * - Geometric criteria (Besselian = Sun's RA position)
 * - Fixed chronological definitions (Julian = fixed TT timestamp)
 */

import { Brand } from "../types";

/**
 * Represents a Besselian epoch as a fractional Besselian tropical year
 * tied to the Sun's mean right ascension at 280° (geometric orbital marker).
 * @example
 * const fk4Epoch: BesselianEpoch = 1950.0 as BesselianEpoch; // B1950.0
 */
export type BesselianEpoch = Brand<number, "BesselianEpoch">;

/**
 * Represents a Julian epoch as a fractional year in the Julian epoch system
 * (1 Julian year = 365.25 days), anchored to an absolute TT timestamp.
 * @example
 * const j2000: JulianEpoch = 2000.0 as JulianEpoch; // J2000.0 (Jan 1, 2000 12:00 TT)
 */
export type JulianEpoch = Brand<number, "JulianEpoch">;
