/*
  mooncalc.ts

  Contains functions to calculate moon position, illumination, and rise/set times using Julian Dates.
  All temporal parameters and results are in Terrestrial Time (TT) Julian days.
*/

import { LUNAR } from "./constraints/lunar"; // Import lunar constants
import { AU_TO_KM, DEGREES_TO_RADIANS, PI } from "./constraints/math";
import { JULIAN_EPOCH_J2000 } from "./constraints/time";
import { calculateLunarCoordinates } from "./mooncoords";
import { sunCoords } from "./suncalc";
import {
  altitude,
  astroRefraction,
  azimuth,
  latitudeToRad,
  longitudeToRadWest,
  siderealTime,
} from "./utils";

/* ==================== Moon Types ==================== */

/**
 * Represents the moon's position and related parameters at a specific time and location.
 */
export type MoonPositionData = {
  /** Azimuth angle in radians (clockwise from true north) */
  azimuth: number;

  /** Altitude angle in radians above horizon (includes atmospheric refraction correction) */
  altitude: number;

  /** Distance to moon in kilometers */
  distance: number;

  /** Parallactic angle - angle between moon position and local zenith (radians) */
  parallacticAngle: number;
};

/**
 * Describes the moon's illumination phase and visibility.
 */
export type MoonIlluminationData = {
  /** Illuminated fraction (0 = new moon, 1 = full moon) */
  fraction: number;

  /** Moon phase (0-1):
   * - 0 = New Moon
   * - 0.25 = First Quarter
   * - 0.5 = Full Moon
   * - 0.75 = Last Quarter
   */
  phase: number;

  /** Angle of the illuminated terminator (radians, eastward from north) */
  angle: number;
};

/**
 * Moon rise/set times and visibility status in Julian days.
 */
export type MoonTimesData = {
  /** Moonrise time (Julian day) if occurs */
  rise?: number;

  /** Moonset time (Julian day) if occurs */
  set?: number;

  /** True if moon never sets (polar day) - considers visibility threshold */
  alwaysUp?: boolean;

  /** True if moon never rises (polar night) - considers visibility threshold */
  alwaysDown?: boolean;
};

/* ==================== Moon Calculations ==================== */

/**
 * Calculates moon position for a provided Julian date and location.
 * @param jd - Julian day in Terrestrial Time (TT)
 * @param lat - Observer's latitude in degrees
 * @param lng - Observer's longitude in degrees
 * @returns Object containing moon position data
 */
export function getMoonPosition(
  jd: number,
  lat: number,
  lng: number,
): MoonPositionData {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);
  const d = jd - JULIAN_EPOCH_J2000; // Days since J2000

  // Get celestial coordinates from mooncoords.ts
  const coords = calculateLunarCoordinates(jd);
  const ra = coords.ra;
  const dec = coords.dec;

  // Calculate mean anomaly (M) and distance (dist)
  const M =
    DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d);
  const meanDist = LUNAR.ORBIT.SEMI_MAJOR_AXIS * AU_TO_KM; // Convert AU to km
  const variationCoeff =
    LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE * meanDist; // Approximate variation
  const dist = meanDist - variationCoeff * Math.cos(M);

  const H = siderealTime(d, lw) - ra;
  let h = altitude(H, phi, dec);
  const pa = Math.atan2(
    Math.sin(H),
    Math.tan(phi) * Math.cos(dec) - Math.sin(dec) * Math.cos(H),
  );

  h += astroRefraction(h);

  return {
    azimuth: azimuth(H, phi, dec),
    altitude: h,
    distance: dist,
    parallacticAngle: pa,
  };
}

/**
 * Calculates moon illumination parameters.
 * @param jd - Julian day in Terrestrial Time (TT)
 * @returns Object containing illumination data
 */
