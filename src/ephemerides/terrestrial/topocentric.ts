/**
 * @file ephemerides/terrestrial/topocentric.ts
 * @description Topocentric position calculations for Earth-based observers
 */

import { Degrees, JulianDayTT } from "../../constraints/types";
import {
  CelestialCoordinates,
  PositionData,
} from "../../events/celestial/position";
import { computeHourAngleAtRef } from "../../events/celestial/transits";
import { latitudeToRad, longitudeToRadWest } from "../../math/austomath";
import { altitude, azimuth } from "../../math/trigonometry/trigonometry";
import { applyStandardRefraction } from "./refraction";

/**
 * Calculates observed celestial position with refraction.
 * @param {JulianDayTT} time - Julian day in TT.
 * @param {Degrees} latitude - Latitude in degrees.
 * @param {Degrees} longitude - Longitude in degrees.
 * @param {(jd: JulianDayTT) => CelestialCoordinates} coordFn - Coordinate function.
 * @returns {PositionData} Azimuth and altitude.
 */
export function calculateTopocentricPosition(
  time: JulianDayTT,
  latitude: Degrees,
  longitude: Degrees,
  coordinatesFn: (time: JulianDayTT) => CelestialCoordinates,
): PositionData {
  const longitudeWest = longitudeToRadWest(longitude);
  const latitudeRad = latitudeToRad(latitude);
  const coords = coordinatesFn(time);

  const hourAngle = computeHourAngleAtRef(
    time,
    longitudeWest,
    coords.rightAscension,
  );
  const geoAltitude = altitude(hourAngle, latitudeRad, coords.declination);

  return {
    azimuth: azimuth(hourAngle, latitudeRad, coords.declination),
    altitude: applyStandardRefraction(geoAltitude),
  };
}
