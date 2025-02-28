/**
 * @file suncalc.ts
 * @module suncalc
 * @description Contains functions to calculate sun positions and times using Julian day numbers in TT.
 * All time-based inputs and outputs are in JD TT (Terrestrial Time) unless otherwise stated.
 */

import { HALF_DAY } from "./constraints/constants/time";
import {
  NUMERICAL,
  PI,
  SOLAR_EVENT_DEFINITIONS,
  TAU,
} from "./constraints/math";
import { Days, Degrees, JulianDayTT, Radians } from "./constraints/types";
import {
  computeHourAngleAtRef,
  getClosestTransitCycle,
} from "./events/celestial/transits";
import { calculateSolarCoordinates } from "./suncoords";
import {
  altitude,
  astroRefraction,
  azimuth,
  CelestialCoordinates,
  computeDerivative,
  degreesToRadians,
  latitudeToRad,
  longitudeToRadWest,
  PositionData,
} from "./utils";

/* ==================== Types ==================== */

/**
 * Represents calculated solar times expressed as Julian days in TT.
 */
export type TimesData = {
  solarNoon: JulianDayTT;
  nadir: JulianDayTT;
  [key: string]: JulianDayTT;
};

/* ==================== Sun Calculations ==================== */

/**
 * Calculates the sun's celestial coordinates (RA and Dec) for a given Julian day in TT.
 */
export function sunCoords(jd_tt: JulianDayTT): {
  rightAscension: Radians;
  declination: Radians;
} {
  const coords = calculateSolarCoordinates(jd_tt);
  return {
    rightAscension: coords.rightAscension,
    declination: coords.declination,
  };
}

/**
 * Calculates the rate of change of solar declination for transit time correction.
 */
export function solarDeclinationRate(
  time: JulianDayTT,
  delta: Days = NUMERICAL.CALCULATION.DERIVATIVE_STEP_DAYS as Days,
): number {
  const sunCoordsDecFn = (t: JulianDayTT) => sunCoords(t).declination as number;
  return computeDerivative(
    sunCoordsDecFn as (t: number) => number,
    time,
    delta,
    NUMERICAL.EPSILON.FLOATING_POINT_DAYS as number,
  );
}

// Sun times configuration: [angle in degrees, "riseName", "setName"]
let times: Array<[Degrees, string, string]> = [...SOLAR_EVENT_DEFINITIONS];

/**
 * Adds a custom time definition to the sun time calculations.
 */
export function addTime(
  angle: Degrees,
  riseName: string,
  setName: string,
): void {
  times.push([angle, riseName, setName]);
}

/**
 * Calculates the sun's position for a given Julian day and observer location.
 */
export function getPosition(
  time: JulianDayTT,
  lat: Degrees,
  lng: Degrees,
): PositionData {
  const lw = longitudeToRadWest(lng) as Radians;
  const phi = latitudeToRad(lat) as Radians;
  const c = sunCoords(time);
  const H = computeHourAngleAtRef(time, lw, c.rightAscension) as Radians;

  const geomAlt = altitude(H, phi, c.declination) as Radians;
  return {
    azimuth: azimuth(H, phi, c.declination) as Radians,
    altitude: (geomAlt + astroRefraction(geomAlt)) as Radians,
  };
}

/**
 * Calculates the hour angle for a given sun altitude.
 */
export function hourAngle(h: Radians, phi: Radians, dec: Radians): Radians {
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
  return Math.acos(Math.max(-1, Math.min(1, inner))) as Radians;
}

/**
 * Calculates the JD TT for a sun altitude event.
 */
export function getSetJ(
  h: Radians,
  lw: Radians,
  phi: Radians,
  dec: Radians,
  Jtransit: JulianDayTT,
): JulianDayTT {
  const w = hourAngle(h, phi, dec) as Radians;
  const daysOffset = (w / TAU) as Days;
  return (Jtransit + daysOffset) as JulianDayTT;
}

/**
 * Calculates sun times for a given JD TT and observer location.
 */
export function getTimes(
  jd_tt: JulianDayTT,
  lat: Degrees,
  lng: Degrees,
): TimesData {
  const lw = longitudeToRadWest(lng) as Radians;
  const phi = latitudeToRad(lat) as Radians;

  const getSunCoords = (jd: JulianDayTT): CelestialCoordinates =>
    calculateSolarCoordinates(jd);

  const transitData = getClosestTransitCycle(jd_tt, lw, getSunCoords);
  const Jnoon = transitData.transitJD as JulianDayTT;

  const c = sunCoords(Jnoon);
  const dec = c.declination as Radians;

  const result: TimesData = {
    solarNoon: Jnoon,
    nadir: (Jnoon + HALF_DAY) as JulianDayTT,
  };

  for (const [angle, riseName, setName] of times) {
    const h = degreesToRadians(angle);
    const Jset = getSetJ(h, lw, phi, dec, Jnoon);
    const Jrise = (Jnoon - (Jset - Jnoon)) as JulianDayTT;
    result[riseName] = Jrise;
    result[setName] = Jset;
  }

  return result;
}
