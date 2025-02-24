/*
  suncalc.ts

  Contains functions to calculate sun and moon positions, times, and illumination.
  Depends on constants.ts and utils.ts for shared constants and common operations.
*/

import {
  acos,
  asin,
  atan,
  cos,
  e,
  J0,
  J2000,
  PI,
  rad,
  sin,
  tan,
} from "./constants";
import { fromJulian, hoursLater, toDays } from "./utils";

/* ==================== Sun calculations ==================== */

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param l - Ecliptic longitude in radians.
 * @param b - Ecliptic latitude in radians.
 * @returns Right ascension in radians.
 */
export function rightAscension(l: number, b: number): number {
  return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param l - Ecliptic longitude in radians.
 * @param b - Ecliptic latitude in radians.
 * @returns Declination in radians.
 */
export function declination(l: number, b: number): number {
  return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}

/**
 * Calculates azimuth angle for a celestial body.
 * @param H - Hour angle in radians.
 * @param phi - Observer's latitude in radians.
 * @param dec - Declination of the celestial body in radians.
 * @returns Azimuth angle in radians (clockwise from north).
 */
export function azimuth(H: number, phi: number, dec: number): number {
  return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}

/**
 * Calculates altitude angle for a celestial body.
 * @param H - Hour angle in radians.
 * @param phi - Observer's latitude in radians.
 * @param dec - Declination of celestial body in radians.
 * @returns Altitude angle in radians.
 */
export function altitude(H: number, phi: number, dec: number): number {
  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

/**
 * Calculates sidereal time for given Julian days.
 * @param d - Days since J2000 epoch.
 * @param lw - Longitude west in radians.
 * @returns Sidereal time in radians.
 */
export function siderealTime(d: number, lw: number): number {
  return rad * (280.16 + 360.9856235 * d) - lw;
}

/**
 * Corrects altitude for atmospheric refraction.
 * @param h - Altitude angle in radians (geometric).
 * @returns Refraction correction in radians.
 */
export function astroRefraction(h: number): number {
  if (h < 0) h = 0;
  return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

/**
 * Calculates the solar mean anomaly.
 * @param d - Days since J2000 epoch.
 * @returns Solar mean anomaly in radians.
 */
export function solarMeanAnomaly(d: number): number {
  return rad * (357.5291 + 0.98560028 * d);
}

/**
 * Calculates ecliptic longitude from solar mean anomaly.
 * @param M - Solar mean anomaly in radians.
 * @returns Ecliptic longitude in radians.
 */
export function eclipticLongitude(M: number): number {
  const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
  const P = rad * 102.9372;
  return M + C + P + PI;
}

/**
 * Calculates sun coordinates for given days since J2000.
 * @param d - Days since J2000 epoch.
 * @returns Object containing sun's declination and right ascension.
 */
export function sunCoords(d: number): { dec: number; ra: number } {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0),
  };
}

export type PositionData = {
  azimuth: number;
  altitude: number;
};

/**
 * Calculates sun position for given date and location.
 * @param date - Date/time of observation.
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @returns Object containing azimuth and altitude in radians.
 */
export function getPosition(
  date: Date,
  lat: number,
  lng: number,
): PositionData {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
}

// Sun times configuration: [angle in degrees, "riseName", "setName"].
const times: Array<[number, string, string]> = [
  [-0.833, "sunrise", "sunset"],
  [-0.3, "sunriseEnd", "sunsetStart"],
  [-6, "dawn", "dusk"],
  [-12, "nauticalDawn", "nauticalDusk"],
  [-18, "nightEnd", "night"],
  [6, "goldenHourEnd", "goldenHour"],
];

/**
 * Adds a custom time definition to sun time calculations.
 * @param angle - Altitude angle in degrees.
 * @param riseName - Name for the rise time property.
 * @param setName - Name for the set time property.
 */
export function addTime(
  angle: number,
  riseName: string,
  setName: string,
): void {
  times.push([angle, riseName, setName]);
}

/**
 * Calculates Julian cycle for given days and longitude.
 * @param d - Days since J2000 epoch.
 * @param lw - Longitude west in radians.
 * @returns Julian cycle number.
 */
export function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * PI));
}

/**
 * Approximates the transit time.
 * @param Ht - Hour angle.
 * @param lw - Longitude west in radians.
 * @param n - Julian cycle number.
 * @returns Approximate transit time in Julian days.
 */
export function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * PI) + n;
}

/**
 * Calculates the precise solar transit time.
 * @param ds - Days since J2000 epoch.
 * @param M - Solar mean anomaly.
 * @param L - Ecliptic longitude.
 * @returns Julian date of solar transit.
 */
export function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
}

/**
 * Calculates the hour angle for a given altitude.
 * @param h - Altitude angle in radians.
 * @param phi - Observer's latitude in radians.
 * @param dec - Sun declination in radians.
 * @returns Hour angle in radians.
 */
export function hourAngle(h: number, phi: number, dec: number): number {
  // Consider clamping value between -1 and 1 if necessary:
  const inner = (sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec));
  return acos(inner);
}

/**
 * Calculates the Julian date for a sun altitude event.
 * @param h - Altitude angle in radians.
 * @param lw - Longitude west in radians.
 * @param phi - Observer's latitude in radians.
 * @param dec - Sun declination in radians.
 * @param n - Julian cycle number.
 * @param M - Solar mean anomaly.
 * @param L - Ecliptic longitude.
 * @returns Julian date of the event.
 */
export function getSetJ(
  h: number,
  lw: number,
  phi: number,
  dec: number,
  n: number,
  M: number,
  L: number,
): number {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

export type TimesData = {
  solarNoon: Date;
  nadir: Date;
  [key: string]: Date;
};

/**
 * Calculates sun times (e.g., sunrise, sunset, dawn etc.) for given date and location.
 * @param date - Date of observation.
 * @param lat - Observer's latitude in degrees.
 * @param lng - Observer's longitude in degrees.
 * @returns Object containing calculated sun times as Date objects.
 */
export function getTimes(date: Date, lat: number, lng: number): TimesData {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  const result: TimesData = {
    solarNoon: fromJulian(Jnoon),
    nadir: fromJulian(Jnoon + 0.5),
  };

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
    const Jrise = Jnoon - (Jset - Jnoon);

    result[time[1]] = fromJulian(Jrise);
    result[time[2]] = fromJulian(Jset);
  }

  return result;
}

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
