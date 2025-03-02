/**
 * @file constraints/brands/temporal/epochs.ts
 * @module epochs
 * @description Branded types for astronomical epoch specifications.
 *
 * These represent absolute reference moments in time, defined either through:
 * - Geometric criteria (Besselian = Sun's RA position at 280° for B1950)
 * - Fixed chronological definitions (Julian = J2000 as fixed TT timestamp)
 */

import { EpochBrand } from "..";

/**
 * Represents a Besselian epoch (B1950.0) as a fractional Besselian tropical year
 * tied to the Sun's mean right ascension at 280° (geometric orbital marker).
 * @example
 * const fk4Epoch: Epoch_B1950 = 1950.0 as Epoch_B1950; // B1950.0
 */
export type Epoch_B1950 = EpochBrand<number, "B1950">;

/**
 * Represents a Julian epoch (J2000.0) as a fractional year in the Julian epoch system
 * (1 Julian year = 365.25 days), anchored to an absolute TT timestamp.
 * @example
 * const j2000: Epoch_J2000 = 2000.0 as Epoch_J2000; // J2000.0 (Jan 1, 2000 12:00 TT)
 */
export type Epoch_J2000 = EpochBrand<number, "J2000">;
