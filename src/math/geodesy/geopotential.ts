/**
 * @file utilities/geopotential.ts
 * @description Geopotential and geoid calculations using WGS84/EGM2008 models
 */

import { GEODETIC } from "../../constraints/constants/earth";
import { GeoidModel } from "../../constraints/refinements";
import type { Degrees, Meters, Radians } from "../../constraints/types";
import { degreesToRadians } from "../trigonometry/trigonometry";

/**
 * Low-degree spherical harmonic coefficients approximating EGM2008 geoid patterns.
 * @private
 */
const EGM2008_COEFFICIENTS = {
  "2_0": -3.0, // Degree 2, Order 0 (Oblateness)
  "2_2": { C: 1.5, S: 0.8 }, // Degree 2, Order 2 (Equatorial ellipticity)
  "3_1": { C: -0.7, S: 0.3 }, // Degree 3, Order 1 (Continental feature)
};

/**
 * Computes associated Legendre polynomial Pₙ(sinφ) for low-degree terms
 * @private
 * @param n - Spherical harmonic degree
 * @param m - Spherical harmonic order
 * @param sinφ - Sine of geocentric latitude
 * @returns Polynomial evaluation result
 */
function associatedLegendre(n: number, m: number, sinφ: number): number {
  switch (n) {
    case 2:
      if (m === 0) return (3 * sinφ ** 2 - 1) / 2;
      if (m === 2) return 3 * (1 - sinφ ** 2);
      break;
    case 3:
      if (m === 1) return ((5 * sinφ ** 3 - 3 * sinφ) * 3) / 2;
      break;
  }
  return 0;
}

/**
 * Computes EGM2008-style geoid undulation with spherical harmonics
 * @private
 * @param φ - Geodetic latitude in radians
 * @param λ - Longitude in radians
 * @returns Approximate geoid height relative to WGS84 ellipsoid (meters)
 */
function egm2008Undulation(φ: Radians, λ: Radians): Meters {
  const sinφ = Math.sin(φ);
  let N = 0;

  // Zonal term (symmetric about polar axis)
  N += EGM2008_COEFFICIENTS["2_0"] * associatedLegendre(2, 0, sinφ);

  // Tesseral terms (longitude-dependent)
  N +=
    associatedLegendre(2, 2, sinφ) *
    (EGM2008_COEFFICIENTS["2_2"].C * Math.cos(2 * λ) +
      EGM2008_COEFFICIENTS["2_2"].S * Math.sin(2 * λ));

  // Sectoral term
  N +=
    associatedLegendre(3, 1, sinφ) *
    (EGM2008_COEFFICIENTS["3_1"].C * Math.cos(λ) +
      EGM2008_COEFFICIENTS["3_1"].S * Math.sin(λ));

  return (N * 30) as Meters; // Scaled to approximate real magnitudes
}

/**
 * Calculates theoretical gravity at specified location (WGS84 closed-form)
 * @param latitude - Geodetic latitude in degrees
 * @param height - Height above ellipsoid in meters
 * @returns Gravity value in m/s²
 */
export function calculateGravity(latitude: Degrees, height: Meters): number {
  const φ = degreesToRadians(latitude);
  const h = Number(height);
  const sinφ = Math.sin(φ);

  const γ0 =
    (GEODETIC.WGS84.gravityEquator *
      (1 + GEODETIC.WGS84.gravityCoefficientKg * sinφ ** 2)) /
    Math.sqrt(1 - GEODETIC.WGS84.e2 * sinφ ** 2);

  return γ0 * (1 - (2 * h) / GEODETIC.WGS84.a);
}

/**
 * Converts geometric height to geopotential height (normalized)
 * @param geometricHeight - Height above ellipsoid in meters
 * @param latitude - Geodetic latitude in degrees
 * @returns Geopotential height normalized by equatorial gravity
 */
export function geometricToGeopotential(
  geometricHeight: Meters,
  latitude: Degrees,
): number {
  const γ0 = calculateGravity(latitude, 0 as Meters);
  const γh = calculateGravity(latitude, geometricHeight);
  return (
    ((γ0 + γh) / (2 * GEODETIC.WGS84.gravityEquator)) * Number(geometricHeight)
  );
}

/**
 * Computes geoid undulation relative to WGS84 ellipsoid
 * @param geoid - Configured geoid model parameters
 * @returns Height offset between geoid and ellipsoid (meters)
 */
export function geoidUndulation(geoid: GeoidModel): Meters {
  if (geoid.type === "WGS84") return 0 as Meters;

  return egm2008Undulation(
    degreesToRadians(geoid.latitude),
    degreesToRadians(geoid.longitude),
  );
}

/**
 * Converts geometric elevation to orthometric height (MSL)
 * @param observerHeight - Geometric height above ellipsoid
 * @param geoid - Configured geoid model parameters
 * @returns Height above mean sea level with geoid correction
 */
export function adjustElevationForGeoid(
  observerHeight: Meters,
  geoid: GeoidModel,
): Meters {
  const latitude = geoid.latitude; // Available for all geoid types
  const geoHeight = geometricToGeopotential(observerHeight, latitude);
  const deltaN = geoidUndulation(geoid);

  return (geoHeight + Number(deltaN)) as Meters;
}
