// trigonometry

import { Degrees, Radians } from "../../constraints/types";

/**
 * Converts a value from degrees to radians.
 * @param degrees - The value in degrees.
 * @returns The equivalent value in radians.
 */
export function degreesToRadians(degrees: Degrees): Radians {
  return (degrees * (Math.PI / 180)) as Radians;
}

// Utilities
export function modulo360(degrees: Degrees): Degrees {
  return (((degrees % 360) + 360) % 360) as Degrees;
}

/**
 * Converts a value from radians to degrees.
 * @param radians - The value in radians.
 * @returns The equivalent value in degrees.
 */
export function radiansToDegrees(radians: Radians): Degrees {
  return (radians * (180 / Math.PI)) as Degrees;
}

/**
 * Calculates geometric altitude angle (no refraction).
 * @param {Radians} hourAngle - Hour angle in radians.
 * @param {Radians} latitude - Latitude in radians.
 * @param {Radians} declination - Declination in radians.
 * @returns {Radians} Altitude in radians.
 */
export function altitude(
  hourAngle: Radians,
  latitude: Radians,
  declination: Radians,
): Radians {
  return Math.asin(
    Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
  ) as Radians;
}

/**
 * Calculates azimuth angle for a celestial object.
 * @param {Radians} hourAngle - Hour angle in radians.
 * @param {Radians} latitude - Latitude in radians.
 * @param {Radians} declination - Declination in radians.
 * @returns {Radians} Azimuth in radians (0 at north, clockwise).
 */
export function azimuth(
  hourAngle: Radians,
  latitude: Radians,
  declination: Radians,
): Radians {
  return Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latitude) -
      Math.tan(declination) * Math.cos(latitude),
  ) as Radians;
}
