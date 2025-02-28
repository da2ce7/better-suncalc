/**
 * @file constraints/brands/dates.ts
 * @module dates
 * @description Branded type definitions for temporal values representing durations since specific epochs.
 *
 * This module provides nominal typing for time quantities measured from specific reference epochs
 * in different time scales (TT, UT1, UTC, etc.). Each type represents an exact moment in time as
 * an offset from a standardized epoch.
 *
 * Naming convention: (TimeScale)(Unit)Since(Epoch)
 * - TimeScale: Temporal reference system (Terrestrial=TT, Universal=UT1, Coordinated=UTC, etc.)
 * - Unit: Measurement unit (Days, Seconds, Centuries, etc.)
 * - Epoch: Reference epoch (J2000, Unix, JulianEpoch, etc.)
 *
 * @see {@link ./times.ts} For duration/time interval types without fixed epochs
 * @see {@link https://en.wikipedia.org/wiki/Unix_time|Unix Time}
 * @see {@link https://en.wikipedia.org/wiki/Julian_day|Julian Date}
 */

import { Brand } from "../types";

/**
 * Days in Terrestrial Time (TT) since J2000 epoch (January 1, 2000 12:00 TT)
 * @example
 * const newYear2000TT: TerrestrialDaysSinceJ2000 = 0.0 as TerrestrialDaysSinceJ2000;
 */
export type TerrestrialDaysSinceJ2000 = Brand<
  number,
  "TerrestrialDaysSinceJ2000"
>;

/**
 * Days in Universal Time (UT1) since J2000 epoch
 * @example
 * const observationDate: UniversalDaysSinceJ2000 = 8325.75 as UniversalDaysSinceJ2000;
 */
export type UniversalDaysSinceJ2000 = Brand<number, "UniversalDaysSinceJ2000">;

/**
 * Centuries in Terrestrial Time since J2000 epoch (T = days/36525 from J2000)
 * @example
 * const tDB: TerrestrialCenturiesSinceJ2000 = 0.1 as TerrestrialCenturiesSinceJ2000;
 */
export type TerrestrialCenturiesSinceJ2000 = Brand<
  number,
  "TerrestrialCenturiesSinceJ2000"
>;

/**
 * Days in Terrestrial Time since Julian epoch (4713 BC January 1 BC)
 * @example
 * const jdLaunch: TerrestrialDaysSinceJulianEpoch = 2458849.5 as TerrestrialDaysSinceJulianEpoch; // SpaceX DM-1
 */
export type TerrestrialDaysSinceJulianEpoch = Brand<
  number,
  "TerrestrialDaysSinceJulianEpoch"
>;

/**
 * Days in Universal Time (UT1) since Julian epoch
 * @example
 * const jdEclipse: UniversalDaysSinceJulianEpoch = 2459620.75 as UniversalDaysSinceJulianEpoch;
 */
export type UniversalDaysSinceJulianEpoch = Brand<
  number,
  "UniversalDaysSinceJulianEpoch"
>;

/**
 * Days in UTC since Modified Julian epoch (1858-11-17 00:00:00 UTC)
 * @example
 * const mjdNow: CoordinatedDaysSinceModifiedJulianEpoch = 60382.3 as CoordinatedDaysSinceModifiedJulianEpoch;
 */
export type CoordinatedDaysSinceModifiedJulianEpoch = Brand<
  number,
  "CoordinatedDaysSinceModifiedJulianEpoch"
>;

/**
 * Seconds in UTC since Unix Epoch (1970-01-01T00:00:00Z)
 * @example
 * const unixNow: CoordinatedSecondsSinceUnixEpoch = 1717027200 as CoordinatedSecondsSinceUnixEpoch;
 */
export type CoordinatedSecondsSinceUnixEpoch = Brand<
  number,
  "CoordinatedSecondsSinceUnixEpoch"
>;

/**
 * Milliseconds in UTC since Unix Epoch
 * @example
 * const jsDate: CoordinatedMillisecondsSinceUnixEpoch = Date.now() as CoordinatedMillisecondsSinceUnixEpoch;
 */
export type CoordinatedMillisecondsSinceUnixEpoch = Brand<
  number,
  "CoordinatedMillisecondsSinceUnixEpoch"
>;

/**
 * Seconds in GPS Time scale since GPS epoch (1980-01-06T00:00:00 UTC)
 * @example
 * const gpsTimestamp: GPSSecondsSinceGPSEpoch = 1389376278 as GPSSecondsSinceGPSEpoch;
 */
export type GPSSecondsSinceGPSEpoch = Brand<number, "GPSSecondsSinceGPSEpoch">;

/**
 * Seconds in International Atomic Since TAI epoch (1958-01-01T00:00:00 TAI)
 * @example
 * const taiNow: AtomicSecondsSinceTAIEpoch = 2000000000 as AtomicSecondsSinceTAIEpoch;
 */
export type AtomicSecondsSinceTAIEpoch = Brand<
  number,
  "AtomicSecondsSinceTAIEpoch"
>;
