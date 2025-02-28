/**
 * @file utils.ts
 * @module utils
 * @description Shared functions for celestial calculations, time conversions, numerical methods, and event detection.
 * Includes documentation of key assumptions and limitations for maintainability.
 *
 * @notes
 * - Angular units are explicitly noted in function parameters (degrees or radians).
 * - Time-based calculations assume JD TT unless otherwise stated.
 * - Numerical methods include stability thresholds to handle floating-point edge cases.
 */

import { EARTH, REFRACTION } from "./constraints/earth";
import { NUMERICAL, TAU } from "./constraints/math";
import {
  AU,
  Days,
  Degrees,
  J2000CenturyTT,
  JulianDayTT,
  Radians,
} from "./constraints/types";
import { computeHourAngleAtRef } from "./transits";
import {
  addDaysToJD,
  latitudeToRad,
  longitudeToRadWest,
  subtractDaysFromJD,
  subtractJDs,
} from "./utilities/austomath";
import {
  altitude,
  azimuth,
  degreesToRadians,
  radiansToDegrees,
} from "./utilities/trigonometry";

/** ================== Type and Interface Definitions ================== */

/**
 * Represents the sun's position at a specific time and location.
 * @typedef {Object} PositionData
 * @property {Radians} azimuth - Azimuth angle in radians (clockwise from true north).
 * @property {Radians} altitude - Altitude angle in radians above horizon (includes refraction).
 */
export type PositionData = {
  azimuth: Radians;
  altitude: Radians;
};

/**
 * Represents the celestial coordinates of an object (e.g., moon or sun).
 */
export type CelestialCoordinates = {
  rightAscension: Radians;
  declination: Radians;
  distance: AU;
  eclipticLongitude?: Radians;
  eclipticLatitude?: Radians;
};

/**
 * Event detection configuration for altitude crossing search.
 * @interface EventWindow
 */
export interface EventWindow {
  start: JulianDayTT;
  end: JulianDayTT;
  evaluator: (time: JulianDayTT) => number;
  threshold: number;
  windowSize?: Days;
}

/** ================== Math Conversion Utilities ================== */

/** ================== Celestial Position Calculations ================== */

/**
 * Calculates observed celestial position with refraction.
 * @param {JulianDayTT} time - Julian day in TT.
 * @param {Degrees} latitude - Latitude in degrees.
 * @param {Degrees} longitude - Longitude in degrees.
 * @param {(jd: JulianDayTT) => CelestialCoordinates} coordFn - Coordinate function.
 * @returns {PositionData} Azimuth and altitude.
 */
export function calculateCelestialPosition(
  time: JulianDayTT,
  latitude: Degrees,
  longitude: Degrees,
  coordFn: (time: JulianDayTT) => CelestialCoordinates,
): PositionData {
  const longitudeRadWest: Radians = longitudeToRadWest(longitude);
  const latitudeRad: Radians = latitudeToRad(latitude);
  const coordinates = coordFn(time);
  const hourAngleRad: Radians = computeHourAngleAtRef(
    time,
    longitudeRadWest,
    coordinates.rightAscension,
  );
  const geometricAltitudeRad: Radians = altitude(
    hourAngleRad,
    latitudeRad,
    coordinates.declination,
  );
  return {
    azimuth: azimuth(hourAngleRad, latitudeRad, coordinates.declination),
    altitude: (geometricAltitudeRad +
      astroRefraction(geometricAltitudeRad)) as Radians,
  };
}

/**
 * Calculates the true obliquity of the ecliptic.
 * @param {J2000CenturyTT} time - Julian centuries since J2000.
 * @returns {Radians} Obliquity in radians.
 */
export function calculateTrueObliquity(T: J2000CenturyTT): Radians {
  return degreesToRadians(
    (EARTH.OBLIQUITY_J2000 + EARTH.OBLIQUITY_DRIFT.LINEAR_RATE * T) as Degrees,
  );
}

/**
 * Calculates right ascension from ecliptic coordinates.
 * @param eclipticLongitude (λ) - Ecliptic longitude in radians.
 * @param eclipticLatitude (β) - Ecliptic latitude in radians.
 * @param obliquity (ε) - Obliquity in radians.
 * @returns Right ascension in radians.
 */
