/**
 * @file mooncoords.ts
 * @description Calculates the moon's celestial coordinates (RA/Dec, distance, and ecliptic longitude/latitude).
 * Provides approximate positions valid for a certain period around J2000.
 */

import { LUNAR } from "./constraints/constants/lunar";
import {
  AstronomicalUnits,
  J2000CenturyTT,
  J2000DayTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import { eclipticToDeclination } from "./ephemerides/celestial/equatorial";
import {
  calculateTrueObliquity,
  CelestialCoordinates,
} from "./events/celestial/position";
import {
  angularDisplacementAstro,
  eclipticLatitudeFromInclination,
  eclipticLongitudeWithEvection,
  ellipticalDistance,
  getJulianCenturiesSinceJ2000,
  getRightAscension,
  julianDayToJ2000Day,
} from "./math/austomath";

/* ==================== Coordinate Calculations ==================== */

/**
 * Calculates the moon's celestial coordinates and distance for a given Julian day in Terrestrial Time (TT).
 * - Provides approximate positions valid for a certain period around J2000.
 * - Distance is approximated using the mean anomaly and orbital eccentricity.
 * @param {JulianDayTT} time - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * distance in AstronomicalUnits, ecliptic longitude (eclipticLon), and ecliptic latitude (eclipticLat), all in radians.
 */
export function calculateLunarCoordinates(
  time: JulianDayTT,
): CelestialCoordinates {
  // Calculate centuries since J2000 for obliquity
  const T: J2000CenturyTT = getJulianCenturiesSinceJ2000(time);

  // Calculate days since J2000 epoch (JD 2451545.0)
  const d: J2000DayTT = julianDayToJ2000Day(time);

  // Mean longitude, anomaly, and argument of latitude in radians
  const meanLongitude: Radians = angularDisplacementAstro(
    LUNAR.EPOCH_J2000.MEAN_LONGITUDE,
    LUNAR.MOTION.LONGITUDE,
    d,
    false,
  );
  const meanAnomaly: Radians = angularDisplacementAstro(
    LUNAR.EPOCH_J2000.MEAN_ANOMALY,
    LUNAR.MOTION.ANOMALY,
    d,
    false,
  );

  const meanArgLatitude: Radians = angularDisplacementAstro(
    LUNAR.EPOCH_J2000.MEAN_ARG_LATITUDE,
    LUNAR.MOTION.ARG_LATITUDE,
    d,
    false,
  );

  const eclipticLongitude: Radians = eclipticLongitudeWithEvection(
    meanLongitude,
    meanAnomaly,
    LUNAR.PERTURBATIONS.EVECTION_LONGITUDE_AMPLITUDE,
  );

  const eclipticLatitude: Radians = eclipticLatitudeFromInclination(
    LUNAR.ORBIT.INCLINATION,
    meanArgLatitude,
  );

  const distance: AstronomicalUnits = ellipticalDistance(
    LUNAR.ORBIT.SEMI_MAJOR_AXIS,
    LUNAR.ORBIT.ECCENTRICITY,
    meanAnomaly,
  );

  // True obliquity of the ecliptic for the given time
  const epsilon: Radians = calculateTrueObliquity(T);

  // Equatorial coordinates
  const rightAscension: Radians = getRightAscension(
    eclipticLongitude,
    eclipticLatitude,
    epsilon,
  );
  const declination: Radians = eclipticToDeclination(
    eclipticLongitude,
    eclipticLatitude,
    epsilon,
  );

  return {
    rightAscension: rightAscension,
    declination: declination,
    distance,
    eclipticLongitude: eclipticLongitude,
    eclipticLatitude: eclipticLatitude,
  };
}
