/**
 * @file refinements/angular-event.ts
 * @specialized Newton-Raphson implementation for angular positioning events
 */

import { AngularEventConfig } from "../constraints/refinements";
import { Days, Radians } from "../constraints/types";
import { refineRoot } from "../utilities/findroot";

export function refineAngularEvent(
  initialEstimate: Days,
  angularPositionFn: (time: Days) => Radians,
  targetAngle: Radians,
  config: AngularEventConfig,
): Days {
  // Convert parameters to raw numbers while maintaining unit logic
  const numericSeed = Number(initialEstimate);
  const numericTarget = Number(targetAngle);

  // Create unit-aware evaluator wrapper
  const wrappedEvaluator = (t: number): number => {
    const currentTime = t as Days; // Number to branded type cast
    const rawAngle = Number(angularPositionFn(currentTime));
    return rawAngle; // Convert Radians to number
  };

  // Convert angular step to temporal step
  const numericDifferentiationStep = calculateDynamicStep(
    numericSeed,
    wrappedEvaluator,
    config,
  );

  // Anchor conversion computations
  const numericSearchBounds = config.searchBounds?.map((b) => Number(b)) as
    | [number, number]
    | undefined;

  // Execute root finding with angular-aware parameters
  const refinedTime = refineRoot(numericSeed, wrappedEvaluator, numericTarget, {
    ...config,
    differentiationStep: numericDifferentiationStep,
    absoluteTolerance: Number(config.absoluteTolerance),
    searchBounds: numericSearchBounds,
  });

  return refinedTime as Days;
}

// Core angular adaptation logic ---------------------------------------------

/** Convert angular step to time step based on function's local derivatives */
function calculateDynamicStep(
  t0: number,
  evaluator: (t: number) => number,
  config: AngularEventConfig,
): number {
  // Get reference angular step converted to radians
  const angularStepRadians = Number(config.angularStep) * (Math.PI / 180);

  // Initial finite difference calculation
  const temporalStepFallback = Number(config.differentiationStep);
  const [f0, f1] = [evaluator(t0), evaluator(t0 + temporalStepFallback)];

  // Basic derivative approximation for step scaling
  const localDerivative = (f1 - f0) / temporalStepFallback;

  // Prevent division by zero and maintain minimum step
  const lossyStep = angularStepRadians / (Math.abs(localDerivative) || 1e-6);

  return Math.min(Math.abs(lossyStep), temporalStepFallback);
}
