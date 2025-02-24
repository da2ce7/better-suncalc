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
import { fromJulian, toDays } from "./utils";

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
