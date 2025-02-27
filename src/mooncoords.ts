/**
 * @file mooncoords.ts
 * @description Calculates the moon's celestial coordinates (RA/Dec, distance, and ecliptic longitude/latitude).
 * Provides approximate positions valid for a certain period around J2000.
 */

import { LUNAR } from "./constraints/lunar";
import { DEGREES_TO_RADIANS } from "./constraints/math";
import { JULIAN_EPOCH_J2000 } from "./constraints/time";
import {
  AU,
  Days,
  J2000CenturyTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
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
 * @param {JulianDayTT} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * distance in AU, ecliptic longitude (eclipticLon), and ecliptic latitude (eclipticLat), all in radians.
 */
export function calculateLunarCoordinates(
  jd_tt: JulianDayTT,
): CelestialCoordinates {
  // Calculate centuries since J2000 for obliquity
  const T: J2000CenturyTT = getJulianCenturiesSinceJ2000(jd_tt);

  // Calculate days since J2000 epoch (JD 2451545.0)
  const d: Days = (jd_tt - JULIAN_EPOCH_J2000) as Days;

  // Mean longitude, anomaly, and argument of latitude in radians
  const meanLongitude_rad: Radians = (DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_LONGITUDE + LUNAR.MOTION.LONGITUDE * d)) as Radians;
  const meanAnomaly_rad: Radians = (DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d)) as Radians;
  const meanArgLatitude_rad: Radians = (DEGREES_TO_RADIANS *
    (LUNAR.EPOCH_J2000.MEAN_ARG_LATITUDE +
      LUNAR.MOTION.ARG_LATITUDE * d)) as Radians;

  // Ecliptic longitude with evection correction
  const eclipticLon_rad: Radians = (meanLongitude_rad +
    DEGREES_TO_RADIANS *
      LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE *
      Math.sin(meanAnomaly_rad)) as Radians;

  // Ecliptic latitude based on inclination
  const eclipticLat_rad: Radians = (DEGREES_TO_RADIANS *
    LUNAR.ORBIT.INCLINATION *
    Math.sin(meanArgLatitude_rad)) as Radians;

  // Approximate distance using elliptical orbit formula
  const distance: AU = (LUNAR.ORBIT.SEMI_MAJOR_AXIS *
    (1 - LUNAR.ORBIT.ECCENTRICITY * Math.cos(meanAnomaly_rad))) as AU;

  // True obliquity of the ecliptic for the given time
  const epsilon_rad: Radians = calculateTrueObliquity(T);

  // Equatorial coordinates
  const ra_rad: Radians = rightAscension(
    eclipticLon_rad,
    eclipticLat_rad,
    epsilon_rad,
  );
  const dec_rad: Radians = declination(
    eclipticLon_rad,
    eclipticLat_rad,
    epsilon_rad,
  );

  return {
    ra: ra_rad,
    dec: dec_rad,
    distance,
    eclipticLon: eclipticLon_rad,
    eclipticLat: eclipticLat_rad,
  };
}
