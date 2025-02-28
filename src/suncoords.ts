/**
 * @file suncoords.ts
 * @description Calculates the sun's celestial coordinates (RA/Dec and ecliptic longitude).
 * Valid for ±200 years around J2000 (~1800-2200), ~0.01° accuracy in declination.
 */

import { EARTH } from "./constraints/constants/earth";
import {
  DAYS_PER_JULIAN_CENTURY,
  JULIAN_EPOCH_J2000,
} from "./constraints/constants/time";
import { SOLAR } from "./constraints/solar";
import {
  AstronomicalUnits,
  Days,
  Degrees,
  J2000CenturyTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import { eclipticToDeclination } from "./ephemerides/celestial/equatorial";
import {
  calculateTrueObliquity,
  CelestialCoordinates,
} from "./events/celestial/position";
import {
  getJulianCenturiesSinceJ2000,
  getRightAscension,
} from "./math/austomath";
import { degreesToRadians } from "./math/trigonometry/trigonometry";

/* ==================== Coordinate Calculations ==================== */

/**
 * Calculates the sun's celestial coordinates and distance for a given Julian day in Terrestrial Time (TT).
 * - Valid for ±200 years around J2000 (~1800-2200)
 * - ~0.01° accuracy in declination
 * - Distance approximated with r ≈ 1 - e * cos(M) in AstronomicalUnits
 * @param {JulianDayTT} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {CelestialCoordinates} Object containing right ascension (ra), declination (dec),
 * ecliptic longitude (eclipticLon), ecliptic latitude (eclipticLat) in radians, and distance in AstronomicalUnits.
 */
export function calculateSolarCoordinates(
  jd_tt: JulianDayTT,
): CelestialCoordinates {
  const T: J2000CenturyTT = getJulianCenturiesSinceJ2000(jd_tt);
  const M_rad: Radians = solarMeanAnomaly(jd_tt); // Mean anomaly in radians
  const eclipticLon_rad: Radians = eclipticLongitude(jd_tt);
  const epsilon_rad: Radians = calculateTrueObliquity(T);
  const rightAscension: Radians = getRightAscension(
    eclipticLon_rad,
    0 as Radians,
    epsilon_rad,
  );
  const declination: Radians = eclipticToDeclination(
    eclipticLon_rad,
    0 as Radians,
    epsilon_rad,
  );
  const distance: AstronomicalUnits = (1 -
    EARTH.ORBIT.ECCENTRICITY * Math.cos(M_rad)) as AstronomicalUnits; // Distance in AstronomicalUnits

  return {
    rightAscension: rightAscension,
    declination: declination,
    distance,
    eclipticLongitude: eclipticLon_rad,
    eclipticLatitude: 0 as Radians,
  };
}

/* ==================== Core Mathematical Functions ==================== */

/**
 * Calculates the solar mean anomaly for a given Julian day.
 * @param {JulianDayTT} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {Radians} Solar mean anomaly in radians.
 */
export function solarMeanAnomaly(jd_tt: JulianDayTT): Radians {
  const T: J2000CenturyTT = getJulianCenturiesSinceJ2000(jd_tt);
  const meanAnomalyDeg: Degrees = (SOLAR.EPOCH_J2000.MEAN_ANOMALY +
    SOLAR.MOTION.ANOMALY * (DAYS_PER_JULIAN_CENTURY as Days) * T) as Degrees;
  let meanAnomalyDegNormalized: Degrees = (meanAnomalyDeg % 360) as Degrees;
  if (meanAnomalyDegNormalized < 0) {
    meanAnomalyDegNormalized = (meanAnomalyDegNormalized + 360) as Degrees; // Ensure [0, 360)
  }
  return degreesToRadians(meanAnomalyDegNormalized);
}

/**
 * Calculates the ecliptic longitude of the sun for a given Julian day.
 * @param {JulianDayTT} jd_tt - Julian day in Terrestrial Time (TT).
 * @returns {Radians} Ecliptic longitude in radians.
 */
export function eclipticLongitude(jd_tt: JulianDayTT): Radians {
  const d: Days = (jd_tt - JULIAN_EPOCH_J2000) as Days;
  let L_deg: Degrees = (SOLAR.EPOCH_J2000.MEAN_LONGITUDE +
    SOLAR.MOTION.LONGITUDE * d) as Degrees;
  L_deg = (L_deg % 360) as Degrees;
  if (L_deg < 0) L_deg = (L_deg + 360) as Degrees; // Ensure [0, 360)
  const M_rad: Radians = solarMeanAnomaly(jd_tt);
  const C_deg: Degrees = (SOLAR.EQUATION_OF_CENTER[0] * Math.sin(M_rad) +
    SOLAR.EQUATION_OF_CENTER[1] * Math.sin(2 * M_rad) +
    SOLAR.EQUATION_OF_CENTER[2] * Math.sin(3 * M_rad)) as Degrees;
  let trueLongitude_deg: Degrees = (L_deg + C_deg) as Degrees;
  trueLongitude_deg = (trueLongitude_deg % 360) as Degrees;
  if (trueLongitude_deg < 0) {
    trueLongitude_deg = (trueLongitude_deg + 360) as Degrees; // Ensure [0, 360)
  }
  return degreesToRadians(trueLongitude_deg);
}
