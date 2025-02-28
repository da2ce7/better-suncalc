/**
 * @file refinements/topocentric-event.ts
 * @spec For events needing refraction + geoid awareness (e.g., rise/set timing)
 */

import { TopocentricEventConfig } from "../constraints/refinements";
import { Days, Meters, Radians } from "../constraints/types";
import { applyRefraction } from "../ephemerides/terrestrial/refraction";
import { adjustElevationForGeoid } from "../math/geodesy/geopotential";
import { refineRoot } from "../math/root-finders/newton-raphson";

export function refineTopocentricEvent(
  initialEstimate: Days,
  elevationFunction: (time: Days) => Radians,
  targetElevation: Meters,
  config: TopocentricEventConfig,
): Days {
  const numericSeed = Number(initialEstimate);

  const evaluator = (t: number): number => {
    const trueElevRad = elevationFunction(t as Days);
    const refractedRad = applyRefraction(
      trueElevRad,
      config.refraction,
      config.observerElevation,
    );

    const elevationMsl = Number(
      adjustElevationForGeoid(
        computeGeometricHeight(refractedRad, config.observerElevation),
        config.geoid,
      ),
    );

    return elevationMsl - Number(targetElevation);
  };

  return refineRoot(numericSeed, evaluator, 0, config) as Days;
}

/** Convert angular elevation to geometric height above ellipsoid */
function computeGeometricHeight(
  elevationRad: Radians,
  observerHeight: Meters,
): Meters {
  return (Math.tan(Number(elevationRad)) * Number(observerHeight)) as Meters;
}
