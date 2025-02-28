/**
 * @file ephemerides/celestial/equatorial.ts
 * @description Equatorial coordinate system transformations
 */

import { TAU } from "../../constraints/math";
import { Radians_Ecliptic, Radians_Equatorial } from "../../constraints/types";

/**
 * Converts ecliptic coordinates to right ascension
 * @inheritdoc Original JSDoc from utils.ts
 */
export function eclipticToRightAscension(
  eclipticLongitude: Radians_Ecliptic,
  eclipticLatitude: Radians_Ecliptic,
  obliquity: Radians_Ecliptic,
): Radians_Equatorial {
  const x =
    Math.sin(eclipticLongitude) * Math.cos(obliquity) -
    Math.tan(eclipticLatitude) * Math.sin(obliquity);
  const y = Math.cos(eclipticLongitude);
  const ra = Math.atan2(x, y);
  return ((ra < 0 ? ra + TAU : ra) % TAU) as Radians_Equatorial;
}

/**
 * Calculates declination from ecliptic coordinates.
 * @param eclipticLongitude (λ) - Ecliptic longitude in radians.
 * @param eclipticLatitude (β) - Ecliptic latitude in radians.
 * @param obliquity (ε) - Obliquity in radians.
 * @returns Declination in radians.
 */
export function eclipticToDeclination(
  eclipticLongitude: Radians_Ecliptic,
  eclipticLatitude: Radians_Ecliptic,
  obliquity: Radians_Ecliptic,
): Radians_Equatorial {
  return Math.asin(
    Math.sin(eclipticLatitude) * Math.cos(obliquity) +
      Math.cos(eclipticLatitude) *
        Math.sin(obliquity) *
        Math.sin(eclipticLongitude),
  ) as Radians_Equatorial;
}
