/**
 * @file constraints/brands/temporal/durations.ts
 * @module temporal
 * @description Branded temporal durations with **exactness** annotations:
 * - `Exact`: Matches its SI definition or fixed astronomic convention.
 * - `Approximate (~)`: Unstable over long timescales due to dynamic geophysical processes.
 * - `Dynamically-Variable`: Affected by relativistic or rotational changes in real-time.
 */

import { TimescaleBrand } from "..";

/**
 * Milliseconds – **exact** 1/1,000 of an SI second.
 * @example
 * const timeoutDuration: MillisecondsDuration = 500 as MillisecondsDuration; // Exactly 0.5 seconds
 */
export type MillisecondsDuration = TimescaleBrand<number, "Milliseconds">;

/**
 * SI second – **exact** duration: 9,192,631,770 periods of Caesium-133 radiation.
 * @example
 * const ephemerisSecond: SecondsDuration = 1 as SecondsDuration;
 */
export type SecondsDuration = TimescaleBrand<number, "Second">;

/**
 * Minutes – **exact** 60 seconds (SI derivative).
 * @example
 * const orbitalManeuver: MinutesDuration = 15 as MinutesDuration; // Exactly 900 seconds
 */
export type MinutesDuration = TimescaleBrand<number, "Minute">;

/**
 * Hours – **exact** 3,600 seconds (SI derivative).
 * @example
 * const exposureTime: HoursDuration = 2 as HoursDuration; // Exactly 7,200 seconds
 */
export type HoursDuration = TimescaleBrand<number, "Hour">;

/**
 * Julian days – **exact 86,400 SI seconds** (fixed duration, unrelated to Earth’s rotation).
 * @example
 * const missionDuration: JulianDaysDuration = 30 as JulianDaysDuration; // Exactly 2,592,000 seconds
 */
export type JulianDaysDuration = TimescaleBrand<number, "JulianDay">;

/**
 * Julian Year – **exact 31,557,600 SI seconds** (365.25 fixed-day interval, legacy astronomy use).
 * @example
 * const orbitalPeriod: JulianYearsDuration = 11.86 as JulianYearsDuration; // Jupiter's orbital period (J1960.0)
 */
export type JulianYearsDuration = TimescaleBrand<number, "JulianYear">;

/**
 * Julian Century – **exact 3,155,760,000 SI seconds** (100 Julian years).
 * @example
 * const properMotion: JulianCenturiesDuration = 0.22 as JulianCenturiesDuration; // ~2200 years
 */
export type JulianCenturiesDuration = TimescaleBrand<number, "JulianCentury">;

/**
 * TT (Terrestrial Time) seconds - EXACT SI-second intervals but scaled within a
 * relativistic timekeeping framework (TT = TAI + 32.184s fixed). Use for Earth’s
 * gravitational context.
 * @see {@link https://www.iau.org/static/resolutions/IAU1991_French.pdf} (Resolution A4)
 * @example
 * const relativisticEffect: Seconds_T_TT = 32.184 as SecondsDuration_TT; // TT/TAI epoch delta
 */
export type SecondsDuration_TT = TimescaleBrand<number, "TT">;

/**
 * TAI (International Atomic Time) – **exact SI seconds** without leap adjustments.
 * @example
 * const atomicPrecision: SecondsDuration_TAI = 86400 as SecondsDuration_TAI; // Exactly 1 Earth rotation (ignores ΔUT1)
 */
export type SecondsDuration_TAI = TimescaleBrand<number, "TAI">;

/**
 * TDB (Barycentric Dynamical Time) – **exact in SI seconds** but scaled for solar system relativity.
 * Differs from TT by < 2ms due to relativistic effects.
 * @example
 * const pulsarTiming: SecondsDuration_TDB = 0.001234 as SecondsDuration_TDB; // Solar system barycenter-corrected
 */
export type SecondsDuration_TDB = TimescaleBrand<number, "TDB">;

/**
 * GPS seconds – **exact SI seconds** but linearly offset from TAI (－19s steady since 1980).
 * @example
 * const leapDelta: SecondsDuration_GPS = -19 as SecondsDuration_GPS; // GPS = TAI － 19
 */
export type SecondsDuration_GPS = TimescaleBrand<number, "GPS">;
