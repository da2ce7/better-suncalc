/*
  suncalc.ts

  Contains functions to calculate sun positions and times using Julian day numbers.
  All date/time parameters and results are expressed as Julian day (floating point).
*/

import {
  acos,
  asin,
  atan2,
  cos,
  DEGREE_IN_RADIANS,
  EARTH_OBLIQUITY_J2000,
  J0,
  J2000,
  PI,
  sin,
  tan,
} from "./constants";
import {
  altitude,
  astroRefraction,
  azimuth,
  latitudeToRad,
  longitudeToRadWest,
  PositionData,
  siderealTime,
  toDays,
} from "./utils";

/* ==================== Sun Types ==================== */

/**
 * Contains calculated solar times expressed as Julian days.
 * All properties represent Julian day numbers.
 */
export type TimesData = {
  solarNoon: number; // Julian day of solar noon (sun at highest position)
  nadir: number; // Julian day of nadir (darkest moment of night)
  [key: string]: number; // Additional events added via addTime()
};

/* ==================== Sun calculations ==================== */

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param l - Ecliptic longitude in radians
 * @param b - Ecliptic latitude in radians
 * @returns Right ascension in radians
 */
export function rightAscension(l: number, b: number): number {
  return atan2(
    sin(l) * cos(EARTH_OBLIQUITY_J2000) - tan(b) * sin(EARTH_OBLIQUITY_J2000),
    cos(l),
  );
}

/**
 * Calculates declination from ecliptic coordinates
 * @param l - Ecliptic longitude in radians
 * @param b - Ecliptic latitude in radians
 * @returns Declination in radians
 */
export function declination(l: number, b: number): number {
  return asin(
    sin(b) * cos(EARTH_OBLIQUITY_J2000) +
      cos(b) * sin(EARTH_OBLIQUITY_J2000) * sin(l),
  );
}

/**
 * Calculates the solar mean anomaly (Earth's position in elliptical orbit)
 * @param d - Days since J2000 epoch
 * @returns Solar mean anomaly in radians
 */
export function solarMeanAnomaly(d: number): number {
  return DEGREE_IN_RADIANS * (357.5291 + 0.98560028 * d);
}

/**
 * Calculates ecliptic longitude from solar mean anomaly
 * @param M - Solar mean anomaly in radians
 * @returns Ecliptic longitude in radians
 */
export function eclipticLongitude(M: number): number {
  // Equation of center
  const C =
    DEGREE_IN_RADIANS *
    (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
  const P = DEGREE_IN_RADIANS * 102.9372; // Perihelion longitude
  return M + C + P + PI; // True longitude
}

/**
 * Calculates sun coordinates for given days since J2000
 * @param d - Days since J2000 epoch
 * @returns Object with sun's declination and right ascension
 */
export function sunCoords(d: number): { dec: number; ra: number } {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M); // Ecliptic longitude
  return {
    dec: declination(L, 0), // Declination
    ra: rightAscension(L, 0), // Right ascension
  };
}

// Sun times configuration: [angle in degrees, "riseName", "setName"]
const times: Array<[number, string, string]> = [
  [-0.833, "sunrise", "sunset"], // Center sun at horizon
  [-0.3, "sunriseEnd", "sunsetStart"], // Sun edges at horizon
  [-6, "dawn", "dusk"], // Civil twilight
  [-12, "nauticalDawn", "nauticalDusk"], // Nautical twilight
  [-18, "nightEnd", "night"], // Astronomical twilight
  [6, "goldenHourEnd", "goldenHour"], // Morning/evening golden hour
];

/**
 * Adds custom time definition to sun time calculations
 * @param angle - Altitude angle in degrees
 * @param riseName - Property name for rise event (Julian day)
 * @param setName - Property name for set event (Julian day)
 */
export function addTime(
  angle: number,
  riseName: string,
  setName: string,
): void {
  times.push([angle, riseName, setName]);
}

/**
 * Calculates sun position for given Julian day and location
 * @param j - Julian day of observation
 * @param lat - Observer's latitude in degrees
 * @param lng - Observer's longitude in degrees
 * @returns PositionData with azimuth and altitude (including refraction)
 */
export function getPosition(j: number, lat: number, lng: number): PositionData {
  const lw = longitudeToRadWest(lng); // Convert longitude to radians west
  const phi = latitudeToRad(lat); // Convert latitude to radians
  const d = toDays(j); // Days since J2000 for given Julian day
  const c = sunCoords(d); // Sun coordinates
  const H = siderealTime(d, lw) - c.ra; // Hour angle

  // Calculate geometric altitude then apply atmospheric refraction
  const geomAlt = altitude(H, phi, c.dec);
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: geomAlt + astroRefraction(geomAlt),
  };
}

/**
 * Calculates Julian cycle number for solar events
 * @param d - Days since J2000
 * @param lw - Longitude west in radians
 * @returns Integer Julian cycle number
 */
export function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * PI));
}

/**
 * Approximates transit time of solar culmination
 * @param Ht - Hour angle of transit time
 * @param lw - Longitude west in radians
 * @param n - Julian cycle number
 * @returns Approximate transit time (Julian days)
 */
export function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * PI) + n;
}

/**
 * Calculates precise solar transit Julian day
 * @param ds - Days since J2000 of approximate transit
 * @param M - Solar mean anomaly
 * @param L - Ecliptic longitude
 * @returns Julian day of solar transit
 */
export function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
}

/**
 * Calculates hour angle for given sun altitude
 * @param h - Target altitude in radians
 * @param phi - Observer latitude in radians
 * @param dec - Sun declination in radians
 * @returns Hour angle in radians (± bounds)
 */
export function hourAngle(h: number, phi: number, dec: number): number {
  // Input safety clamp to avoid invalid values in acos()
  const inner = (sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec));
  return acos(Math.max(-1, Math.min(1, inner)));
}

/**
 * Calculates Julian day for sun altitude event
 * @param h - Target altitude in radians
 * @param lw - Longitude west in radians
 * @param phi - Latitude in radians
 * @param dec - Sun declination
 * @param n - Julian cycle
 * @param M - Solar mean anomaly
 * @param L - Ecliptic longitude
 * @returns Julian day of the event
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
  const a = approxTransit(w, lw, n); // Approximate transit
  return solarTransitJ(a, M, L); // Refined transit time
}

/**
 * Calculates sun times for given Julian day and location
 * @param j - Julian day of observation
 * @param lat - Latitude in degrees
 * @param lng - Longitude in degrees
 * @returns TimesData with solar events as Julian days
 */
export function getTimes(j: number, lat: number, lng: number): TimesData {
  const lw = longitudeToRadWest(lng); // Convert longitude to radians west
  const phi = latitudeToRad(lat); // Convert latitude to radians
  const d = toDays(j); // Days since J2000 for input Julian day
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n); // Solar transit approximation
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L); // Precise solar noon

  const result: TimesData = {
    solarNoon: Jnoon,
    nadir: Jnoon + 0.5, // Solar midnight (+0.5 days from noon)
  };

  // Calculate all configured time events
  for (const [angle, riseName, setName] of times) {
    const Jset = getSetJ(angle * DEGREE_IN_RADIANS, lw, phi, dec, n, M, L);
    const Jrise = Jnoon - (Jset - Jnoon); // Symmetrical to set time

    result[riseName] = Jrise;
    result[setName] = Jset;
  }

  return result;
}
