/*
  mooncalc.ts

  Contains functions to calculate moon position, illumination, and rise/set times.
  Depends on suncalc.ts, constants.ts, and utils.ts for shared functions and constants.
*/

import { acos, atan, cos, PI, rad, sin, tan } from "./constants";
import {
  altitude,
  astroRefraction,
  azimuth,
  declination,
  rightAscension,
  siderealTime,
  sunCoords,
} from "./suncalc";
import { hoursLater, toDays } from "./utils";

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
  const L = rad * (218.316 + 13.176396 * d);
  const M = rad * (134.963 + 13.064993 * d);
  const F = rad * (93.272 + 13.22935 * d);
  const l = L + rad * 6.289 * sin(M);
  const b = rad * 5.128 * sin(F);
  const dt = 385001 - 20905 * cos(M);

  return {
    ra: rightAscension(l, b),
    dec: declination(l, b),
    dist: dt,
  };
}

export type MoonPositionData = {
  azimuth: number;
  altitude: number;
  distance: number;
  parallacticAngle: number;
};

/**
 * Calculates moon position for provided date and location.
 * @param date - Date/time of observation.
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @returns Object containing moon position data.
 */
export function getMoonPosition(
  date: Date,
  lat: number,
  lng: number,
): MoonPositionData {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  let h = altitude(H, phi, c.dec);
  const pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

  h += astroRefraction(h);

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: h,
    distance: c.dist,
    parallacticAngle: pa,
  };
}

export type MoonIlluminationData = {
  fraction: number;
  phase: number;
  angle: number;
};

/**
 * Calculates moon illumination parameters.
 * @param date - Date/time of observation.
 * @returns Object containing illumination data.
 */
export function getMoonIllumination(date: Date): MoonIlluminationData {
  const d = toDays(date);
  const s = sunCoords(d);
  const m = moonCoords(d);
  const sdist = 149598000;
  const phi = acos(
    sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra),
  );
  const inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
  const angle = atan(
    cos(s.dec) * sin(s.ra - m.ra),
    sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra),
  );

  return {
    fraction: (1 + cos(inc)) / 2,
    phase: 0.5 + (0.5 * inc * (angle < 0 ? -1 : 1)) / PI,
    angle: angle,
  };
}

export type MoonTimesData = {
  rise?: Date;
  set?: Date;
  alwaysUp?: boolean;
  alwaysDown?: boolean;
};

/**
 * Calculates moon rise and set times for given date and location.
 * @param date - Date of observation.
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @param inUTC - Whether to use UTC time.
 * @returns Object containing moon times data.
 */
export function getMoonTimes(
  date: Date,
  lat: number,
  lng: number,
  inUTC: boolean,
): MoonTimesData {
  const t = new Date(date);
  if (inUTC) t.setUTCHours(0, 0, 0, 0);
  else t.setHours(0, 0, 0, 0);

  const hc = 0.133 * rad;
  let h0 = getMoonPosition(t, lat, lng).altitude - hc;
  let rise: number | undefined, set: number | undefined;
  let ye = 0;

  // Iterate through 2-hour increments to approximate sunrise/sunset.
  for (let i = 1; i <= 24; i += 2) {
    const h1 = getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
    const h2 = getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

    const a = (h0 + h2) / 2 - h1;
    const b = (h2 - h0) / 2;
    const xe = -b / (2 * a);
    ye = (a * xe + b) * xe + h1;
    const d = b * b - 4 * a * h1;
    let roots = 0;
    let x1 = 0,
      x2 = 0;

    if (d >= 0) {
      const dx = Math.sqrt(d) / (2 * Math.abs(a));
      x1 = xe - dx;
      x2 = xe + dx;
      if (Math.abs(x1) <= 1) roots++;
      if (Math.abs(x2) <= 1) roots++;
      if (x1 < -1) x1 = x2;
    }

    if (roots === 1) {
      if (h0 < 0) rise = i + x1;
      else set = i + x1;
    } else if (roots === 2) {
      rise = i + (ye < 0 ? x2 : x1);
      set = i + (ye < 0 ? x1 : x2);
    }

    if (rise !== undefined && set !== undefined) break;
    h0 = h2;
  }

  const result: MoonTimesData = {};
  if (rise !== undefined) result.rise = hoursLater(t, rise);
  if (set !== undefined) result.set = hoursLater(t, set);

  if (rise === undefined && set === undefined) {
    result[ye > 0 ? "alwaysUp" : "alwaysDown"] = true;
  }

  return result;
}
