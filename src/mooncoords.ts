/**
 * @file mooncoords.ts
 * @description Calculates the moon's celestial coordinates (RA/Dec, distance, and ecliptic longitude/latitude).
 * Provides approximate positions valid for a certain period around J2000.
 */

import { LUNAR } from "./constraints/lunar";
import {
  AU,
  Degrees,
  J2000CenturyTT,
  J2000DayTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import {
  calculateTrueObliquity,
  CelestialCoordinates,
  degreesToRadians,
  getDeclination,
  getJulianCenturiesSinceJ2000,
  getRightAscension,
  julianDayToJ2000Day,
} from "./utils";

/* ==================== Coordinate Calculations ==================== */

/**
 * Calculates the moon's celestial coordinates and distance for a given Julian day in Terrestrial Time (TT).
 * - Provides approximate positions valid for a certain period around J2000.
 * - Distance is approximated using the mean anomaly and orbital eccentricity.
 * @param {JulianDayTT} time - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * distance in AU, ecliptic longitude (eclipticLon), and ecliptic latitude (eclipticLat), all in radians.
 */
export function calculateLunarCoordinates(
  time: JulianDayTT,
): CelestialCoordinates {
  // Calculate centuries since J2000 for obliquity
  const T: J2000CenturyTT = getJulianCenturiesSinceJ2000(time);

  // Calculate days since J2000 epoch (JD 2451545.0)
  const d: J2000DayTT = julianDayToJ2000Day(time);

  // Mean longitude, anomaly, and argument of latitude in radians
  const meanLongitude_rad: Radians = degreesToRadians(
    (LUNAR.EPOCH_J2000.MEAN_LONGITUDE + LUNAR.MOTION.LONGITUDE * d) as Degrees,
  );
  const meanAnomaly_rad: Radians = degreesToRadians(
    (LUNAR.EPOCH_J2000.MEAN_ANOMALY + LUNAR.MOTION.ANOMALY * d) as Degrees,
  );
  const meanArgLatitude_rad: Radians = degreesToRadians(
    (LUNAR.EPOCH_J2000.MEAN_ARG_LATITUDE +
      LUNAR.MOTION.ARG_LATITUDE * d) as Degrees,
  );

  // Ecliptic longitude with evection correction
  const eclipticLon_rad: Radians = (meanLongitude_rad +
    degreesToRadians(LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE) *
      Math.sin(meanAnomaly_rad)) as Radians;

  // Ecliptic latitude based on inclination
  const eclipticLat_rad: Radians = (degreesToRadians(LUNAR.ORBIT.INCLINATION) *
    Math.sin(meanArgLatitude_rad)) as Radians;

  // Approximate distance using elliptical orbit formula
  const distance: AU = (LUNAR.ORBIT.SEMI_MAJOR_AXIS *
    (1 - LUNAR.ORBIT.ECCENTRICITY * Math.cos(meanAnomaly_rad))) as AU;

  // True obliquity of the ecliptic for the given time
  const epsilon_rad: Radians = calculateTrueObliquity(T);

  // Equatorial coordinates
  const ra_rad: Radians = getRightAscension(
    eclipticLon_rad,
    eclipticLat_rad,
    epsilon_rad,
  );
  const dec_rad: Radians = getDeclination(
    eclipticLon_rad,
    eclipticLat_rad,
    epsilon_rad,
  );

  return {
    rightAscension: ra_rad,
    declination: dec_rad,
    distance,
    eclipticLongitude: eclipticLon_rad,
    eclipticLatitude: eclipticLat_rad,
  };
}
