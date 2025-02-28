/**
 * @file utilities/astromath.ts
 * @description Astronomical calculation utilities for coordinate conversions, orbital mechanics, and temporal transformations
 */

import {
  AstronomicalUnits,
  Degrees,
  DegreesPerDayTT,
  J2000CenturyDateTT,
  J2000DateTT,
  JulianDateTT,
  Meters,
  Radians,
} from "../constraints/brands";
import {
  DAYS_PER_JULIAN_CENTURY,
  JULIAN_EPOCH_J2000,
  TIME_UNITS,
} from "../constraints/constants/time";
import { TAU } from "../constraints/math";
import { degreesToRadians, modulo360 } from "./trigonometry/trigonometry";

/**
 * Core angular displacement calculation in degrees (preserves units)
 * @param initialAngle - Initial angle in degrees
 * @param angularVelocity - Angular velocity in degrees per TT day
 * @param time - Elapsed time since J2000 in TT days
 * @param normalize - Whether to normalize result to [0°,360°)
 * @returns New angular position in degrees (absolute value)
 */
function angularDisplacementAstroDegrees(
  initialAngle: Degrees,
  angularVelocity: DegreesPerDayTT,
  time: J2000DateTT,
  normalize: boolean,
): Degrees {
  const rawValue = (initialAngle + angularVelocity * time) as Degrees;
  return normalize ? modulo360(rawValue) : rawValue;
}

/**
 * Calculates angular displacement with optional normalization (radians output)
 * @param initialAngle - Initial angle in degrees
 * @param angularVelocity - Angular velocity in degrees per TT day
 * @param time - Elapsed time since J2000 in TT days
 * @param normalize - Normalize to [0,2π] range (default: true)
 * @returns Angular position in radians
 */
export function angularDisplacementAstro(
  initialAngle: Degrees,
  angularVelocity: DegreesPerDayTT,
  time: J2000DateTT,
  normalize: boolean = true,
): Radians {
  return degreesToRadians(
    angularDisplacementAstroDegrees(
      initialAngle,
      angularVelocity,
      time,
      normalize,
    ),
  );
}

/**
 * Calculates angular displacement with native radians handling
 * @param initialAngle - Initial angle in radians
 * @param angularVelocity - Angular velocity in radians per TT day
 * @param time - Elapsed time since J2000 in TT days
 * @param normalize - Apply normalization (default: true)
 * @param phaseWrap - Use [-π,π] wrapping instead of [0,2π]
 * @returns Angular position in radians
 */
export function angularDisplacementRadians(
  initialAngle: Radians,
  angularVelocity: Radians,
  time: J2000DateTT,
  normalize: boolean = true,
  phaseWrap: boolean = false,
): Radians {
  const raw = initialAngle + angularVelocity * time;

  if (!normalize) return raw as Radians;
  return phaseWrap
    ? (((((raw % TAU) + TAU * 1.5) % TAU) - TAU / 2) as Radians) // [-π, π)
    : ((((raw % TAU) + TAU) % TAU) as Radians); // [0, 2π)
}

/**
 * Converts elevation angle to vertical displacement at given observer height
 * @param elevationAngle - Angle between observer and target in radians
 * @param observerHeight - Observer's height above reference plane in meters
 * @returns Vertical displacement from observer to target in meters
 */
export function angularElevationToDisplacement(
  elevationAngle: Radians,
  observerHeight: Meters,
): Meters {
  return (Math.tan(elevationAngle) * observerHeight) as Meters;
}

/**
 * Converts vertical displacement to elevation angle
 * @param verticalDisplacement - Vertical distance from observer to target in meters
 * @param observerHeight - Observer's height above reference plane in meters
 * @returns Elevation angle in radians between observer and target
 */
export function displacementToAngularElevation(
  verticalDisplacement: Meters,
  observerHeight: Meters,
): Radians {
  return Math.atan(verticalDisplacement / observerHeight) as Radians;
}

// ================== Time Conversion Utilities ================== //

/**
 * Convert J2000 days (TT) to Julian Centuries (TT) since J2000 epoch
 * @param time - Days since J2000.0 TT
 * @returns Julian centuries since J2000 epoch (TT)
 */
export const toCenturyTT = (time: J2000DateTT): J2000CenturyDateTT =>
  (time / TIME_UNITS.DAYS.CENTURY) as J2000CenturyDateTT;