export function getMoonIllumination(jd: number): MoonIlluminationData {
  const d = jd - JULIAN_EPOCH_J2000; // Days since J2000
  const s = sunCoords(d); // Sun coordinates (ra, dec)

  // Get moon celestial coordinates
  const mCoords = calculateLunarCoordinates(jd);
  const mRa = mCoords.ra;
  const mDec = mCoords.dec;

  // Calculate mean anomaly (M) and distance (dist) for the moon
  const M =
    DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d);
  const meanDist = LUNAR.ORBIT.SEMI_MAJOR_AXIS * AU_TO_KM; // Convert AU to km
  const variationCoeff =
    LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE * meanDist; // Approximate variation
  const mDist = meanDist - variationCoeff * Math.cos(M);

  const sdist = 1 * AU_TO_KM; // Sun distance: 1 AU in kilometers
  const phi = Math.acos(
    Math.sin(s.dec) * Math.sin(mDec) +
      Math.cos(s.dec) * Math.cos(mDec) * Math.cos(s.ra - mRa),
  );
  const inc = Math.atan2(sdist * Math.sin(phi), mDist - sdist * Math.cos(phi));
  const angle = Math.atan2(
    Math.cos(s.dec) * Math.sin(s.ra - mRa),
    Math.sin(s.dec) * Math.cos(mDec) -
      Math.cos(s.dec) * Math.sin(mDec) * Math.cos(s.ra - mRa),
  );

  return {
    fraction: (1 + Math.cos(inc)) / 2,
    phase: 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / PI,
    angle: angle,
  };
}

/**
 * Calculates moon rise and set times for a given day in Julian days.
 * @param startJD - Julian day (TT) of the day's start (midnight)
 * @param lat - Observer's latitude in degrees
 * @param lng - Observer's longitude in degrees
 * @returns MoonTimesData with events as Julian days
 * @remarks The visibility threshold (e.g., 0.625°) accounts for:
 * - Standard atmospheric refraction (approximately 0.57° for the moon)
 * - The moon's average semi-diameter (approximately 0.25°)
 */
export function getMoonTimes(
  startJD: number,
  lat: number,
  lng: number,
): MoonTimesData {
  const hc = LUNAR.VISIBILITY.ALTITUDE_THRESHOLD * DEGREES_TO_RADIANS; // Altitude threshold in radians

  let previousAlt = getMoonPosition(startJD, lat, lng).altitude - hc;
  let rise: number | undefined, set: number | undefined;
  let extremumSign = 0;

  const HOURS_IN_DAY = 24; // Define constant for clarity
  const HALF_DAY = 12;

  for (let hour = 0; hour < HOURS_IN_DAY; hour++) {
    const currentTime = startJD + hour / HOURS_IN_DAY;
    const nextTime = currentTime + 1 / HOURS_IN_DAY;
    const nextAlt = getMoonPosition(nextTime, lat, lng).altitude - hc;

    if (Math.sign(previousAlt) === Math.sign(nextAlt)) {
      previousAlt = nextAlt;
      continue;
    }

    const x1 = hour;
    const x2 = hour + 1;
    const y1 = previousAlt;
    const y2 = nextAlt;
    const a =
      (y1 + y2) / 2 -
      getMoonPosition(startJD + (hour + HALF_DAY) / HOURS_IN_DAY, lat, lng)
        .altitude;
    const b = y2 - y1;

    const xe = -b / (2 * a);
    const ye = (a * xe + b) * xe + y1;

    if (Math.abs(xe) <= 1) {
      const crossTime = startJD + (hour + xe) / HOURS_IN_DAY;
      if (previousAlt < 0) {
        if (!rise) rise = crossTime;
        else set = crossTime;
      } else {
        if (!set) set = crossTime;
        else rise = crossTime;
      }
    }

    if (Math.abs(ye) > Math.abs(extremumSign)) {
      extremumSign = ye;
    }

    previousAlt = nextAlt;
  }

  const result: MoonTimesData = {};
  if (rise !== undefined) result.rise = rise;
  if (set !== undefined) result.set = set;

  if (rise === undefined && set === undefined) {
    result[extremumSign > 0 ? "alwaysUp" : "alwaysDown"] = true;
  }

  return result;
}
