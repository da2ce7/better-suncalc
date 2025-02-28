/**
 * @file constraints/refinements.ts
 * @description Newton-Raphson refinement policies for astronomical event calculations
 * @note Configuration parameters use astronomical units (days, Julian centuries, radians)
 *       tailored to specific event types. Conversions are managed via branded types.
 */

import { toCenturyTT } from "../utilities/austomath";
import type {
  Days,
  Degrees,
  J2000CenturyTT,
  J2000DayTT,
  Meters,
  Radians,
} from "./types";

// Base configuration interfaces -------------------------------------------------

/**
 * Base configuration for Newton-Raphson root-finding algorithms
 * @template InputType - Numerical type for algorithm inputs (time/angle)
 * @template OutputType - Numerical type for function outputs (position/phase)
 *
 * @property differentiationStep - Step size for numerical differentiation (input units)
 * @property absoluteTolerance - Convergence threshold in output units
 * @property maxIterations - Maximum number of iterations allowed
 * @property requireConvergence - Whether to throw error on non-convergence
 * @property searchBounds - Optional safety bounds for root search [lower, upper]
 */
export interface RefinementConfig<
  InputType extends number = number,
  OutputType extends number = number,
> {
  differentiationStep: InputType;
  absoluteTolerance: OutputType;
  maxIterations: number;
  requireConvergence: boolean;
  searchBounds?: [InputType, InputType];
}

/**
 * Celestial reference frame specification
 * @discriminated
 */
export type CelestialFrame =
  | {
      type: "ECLIPTIC";
      /**
       * Ecliptic frame version
       * @default "MEAN"
       */
      version?: "MEAN" | "TRUE";
    }
  | {
      type: "EQUATORIAL";
      /**
       * Reference pole definition
       * @default "CIP"
       */
      reference?: "CIP" | "CIO";
    };

/**
 * Configuration for angular position events (conjunctions, lunar phases)
 *
 * Solves for θ(t) = targetAngle where t is in days since J2000.0 TT
 */
export interface AngularEventConfig extends RefinementConfig<Days, Radians> {
  /** Coordinate reference frame for angular measurements */
  frame: CelestialFrame;

  /** Whether to account for light travel time */
  lightTimeCorrected: boolean;

  /** Angular step size for numerical differentiation */
  angularStep: Degrees;
}

/**
 * Enforces proper observer locations for each geoid model.
 * @discriminated
 */
export type GeoidModel =
  | {
      type: "WGS84";
      /** Latitude required for ellipsoid height adjustment */
      latitude: Degrees;
    }
  | {
      type: "EGM2008";
      /** Full geolocation needed for spherical harmonics */
      latitude: Degrees;
      longitude: Degrees;
      /** Height above reference ellipsoid */
      elevation?: Meters;
    };

/**
 * Atmospheric refraction model parameters
 * @discriminated
 */
export type RefractionModel =
  | {
      type: "none";
    }
  | {
      type: "saastamoinen";
      /**
       * Atmospheric conditions (default: standard parameters)
       * @default { temperature: 283, pressure: 1013.25 }
       */
      atmosphere?: {
        temperature: number; // Kelvin
        pressure: number; // hPa
      };
    }
  | {
      type: "radio";
      /** Wavelength of observation (meters) */
      wavelength: number;
    };

/**
 * Configuration for celestial timing events (solstices, equinoxes, eclipses)
 *
 * Solves for f(T) = targetValue where T represents Julian centuries (36525 days)
 * since J2000.0 in Terrestrial Time (TT)
 */
export interface CelestialEventTimingConfig
  extends RefinementConfig<J2000CenturyTT, Days> {
  /**
   * Maximum step size (centuries TT) when relativistic effects are significant
   * @default undefined (no special relativity handling)
   */
  maxRelativisticStep?: J2000CenturyTT;

  /**
   * Ephemeris calculation cutoff time
   * @default 1e-6 ≈ 52.6 minutes (0.036525 days)
   */
  ephemerisCutoff?: J2000CenturyTT;
}

/**
 * Configuration for observer-centric events (rise/set times, culminations)
 *
 * Uses elevation in meters (considering geoid model) for horizon calculations
 */
export interface TopocentricEventConfig extends RefinementConfig<Days, Meters> {
  /** Atmospheric refraction parameters */
  refraction: RefractionModel;

  /** Observer elevation above sea level */
  observerElevation: Meters;

  /** Geoid model for height calculations */
  geoid: GeoidModel;
}

// Preset configurations ---------------------------------------------------------

/** Common refinement presets for astronomical calculations */
export const REFINEMENT_PRESETS = {
  /**
   * Solstice/equinox determination with wide search bounds
   * - Convergence within ~1.3 seconds (1e-7 days)
   */
  SOLSTICE_DETERMINATION: {
    differentiationStep: toCenturyTT(0.01 as J2000DayTT),
    absoluteTolerance: 1e-7 as Days,
    maxIterations: 15,
    requireConvergence: true,
    searchBounds: [
      toCenturyTT(-0.5 as J2000DayTT),
      toCenturyTT(0.5 as J2000DayTT),
    ],
  } as CelestialEventTimingConfig,

  /**
   * High-precision lunar eclipse timing
   * - Converges within ~8 microseconds (1e-9 days)
   */
  LUNAR_ECLIPSE_TIMING: {
    differentiationStep: toCenturyTT(1e-6 as J2000DayTT),
    absoluteTolerance: 1e-9 as Days,
    maxIterations: 20,
    requireConvergence: true,
  } as CelestialEventTimingConfig,

  /**
   * Planetary conjunction analysis in ecliptic frame
   * - ~0.2 arcsecond tolerance (1e-6 radians)
   */
  CONJUNCTION_ANALYSIS: {
    differentiationStep: 0.1 as Days,
    angularStep: 0.002 as Degrees,
    absoluteTolerance: 1e-6 as Radians,
    maxIterations: 25,
    requireConvergence: true,
    frame: { type: "ECLIPTIC", version: "TRUE" },
    lightTimeCorrected: true,
  } as AngularEventConfig,

  /**
   * Sunrise/sunset calculation with standard refraction
   * - Converges within ≈1 cm elevation equivalence (~0.003° angular)
   */
  SUNRISE_SUNSET: {
    differentiationStep: 0.05 as Days,
    absoluteTolerance: 0.01 as Meters,
    maxIterations: 20,
    requireConvergence: true,
    refraction: { type: "saastamoinen" },
    observerElevation: 0 as Meters,
    geoid: { type: "WGS84", latitude: 0 as Degrees },
    searchBounds: [-0.5 as Days, 0.5 as Days],
  } as TopocentricEventConfig,
};
