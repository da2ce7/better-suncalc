/**
 * @file constraints/brands/temporal.ts
 * @module temporal
 * @description Branded temporal units with **exactness** annotations:
 * - `Exact`: Matches its SI definition or fixed astronomic convention.
 * - `Approximate (~)`: Unstable over long timescales due to dynamic geophysical processes.
 * - `Dynamically-Variable`: Affected by relativistic or rotational changes in real-time.
 */

import { Brand } from "../types";

/**
 * Milliseconds – **exact** 1/1,000 of an SI second.
 * @example
 * const timeoutDuration: Milliseconds = 500 as Milliseconds; // Exactly 0.5 seconds
 */
export type Milliseconds = Brand<number, "Milliseconds">;

/**
 * SI second – **exact** duration: 9,192,631,770 periods of Caesium-133 radiation.
 * @example
 * const ephemerisSecond: Seconds = 1 as Seconds;
 */
export type Seconds = Brand<number, "Seconds">;

/**
 * Minutes – **exact** 60 seconds (SI derivative).
 * @example
 * const orbitalManeuver: Minutes = 15 as Minutes; // Exactly 900 seconds
 */
export type Minutes = Brand<number, "Minutes">;

/**
 * Hours – **exact** 3,600 seconds (SI derivative).
 * @example
 * const exposureTime: Hours = 2 as Hours; // Exactly 7,200 seconds
 */
export type Hours = Brand<number, "Hours">;

/**
 * Julian days – **exact 86,400 SI seconds** (fixed duration, unrelated to Earth’s rotation).
 * @example
 * const missionDuration: JulianDay = 30 as JulianDay; // Exactly 2,592,000 seconds
 */
export type JulianDay = Brand<number, "JulianDay">;

/**
 * Julian Year – **exact 31,557,600 SI seconds** (365.25 fixed-day interval, legacy astronomy use).
 * @example
 * const orbitalPeriod: JulianYear = 11.86 as JulianYear; // Jupiter's orbital period (J1960.0)
 */
export type JulianYear = Brand<number, "JulianYear">;

/**
 * Julian Century – **exact 3,155,760,000 SI seconds** (100 Julian years).
 * @example
 * const properMotion: JulianCentury = 0.22 as JulianCentury; // ~2200 years
 */
export type JulianCentury = Brand<number, "JulianCentury">;

/**
 * TT (Terrestrial Time) seconds - EXACT SI-second intervals but scaled within a
 * relativistic timekeeping framework (TT = TAI + 32.184s fixed). Use for Earth’s
 * gravitational context.
 * @see {@link https://www.iau.org/static/resolutions/IAU1991_French.pdf} (Resolution A4)
 * @example
 * const relativisticEffect: TT_Seconds = 32.184 as TT_Seconds; // TT/TAI epoch delta
 */
export type TT_Seconds = Brand<number, "TT_Seconds">;

/**
 * TAI (International Atomic Time) – **exact SI seconds** without leap adjustments.
 * @example
 * const atomicPrecision: TAI_Seconds = 86400 as TAI_Seconds; // Exactly 1 Earth rotation (ignores ΔUT1))
 */
export type TAI_Seconds = Brand<number, "TAI_Seconds">;

/**
 * TDB (Barycentric Dynamical Time) – **exact in SI seconds** but scaled for solar system relativity.
 * Differs from TT by < 2ms due to relativistic effects.
 * @example
 * const pulsarTiming: TDB_Seconds = 0.001234 as TDB_Seconds; // Solar system barycenter-corrected
 */
export type TDB_Seconds = Brand<number, "TDB_Seconds">;

/**
 * GPS seconds – **exact SI seconds** but linearly offset from TAI (－19s steady since 1980).
 * @example
 * const leapDelta: GPS_Seconds = -19 as GPS_Seconds; // GPS = TAI － 19
 */
export type GPS_Seconds = Brand<number, "GPS_Seconds">;

/**
 * AU per second – **exact astronomical units** (149,597,870,700m) per SI second.
 * @example
 * const solarEscapeVel: AUPerSecond = 0.0025 as AUPerSecond; // ~150 km/s
 */
export type AUPerSecond = Brand<number, "AUPerSecond">;
