/**
 * @file suncalc.ts
 * @module suncalc
 * @description Contains functions to calculate sun positions and times using Julian day numbers in TT.
 * All time-based inputs and outputs are in JD TT (Terrestrial Time) unless otherwise stated.
 */

import {
  HALF_DAY,
  NUMERICAL_DERIVATIVE_STEP_DAYS,
  SOLAR_EVENT_DEFINITIONS,
} from "./constraints/constants";
import { DEGREES_TO_RADIANS, PI, TAU } from "./constraints/math";
import { calculateSolarCoordinates } from "./suncoords";
import { getClosestTransitCycle } from "./transits";
import {
  altitude,
  astroRefraction,
  azimuth,
  CelestialCoordinates,
  computeDerivative,
  latitudeToRad,
  longitudeToRadWest,
  PositionData,
  siderealTime,
} from "./utils";

/* ==================== Types ==================== */

/**
 * Represents calculated solar times expressed as Julian days in TT.
 * @typedef {Object} TimesData
 * @property {number} solarNoon - Julian day (TT) of solar noon.
 * @property {number} nadir - Julian day (TT) of nadir.
 * @property {number} [key: string] - Additional events as Julian days (TT).
 */
export type TimesData = {
  solarNoon: number;
  nadir: number;
  [key: string]: number;
};

/* ==================== Sun Calculations ==================== */

/**
 * Calculates the sun's celestial coordinates (RA and Dec) for a given Julian day in TT.
 * @param {number} jd_tt - Julian day in TT.
 * @returns {{ ra: number; dec: number }} Object containing right ascension and declination in radians.
 */
export function sunCoords(jd_tt: number): { ra: number; dec: number } {
  const coords = calculateSolarCoordinates(jd_tt);
  return { ra: coords.ra, dec: coords.dec };
}

/**
 * Calculates the rate of change of solar declination for transit time correction.
 * @param {number} jd_tt - Julian day in TT.
 * @param {number} [delta=NUMERICAL_DERIVATIVE_STEP_DAYS] - Finite difference step size in days.
 * @returns {number} Declination rate in radians per day.
 */
export function solarDeclinationRate(
  jd_tt: number,
  delta: number = NUMERICAL_DERIVATIVE_STEP_DAYS,
): number {
  const sunCoordsDecFn = (t: number) => sunCoords(t).dec;
  return computeDerivative(sunCoordsDecFn, jd_tt, delta);
}

// Sun times configuration: [angle in degrees, "riseName", "setName"]
let times: Array<[number, string, string]> = [...SOLAR_EVENT_DEFINITIONS];

/**
 * Adds a custom time definition to the sun time calculations.
 * @param {number} angle - Altitude angle in degrees.
 * @param {string} riseName - Property name for the rise event (Julian day in TT).
 * @param {string} setName - Property name for the set event (Julian day in TT).
 */
export function addTime(
  angle: number,
  riseName: string,
  setName: string,
): void {
  times.push([angle, riseName, setName]);
}

/**
 * Calculates the sun's position for a given Julian day and observer location.
 * @param {number} jd_tt - Julian day in TT.
 * @param {number} lat - Observer's latitude in degrees.
 * @param {number} lng - Observer's longitude in degrees.
 * @returns {PositionData} Object containing azimuth and altitude (including atmospheric refraction).
 */
export function getPosition(
  jd_tt: number,
  lat: number,
  lng: number,
): PositionData {
  const lw = longitudeToRadWest(lng); // Convert longitude to radians west
  const phi = latitudeToRad(lat); // Convert latitude to radians
  const c = sunCoords(jd_tt); // Sun coordinates using JD TT
  const H = siderealTime(jd_tt, lw) - c.ra; // Hour angle using JD TT directly

  // Calculate geometric altitude then apply atmospheric refraction
  const geomAlt = altitude(H, phi, c.dec);
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: geomAlt + astroRefraction(geomAlt),
  };
}

/**
 * Calculates the hour angle for a given sun altitude.
 * @param {number} h - Target altitude in radians.
 * @param {number} phi - Observer's latitude in radians.
 * @param {number} dec - Sun's declination in radians.
 * @returns {number} Hour angle in radians.
 */
export function hourAngle(h: number, phi: number, dec: number): number {
  if (
    Math.abs(phi) > PI / 2 ||
    Math.abs(dec) > PI / 2 ||
    Math.abs(h) > PI / 2
  ) {
    throw new Error("Angles must be within [-π/2, π/2] radians");
  }
  const inner =
    (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) /
    (Math.cos(phi) * Math.cos(dec));
  return Math.acos(Math.max(-1, Math.min(1, inner)));
}

/**
 * Calculates the JD TT for a sun altitude event.
 * @param {number} h - Target altitude in radians.
 * @param {number} lw - Observer's longitude west in radians.
 * @param {number} phi - Observer's latitude in radians.
 * @param {number} dec - Sun's declination in radians.
 * @param {number} Jtransit - Julian day (TT) of the transit time.
 * @returns {number} Julian day (TT) of the event.
 */
export function getSetJ(
  h: number,
  lw: number,
  phi: number,
  dec: number,
  Jtransit: number,
): number {
  const w = hourAngle(h, phi, dec);
  const daysOffset = w / TAU;
  return Jtransit + daysOffset;
}

/**
 * Calculates sun times for a given JD TT and observer location.
 * @param {number} jd_tt - Julian day in TT.
 * @param {number} lat - Observer's latitude in degrees.
 * @param {number} lng - Observer's longitude in degrees.
 * @returns {TimesData} Object containing solar events as JD TT.
 */
export function getTimes(jd_tt: number, lat: number, lng: number): TimesData {
  const lw = longitudeToRadWest(lng);
  const phi = latitudeToRad(lat);

  // Define Sun coordinate function for transits.ts
  const getSunCoords = (jd: number): CelestialCoordinates =>
    calculateSolarCoordinates(jd);

  // Get precise transit time and Julian cycle
  const transitData = getClosestTransitCycle(jd_tt, lw, getSunCoords);
  const Jnoon = transitData.transitJD;

  // Compute solar parameters at transit
  const c = sunCoords(Jnoon);
  const dec = c.dec;

  const result: TimesData = {
    solarNoon: Jnoon,
    nadir: Jnoon + HALF_DAY,
  };

  // Calculate event times
  for (const [angle, riseName, setName] of times) {
    const h = angle * DEGREES_TO_RADIANS;
    const Jset = getSetJ(h, lw, phi, dec, Jnoon);
    const Jrise = Jnoon - (Jset - Jnoon); // Symmetry around noon
    result[riseName] = Jrise;
    result[setName] = Jset;
  }

  return result;
}
