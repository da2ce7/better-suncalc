/*
  mooncalc.ts

  Contains functions to calculate moon position, illumination, and rise/set times using Julian Dates.
  All temporal parameters and results are in Terrestrial Time (TT) Julian days.

*/

import { acos, atan2, cos, DEGREE_IN_RADIANS, PI, sin, tan } from "./constants";
import { declination, rightAscension, sunCoords } from "./suncalc";
import {
  altitude,
  astroRefraction,
  azimuth,
  latitudeToRad,
  longitudeToRadWest,
  siderealTime,
  toDays,
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

  /** True if moon never sets (polar day) - considers 0.625° altitude threshold */
  alwaysUp?: boolean;

  /** True if moon never rises (polar day) - considers 0.625° altitude threshold */
  alwaysDown?: boolean;
};

/* ==================== Moon calculations ==================== */

/**
 * Calculates moon coordinates for a given number of days since J2000.
 * @param d - Days since J2000 epoch.
 * @returns Object containing moon's right ascension, declination, and distance.
 */
export function moonCoords(d: number): {
  ra: number;
  dec: number;
  dist: number;
} {
  const L = DEGREE_IN_RADIANS * (218.316 + 13.176396 * d);
  const M = DEGREE_IN_RADIANS * (134.963 + 13.064993 * d);
  const F = DEGREE_IN_RADIANS * (93.272 + 13.22935 * d);
  const l = L + DEGREE_IN_RADIANS * 6.289 * sin(M);
  const b = DEGREE_IN_RADIANS * 5.128 * sin(F);
  const dt = 385001 - 20905 * cos(M);

  return {
    ra: rightAscension(l, b),
    dec: declination(l, b),
    dist: dt,
  };
}

/**
 * Calculates moon position for provided Julian date and location.
 * @param jd - Julian day in Terrestrial Time (TT)
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @returns Object containing moon position data.
 */
export function getMoonPosition(
  jd: number,
  lat: number,
  lng: number,
): MoonPositionData {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);
  const d = toDays(jd);
  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  let h = altitude(H, phi, c.dec);
  const pa = atan2(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

  h += astroRefraction(h);

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: h,
    distance: c.dist,
    parallacticAngle: pa,
  };
}

/**
 * Calculates moon illumination parameters.
 * @param jd - Julian day in Terrestrial Time (TT)
 * @returns Object containing illumination data.
 */
export function getMoonIllumination(jd: number): MoonIlluminationData {
  const d = toDays(jd);
  const s = sunCoords(d);
  const m = moonCoords(d);
  const sdist = 149598000;
  const phi = acos(
    sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra),
  );
  const inc = atan2(sdist * sin(phi), m.dist - sdist * cos(phi));
  const angle = atan2(
    cos(s.dec) * sin(s.ra - m.ra),
    sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra),
  );

  return {
    fraction: (1 + cos(inc)) / 2,
    phase: 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / PI,
    angle: angle,
  };
}

/**
 * Calculates moon rise and set times for a given day (startJD) in Julian days.
 * @param startJD - Julian day (TT) of the day's start (midnight)
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @returns MoonTimesData with events as Julian days.
 * @remarks
 * Key improvement over original version:
 * - 0.625° altitude threshold (≈ solar refraction + lunar semi-diameter)
 * - Complete 24-hour coverage with hourly checks
 */
export function getMoonTimes(
  startJD: number,
  lat: number,
  lng: number,
): MoonTimesData {
  // 0.625° threshold accounts for:
  // - Standard refraction (-0.83° for Sun)
  // + Lunar semi-diameter (≈0.258°)
  // = ≈0.625° adjusted disk-center threshold
  const hc = 0.625 * DEGREE_IN_RADIANS;

  let previousAlt = getMoonPosition(startJD, lat, lng).altitude - hc;
  let rise: number | undefined, set: number | undefined;
  let extremumSign = 0;

  // Check hourly intervals for altitude crossings with quadratic interpolation
  for (let hour = 0; hour < 24; hour++) {
    const currentTime = startJD + hour / 24;
    const nextTime = currentTime + 1 / 24;
    const nextAlt = getMoonPosition(nextTime, lat, lng).altitude - hc;

    // No change in visibility state
    if (Math.sign(previousAlt) === Math.sign(nextAlt)) {
      previousAlt = nextAlt;
      continue;
    }

    // Quadratic interpolation parameters
    const x1 = hour;
    const x2 = hour + 1;
    const y1 = previousAlt;
    const y2 = nextAlt;

    const a =
      (y1 + y2) / 2 -
      getMoonPosition(startJD + (hour + 0.5) / 24, lat, lng).altitude;
    const b = y2 - y1;
    const xe = -b / (2 * a); // Vertex x-offset
    const ye = (a * xe + b) * xe + y1; // Vertex altitude

    // Handle crossing detection
    if (Math.abs(xe) <= 1) {
      const crossTime = startJD + (hour + xe) / 24;
      if (previousAlt < 0) {
        if (!rise) rise = crossTime;
        else set = crossTime; // Handle multiple crossings
      } else {
        if (!set) set = crossTime;
        else rise = crossTime;
      }
    }

    // Track highest excursion for polar detection
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
