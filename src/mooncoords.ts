/**
 * @file mooncoords.ts
 * @description Calculates the moon's celestial coordinates (RA/Dec, distance, and ecliptic longitude/latitude).
 * Provides approximate positions valid for a certain period around J2000.
 */

import { LUNAR } from "./constraints/lunar";
import { DEGREES_TO_RADIANS } from "./constraints/math";
import { JULIAN_EPOCH_J2000 } from "./constraints/time";
import {
  calculateTrueObliquity,
  CelestialCoordinates,
  declination,
  getJulianCenturiesSinceJ2000,
  rightAscension,
} from "./utils";

/* ==================== Coordinate Calculations ==================== */

/**
 * Calculates the moon's celestial coordinates and distance for a given Julian day in Terrestrial Time (TT).
 * - Provides approximate positions valid for a certain period around J2000.
 * - Distance is approximated using the mean anomaly and orbital eccentricity.
 * @param {number} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * distance in AU, ecliptic longitude (eclipticLat), and ecliptic latitude (eclipticLat), all in radians.
 */
export function calculateLunarCoordinates(jd_tt: number): CelestialCoordinates {
  // Calculate centuries since J2000 for obliquity
  const T = getJulianCenturiesSinceJ2000(jd_tt);

  // Calculate days since J2000 epoch (JD 2451545.0)
  const d = jd_tt - JULIAN_EPOCH_J2000;

  // Mean longitude, anomaly, and argument of latitude in radians
  const L =
    DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_LONGITUDE + LUNAR.MOTION.LONGITUDE * d);
  const M =
    DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d);
  const F =
    DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ARG_LATITUDE + LUNAR.MOTION.ARG_LATITUDE * d);

  // Ecliptic longitude with evection correction
  const eclipticLon =
    L +
    DEGREES_TO_RADIANS *
      LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE *
      Math.sin(M);

  // Ecliptic latitude based on inclination
  const eclipticLat =
    DEGREES_TO_RADIANS * LUNAR.ORBIT.INCLINATION * Math.sin(F);

  // Approximate distance using elliptical orbit formula
  const distance =
    LUNAR.ORBIT.SEMI_MAJOR_AXIS * (1 - LUNAR.ORBIT.ECCENTRICITY * Math.cos(M));

  // True obliquity of the ecliptic for the given time
  const epsilon = calculateTrueObliquity(T);

  // Equatorial coordinates
  const ra = rightAscension(eclipticLon, eclipticLat, epsilon);
  const dec = declination(eclipticLon, eclipticLat, epsilon);

  return { ra, dec, distance, eclipticLon, eclipticLat };
}
