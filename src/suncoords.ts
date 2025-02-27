// suncoords.ts
/**
 * @file suncoords.ts
 * @description Calculates the sun's celestial coordinates (RA/Dec and ecliptic longitude).
 * Valid for ±200 years around J2000 (~1800-2200), ~0.01° accuracy in declination.
 */

import { EARTH } from "./constraints/earth";
import { DEGREES_TO_RADIANS } from "./constraints/math";
import { SOLAR } from "./constraints/solar";
import {
  DAYS_PER_JULIAN_CENTURY,
  JULIAN_EPOCH_J2000,
} from "./constraints/time";
import {
  calculateTrueObliquity,
  CelestialCoordinates,
  declination,
  getJulianCenturiesSinceJ2000,
  rightAscension,
} from "./utils";

/* ==================== Coordinate Calculations ==================== */

/**
 * Calculates the sun's celestial coordinates and distance for a given Julian day in Terrestrial Time (TT).
 * - Valid for ±200 years around J2000 (~1800-2200)
 * - ~0.01° accuracy in declination
 * - Distance approximated with r ≈ 1 - e * cos(M) in AU
 * @param {number} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * ecliptic longitude (eclipticLon), ecliptic latitude (eclipticLat) in radians, and distance in AU.
 */
export function calculateSolarCoordinates(jd_tt: number): CelestialCoordinates {
  const T = getJulianCenturiesSinceJ2000(jd_tt);
  const M = solarMeanAnomaly(jd_tt); // Mean anomaly in radians
  const eclipticLon = eclipticLongitude(jd_tt);
  const epsilon = calculateTrueObliquity(T);
  const ra = rightAscension(eclipticLon, 0, epsilon);
  const dec = declination(eclipticLon, 0, epsilon);
  const distance = 1 - EARTH.ORBIT.ECCENTRICITY * Math.cos(M); // Distance in AU

  return { ra, dec, distance, eclipticLon, eclipticLat: 0 };
}

/* ==================== Core Mathematical Functions ==================== */

/**
 * Calculates the solar mean anomaly for a given Julian day.
 * @param {number} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {number} Solar mean anomaly in radians.
 */
export function solarMeanAnomaly(jd_tt: number): number {
  const T = getJulianCenturiesSinceJ2000(jd_tt);
  const M_deg =
    SOLAR.EPOCH_J2000.MEAN_ANOMALY +
    SOLAR.MOTION.ANOMALY * DAYS_PER_JULIAN_CENTURY * T;
  let M_deg_normalized = M_deg % 360;
  if (M_deg_normalized < 0) M_deg_normalized += 360; // Ensure [0, 360)
  return M_deg_normalized * DEGREES_TO_RADIANS;
}

/**
 * Calculates the ecliptic longitude of the sun for a given Julian day.
 * @param {number} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {number} Ecliptic longitude in radians.
 */
export function eclipticLongitude(jd_tt: number): number {
  const d = jd_tt - JULIAN_EPOCH_J2000;
  let L = (SOLAR.EPOCH_J2000.MEAN_LONGITUDE + SOLAR.MOTION.LONGITUDE * d) % 360;
  if (L < 0) L += 360; // Ensure [0, 360)
  const M = solarMeanAnomaly(jd_tt);
  const C =
    SOLAR.EQUATION_OF_CENTER[0] * Math.sin(M) +
    SOLAR.EQUATION_OF_CENTER[1] * Math.sin(2 * M) +
    SOLAR.EQUATION_OF_CENTER[2] * Math.sin(3 * M);
  let trueLongitude = (L + C) % 360;
  if (trueLongitude < 0) trueLongitude += 360; // Ensure [0, 360)
  return trueLongitude * DEGREES_TO_RADIANS;
}
