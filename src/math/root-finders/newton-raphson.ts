/**
 * @file utilities/findroot.ts
 * @description Newton-Raphson root finding with astronomical refinement policies
 */

import { RefinementConfig } from "../../constraints/refinements";

/**
 * Compute numerical derivative with safety checks
 * @param fn - Function to differentiate
 * @param t - Evaluation point
 * @param differentiationStep - Step size from refinement config
 * @param floatingPointEpsilon - Machine epsilon for significance checks
 * @returns Derivative value at t
 */
export function computeDerivative(
  fn: (t: number) => number,
  t: number,
  differentiationStep: number,
  floatingPointEpsilon: number = Number.EPSILON,
): number {
  if (Math.abs(differentiationStep) < floatingPointEpsilon) {
    throw new Error(`Derivative step too small: ${differentiationStep}`);
  }

  const [f_plus, f_minus] = [
    fn(t + differentiationStep),
    fn(t - differentiationStep),
  ];
  const absDiff = Math.abs(f_plus - f_minus);

  // Combine absolute and relative significance thresholds
  const significant =
    absDiff >
    floatingPointEpsilon * (1 + 0.5 * (Math.abs(f_plus) + Math.abs(f_minus)));

  return significant ? (f_plus - f_minus) / (2 * differentiationStep) : 0;
}

/**
 * Refine root estimate using Newton-Raphson with configurable policies
 * @param seed - Initial guess value
 * @param evaluator - Function to find root of (f(t) - target = 0)
 * @param target - Target value for root finding (f(t) = target)
 * @param config - Refinement policy parameters
 * @returns Best estimate of root within configuration constraints
 */
export function refineRoot(
  seed: number,
  evaluator: (t: number) => number,
  target: number,
  config: RefinementConfig = {
    differentiationStep: 1e-4,
    absoluteTolerance: 1e-6,
    maxIterations: 50,
    requireConvergence: true,
  },
): number {
  const {
    differentiationStep,
    absoluteTolerance,
    maxIterations,
    requireConvergence,
    searchBounds,
  } = config;

  const fpEpsilon = Math.max(Number.EPSILON, absoluteTolerance / 1000);
  let t = clampToSearchBounds(seed, searchBounds);
  let f = evaluator(t) - target;
  let previousStep = Infinity;

  for (let iter = 0; iter < maxIterations; iter++) {
    const df = computeDerivative(evaluator, t, differentiationStep, fpEpsilon);

    // Handle near-zero derivative (prevents division explosions)
    if (Math.abs(df) < fpEpsilon) {
      if (requireConvergence)
        throw new Error(`Zero derivative at iter ${iter}`);
      break;
    }

    const rawStep = f / df;
    const boundedStep = applyStepConstraints(rawStep, t, previousStep, config);

    // Early exit for stagnation or under-tolerance steps
    if (Math.abs(boundedStep) <= fpEpsilon && Math.abs(f) <= absoluteTolerance)
      break;

    t = clampToSearchBounds(t - boundedStep, searchBounds);
    previousStep = boundedStep;
    f = evaluator(t) - target;

    // Dual convergence check: function value and step size
    if (Math.abs(f) <= absoluteTolerance && Math.abs(boundedStep) <= fpEpsilon)
      break;
  }

  if (requireConvergence && Math.abs(f) > absoluteTolerance) {
    throw new Error(`Failed convergence after ${maxIterations} iterations`);
  }

  return t;
}

/** Apply step size constraints */
function applyStepConstraints(
  rawStep: number,
  currentT: number,
  previousStep: number,
  config: RefinementConfig,
): number {
  const { absoluteTolerance, searchBounds } = config;
  const maxMovement = searchBounds
    ? 0.5 * (searchBounds[1] - searchBounds[0])
    : Infinity;

  // Dynamically limit step size changes
  const clampedStep =
    Math.sign(rawStep) *
    Math.min(
      Math.abs(rawStep),
      Math.abs(previousStep) * 2, // Prevent oscillation growth
      maxMovement,
      currentT * 0.1 || absoluteTolerance * 1000, // Relative/absolute limits
    );

  return clampedStep;
}

/** Restrict value to search bounds if defined */
function clampToSearchBounds(value: number, bounds?: [number, number]): number {
  if (!bounds) return value;
  return Math.min(Math.max(value, bounds[0]), bounds[1]);
}
