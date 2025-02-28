import { EARTH } from "../../constraints/constants/earth";
import { TAU } from "../../constraints/math";
import {
  AstronomicalUnits,
  Degrees,
  J2000CenturyTT,
  JulianDayTT,
  Radians,
} from "../../constraints/types";
import { applyStandardRefraction } from "../../ephemerides/terrestrial/refraction";
import {
  angularDisplacementAstro,
  latitudeToRad,
  longitudeToRadWest,
  toDaysTT,
  toDegreesPerDayTT,
} from "../../math/austomath";
import { altitude, azimuth } from "../../math/trigonometry/trigonometry";
import { computeHourAngleAtRef } from "./transits";

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
  distance: AstronomicalUnits;
  eclipticLongitude?: Radians;
  eclipticLatitude?: Radians;
};

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
      applyStandardRefraction(geometricAltitudeRad)) as Radians,
  };
}

/**
 * Calculates the true obliquity of the ecliptic.
 * @param {J2000CenturyTT} time - Julian centuries since J2000.
 * @returns {Radians} Obliquity in radians.
 */
export function calculateTrueObliquity(T: J2000CenturyTT): Radians {
  return angularDisplacementAstro(
    EARTH.OBLIQUITY_J2000,
    toDegreesPerDayTT(EARTH.OBLIQUITY_DRIFT.LINEAR_RATE),
    toDaysTT(T),
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