export function getRightAscension(
  eclipticLongitude: Radians,
  eclipticLatitude: Radians,
  obliquity: Radians,
): Radians {
  const x =
    Math.sin(eclipticLongitude) * Math.cos(obliquity) -
    Math.tan(eclipticLatitude) * Math.sin(obliquity);
  const y = Math.cos(eclipticLongitude);
  const ra = Math.atan2(x, y);
  return ((ra < 0 ? ra + TAU : ra) % TAU) as Radians;
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param eclipticLongitude (λ) - Ecliptic longitude in radians.
 * @param eclipticLatitude (β) - Ecliptic latitude in radians.
 * @param obliquity (ε) - Obliquity in radians.
 * @returns Declination in radians.
 */
export function getDeclination(
  eclipticLongitude: Radians,
  eclipticLatitude: Radians,
  obliquity: Radians,
): Radians {
  return Math.asin(
    Math.sin(eclipticLatitude) * Math.cos(obliquity) +
      Math.cos(eclipticLatitude) *
        Math.sin(obliquity) *
        Math.sin(eclipticLongitude),
  ) as Radians;
}

/** ================== Atmospheric Refraction ================== */

/**
 * Applies Saemundsson's refraction model for altitude correction.
 * @param {Radians} geometricAltitude - Geometric altitude in radians.
 * @returns {Radians} Refraction adjustment in radians.
 */
export function astroRefraction(geometricAltitude: Radians): Radians {
  const minAltRad: Radians = degreesToRadians(
    REFRACTION.SAEMUNDSSON.MIN_ALTITUDE,
  );
  const clampedAltitude: Radians = Math.max(
    geometricAltitude,
    minAltRad,
  ) as Radians;
  const clampedAltitudeDeg: Degrees = radiansToDegrees(clampedAltitude);
  const altitudeAdjustmentDeg =
    REFRACTION.SAEMUNDSSON.ALTITUDE_OFFSET /
    (clampedAltitudeDeg + REFRACTION.SAEMUNDSSON.DENOMINATOR_OFFSET);
  const adjustedAltitudeDeg: Degrees = (clampedAltitudeDeg +
    altitudeAdjustmentDeg) as Degrees;
  const tanTerm = Math.tan(degreesToRadians(adjustedAltitudeDeg));
  return tanTerm !== 0
    ? degreesToRadians(
        (REFRACTION.SAEMUNDSSON.COEFFICIENT / tanTerm) as Degrees,
      )
    : (0 as Radians);
}

/** ================== Numerical Root-Finding Methods ================== */

/**
 * Generates candidate event times.
 * @param {JulianDayTT} start - Start in Julian days (TT).
 * @param {JulianDayTT} end - End in Julian days (TT).
 * @param {JulianDayTT} referenceJD - Anchor event JD.
 * @param {Days} eventIntervalDays - Period between events.
 * @param {Days} convergenceWindowDays - Refinement window.
 * @returns {JulianDayTT[]} Candidate JDs in TT.
 */
export function generateEventSeeds(
  start: JulianDayTT,
  end: JulianDayTT,
  referenceJD: JulianDayTT,
  eventIntervalDays: Days,
  convergenceWindowDays: Days,
): JulianDayTT[] {
  const seeds: JulianDayTT[] = [];

  // Compute the offset from referenceJD to start in days
  const startPhaseOffset: Days = subtractJDs(referenceJD, start);

  // Calculate how many intervals before referenceJD to cover startJD - convergenceWindowDays
  const seedCountBefore = Math.ceil(
    (((startPhaseOffset as number) + convergenceWindowDays) as number) /
      (eventIntervalDays as number),
  );

  // Compute initial jd by stepping back from referenceJD
  const initialOffset: Days = (seedCountBefore *
    eventIntervalDays) as number as Days;
  let jd: JulianDayTT = subtractDaysFromJD(referenceJD, initialOffset);

  // Define thresholds for the loop
  const endThreshold: JulianDayTT = addDaysToJD(end, convergenceWindowDays);
  const startThreshold: JulianDayTT = subtractDaysFromJD(
    start,
    convergenceWindowDays,
  );

  // Generate seeds within the range
  while (jd < endThreshold) {
    if (jd > startThreshold) {
      seeds.push(jd);
    }
    jd = addDaysToJD(jd, eventIntervalDays);
  }

  return seeds;
}

/** ================== Data Management Utilities ================== */

/**
 * Adds a JD to an array if unique within threshold.
 * @param {JulianDayTT[]} times - Array to modify.
 * @param {JulianDayTT} jd - Candidate JD in TT.
 * @param {Days} [eps] - Equality threshold in days.
 */
export function addUniqueJD(
  times: JulianDayTT[],
  time: JulianDayTT,
  eps: Days = NUMERICAL.EPSILON.EVENT_TIME_EQUALITY_DAYS as Days,
): void {
  if (!times.some((existing) => Math.abs(existing - time) < eps)) {
    times.push(time);
  }
}
