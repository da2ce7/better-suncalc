/**
 * @file refinements/celestial-event.ts
 * @specialized Newton-Raphson implementation for celestial event timing
 */

import { CelestialEventTimingConfig } from "../constraints/refinements";
import { Days, J2000CenturyTT, J2000DayTT } from "../constraints/types";
import { toCenturyTT } from "../math/austomath";
import { refineRoot } from "../math/root-finders/newton-raphson";

export function refineCelestialEventTiming(
  initialEstimate: J2000DayTT,
  eventFunction: (centuryTT: J2000CenturyTT) => Days,
  targetValue: Days,
  config: CelestialEventTimingConfig,
): J2000DayTT {
  // Convert all values to numeric representations for calculation
  const numericInitial = Number(initialEstimate);
  const numericTarget = Number(targetValue);

  // Create wrapped evaluator with proper unit conversions
  const wrappedEvaluator = (t: number): number => {
    const inputCentury = toCenturyTT(t as J2000DayTT);
    const rawResult = Number(eventFunction(inputCentury));
    return rawResult;
  };

  // Apply relativistic step constraints
  const effectiveStep = config.maxRelativisticStep
    ? Math.min(
        Number(config.differentiationStep),
        Number(config.maxRelativisticStep),
      )
    : Number(config.differentiationStep);

  // Convert search bounds if present
  const numericBounds = config.searchBounds?.map((b) => Number(b)) as
    | [number, number]
    | undefined;

  // Execute refined root finding
  const refinedResult = refineRoot(
    numericInitial,
    wrappedEvaluator,
    numericTarget,
    {
      ...config,
      // Need to cast runtime numbers back to branded types
      differentiationStep: effectiveStep,
      absoluteTolerance: Number(config.absoluteTolerance),
      searchBounds: numericBounds,
    },
  );

  // Final validation and unit re-integration
  if (
    config.ephemerisCutoff &&
    Math.abs(refinedResult) > Number(config.ephemerisCutoff)
  ) {
    throw new Error("Solution exceeds ephemeris validity range");
  }

  return refinedResult as J2000DayTT;
}
