/**
 * @file utilities/refraction.ts
 * @description Atmospheric refraction models for precise topocentric calculations
 */

import { REFRACTION } from "../../constraints/constants/earth";
import { RefractionModel } from "../../constraints/refinements";
import type { Degrees, Meters, Radians } from "../../constraints/types";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../math/trigonometry/trigonometry";

/**
 * Calculate apparent elevation due to atmospheric refraction
 * @param trueElevation - Geometric elevation (radians)
 * @param model - Selected refraction model
 * @param observerElevation - Height above sea level (meters)
 * @returns Apparent elevation in radians
 */
export function applyRefraction(
  trueElevation: Radians,
  model: RefractionModel,
  observerElevation: Meters,
): Radians {
  const elevDeg = radiansToDegrees(trueElevation);
  let refraction = 0;

  switch (model.type) {
    case "saastamoinen": {
      const heightMeters = Number(observerElevation);
      let P: number, T: number;

      if (model.atmosphere) {
        P = model.atmosphere.pressure;
        T = model.atmosphere.temperature;
      } else {
        P = 1013.25 * Math.exp(-0.000116 * heightMeters);
        T = 15 - 0.0065 * heightMeters;
      }
      refraction = saastamoinenRefraction(elevDeg, P, T);
      break;
    }

    case "radio":
      refraction = radioRefraction(elevDeg, model.wavelength);
      break;

    case "none":
    default:
      return trueElevation;
  }

  const apparentElevDeg = (elevDeg + refraction / 3600) as Degrees;
  return degreesToRadians(apparentElevDeg);
}

/** Saastamoinen (1972) model for optical wavelengths */
function saastamoinenRefraction(
  elevDeg: Degrees,
  pressure: number, // Required parameters from model
  tempCelsius: number,
): number {
  const tanElev = Math.tan(degreesToRadians(elevDeg));
  return ((16.269 / tanElev) * (pressure / 1013.25)) / (tempCelsius + 273.15);
}

/** ITU Radio Refraction Model (Recommendation ITU-R P.834-8) */
function radioRefraction(elevDeg: Degrees, wavelengthM: number): number {
  const Ns = 320;
  const k1 = 0.1564;
  const k2 = 0.00035;
  return (
    (k1 + k2 * Ns) *
    Math.pow(wavelengthM, -0.0003) *
    Math.pow(Math.cos(degreesToRadians(elevDeg)), 1.3)
  );
}

/**
 * Applies Saemundsson's refraction model for altitude correction.
 * @param {Radians} geometricAltitude - Geometric altitude in radians.
 * @returns {Radians} Refraction adjustment in radians.
 */
export function applyStandardRefraction(geometricAltitude: Radians): Radians {
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
