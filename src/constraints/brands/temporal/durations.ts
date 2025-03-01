/**
 * @file constraints/brands/temporal/durations.ts
 * @module temporal
 * @description Branded temporal durations with **exactness** annotations:
 * - `Exact`: Matches its SI definition or fixed astronomic convention.
 * - `Approximate (~)`: Unstable over long timescales due to dynamic geophysical processes.
 * - `Dynamically-Variable`: Affected by relativistic or rotational changes in real-time.
 */

import { Brand } from "../../types";

/**
 * Milliseconds – **exact** 1/1,000 of an SI second.
 * @example
 * const timeoutDuration: MillisecondsDuration = 500 as MillisecondsDuration; // Exactly 0.5 seconds
 */
export type MillisecondsDuration = Brand<number, "MillisecondsDuration">;

/**
 * SI second – **exact** duration: 9,192,631,770 periods of Caesium-133 radiation.
 * @example
 * const ephemerisSecond: SecondsDuration = 1 as SecondsDuration;
 */
export type SecondsDuration = Brand<number, "SecondsDuration">;

/**
 * Minutes – **exact** 60 seconds (SI derivative).
 * @example
 * const orbitalManeuver: MinutesDuration = 15 as MinutesDuration; // Exactly 900 seconds
 */
export type MinutesDuration = Brand<number, "MinutesDuration">;

/**
 * Hours – **exact** 3,600 seconds (SI derivative).
 * @example
 * const exposureTime: HoursDuration = 2 as HoursDuration; // Exactly 7,200 seconds
 */
export type HoursDuration = Brand<number, "HoursDuration">;

/**
 * Julian days – **exact 86,400 SI seconds** (fixed duration, unrelated to Earth’s rotation).
 * @example
 * const missionDuration: JulianDaysDuration = 30 as JulianDaysDuration; // Exactly 2,592,000 seconds
 */
export type JulianDaysDuration = Brand<number, "JulianDaysDuration">;

/**
 * Julian Year – **exact 31,557,600 SI seconds** (365.25 fixed-day interval, legacy astronomy use).
 * @example
 * const orbitalPeriod: JulianYearsDuration = 11.86 as JulianYearsDuration; // Jupiter's orbital period (J1960.0)
 */
export type JulianYearsDuration = Brand<number, "JulianYearsDuration">;

/**
 * Julian Century – **exact 3,155,760,000 SI seconds** (100 Julian years).
 * @example
 * const properMotion: JulianCenturiesDuration = 0.22 as JulianCenturiesDuration; // ~2200 years
 */
export type JulianCenturiesDuration = Brand<number, "JulianCenturiesDuration">;

/**
 * TT (Terrestrial Time) seconds - EXACT SI-second intervals but scaled within a
 * relativistic timekeeping framework (TT = TAI + 32.184s fixed). Use for Earth’s
 * gravitational context.
 * @see {@link https://www.iau.org/static/resolutions/IAU1991_French.pdf} (Resolution A4)
 * @example
 * const relativisticEffect: TT_SecondsDuration = 32.184 as TT_SecondsDuration; // TT/TAI epoch delta
 */
export type TT_SecondsDuration = Brand<number, "TT_SecondsDuration">;

/**
 * TAI (International Atomic Time) – **exact SI seconds** without leap adjustments.
 * @example
 * const atomicPrecision: TAI_SecondsDuration = 86400 as TAI_SecondsDuration; // Exactly 1 Earth rotation (ignores ΔUT1)
 */
export type TAI_SecondsDuration = Brand<number, "TAI_SecondsDuration">;

/**
 * TDB (Barycentric Dynamical Time) – **exact in SI seconds** but scaled for solar system relativity.
 * Differs from TT by < 2ms due to relativistic effects.
 * @example
 * const pulsarTiming: TDB_SecondsDuration = 0.001234 as TDB_SecondsDuration; // Solar system barycenter-corrected
 */
export type TDB_SecondsDuration = Brand<number, "TDB_SecondsDuration">;

/**
 * GPS seconds – **exact SI seconds** but linearly offset from TAI (－19s steady since 1980).
 * @example
 * const leapDelta: GPS_SecondsDuration = -19 as GPS_SecondsDuration; // GPS = TAI － 19
 */
export type GPS_SecondsDuration = Brand<number, "GPS_SecondsDuration">;