/**
 * Convert Julian Centuries (TT) since J2000 to J2000 days (TT)
 * @param time - Julian centuries since J2000 epoch (TT)
 * @returns Days since J2000.0 TT
 */
export const toDaysTT = (time: J2000CenturyDateTT): J2000DateTT =>
  (time * TIME_UNITS.DAYS.CENTURY) as J2000DateTT;

/**
 * Convert Julian Day in TT to days since J2000 epoch
 * @param time - Julian Day in Terrestrial Time
 * @returns Days since J2000.0 TT
 */
export function julianDayToJ2000Day(time: JulianDateTT): J2000DateTT {
  return (time - JULIAN_EPOCH_J2000) as J2000DateTT;
}

/**
 * Convert days since J2000 epoch to Julian Day in TT
 * @param time - Days since J2000.0 TT
 * @returns Julian Day in Terrestrial Time
 */
export function j2000DayToJulianDay(time: J2000DateTT): JulianDateTT {
  return (time + JULIAN_EPOCH_J2000) as JulianDateTT;
}

/**
 * Calculate Julian Centuries (TT) since J2000 epoch from Julian Date
 * @param time - Julian Date in Terrestrial Time
 * @returns Centuries since J2000 epoch (J2000CenturyDateTT)
 */
export function getJulianCenturiesSinceJ2000(
  time: JulianDateTT,
): J2000CenturyDateTT {
  return ((time - JULIAN_EPOCH_J2000) /
    DAYS_PER_JULIAN_CENTURY) as J2000CenturyDateTT;
}

// ================== Astronomical Calculations ================== //

/**
 * Calculates ecliptic longitude with evection correction
 * @param meanLongitude - Mean geocentric longitude in radians
 * @param meanAnomaly - Mean anomaly of orbit in radians
 * @param evectionAmplitude - Amplitude of evection effect in degrees
 * @returns Corrected ecliptic longitude in radians
 */
export function eclipticLongitudeWithEvection(
  meanLongitude: Radians,
  meanAnomaly: Radians,
  evectionAmplitude: Degrees,
): Radians {
  const amplitudeRadians = degreesToRadians(evectionAmplitude);
  return (meanLongitude + amplitudeRadians * Math.sin(meanAnomaly)) as Radians;
}

/**
 * Calculates ecliptic latitude from orbital inclination and argument of latitude
 * @param inclination - Orbital inclination in degrees
 * @param meanArgLatitude - Argument of latitude (ω + M) in radians
 * @returns Ecliptic latitude in radians
 */
export function eclipticLatitudeFromInclination(
  inclination: Degrees,
  meanArgLatitude: Radians,
): Radians {
  return (degreesToRadians(inclination) * Math.sin(meanArgLatitude)) as Radians;
}

/**
 * Elliptical orbit distance approximation using 2nd-order expansion
 * @param semiMajorAxis - Orbit semi-major axis in AU
 * @param eccentricity - Orbital eccentricity (0 ≤ e < 1)
 * @param meanAnomaly - Mean anomaly in radians
 * @returns Approximate distance in Astronomical Units
 */
export function ellipticalDistance(
  semiMajorAxis: AstronomicalUnits,
  eccentricity: number,
  meanAnomaly: Radians,
): AstronomicalUnits {
  const e = eccentricity;
  const M = meanAnomaly;
  const cosM = Math.cos(M);
  const cos2M = Math.cos(2 * M);

  return (semiMajorAxis *
    (1.0 -
      (3 / 4) * e ** 2 +
      e * cosM +
      (3 / 2) * e ** 2 * cos2M)) as AstronomicalUnits;
}

// ================== Coordinate Conversions ================== //

/**
 * Calculates right ascension from ecliptic coordinates
 * @param eclipticLongitude - λ in radians
 * @param eclipticLatitude - β in radians
 * @param obliquity - ε (ecliptic obliquity) in radians
 * @returns Right ascension in radians [0, 2π)
 */
export function getRightAscension(
  eclipticLongitude: Radians,
  eclipticLatitude: Radians,
  obliquity: Radians,
): Radians {
  const y = Math.cos(eclipticLongitude);
  const x =
    Math.sin(eclipticLongitude) * Math.cos(obliquity) -
    Math.tan(eclipticLatitude) * Math.sin(obliquity);
  return ((Math.atan2(x / Math.hypot(x, y), y / Math.hypot(x, y)) + TAU) %
    TAU) as Radians;
}
