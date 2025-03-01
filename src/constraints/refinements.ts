/**
 * @file constraints/refinements.ts
 * @description Type-safe Newton-Raphson refinement policies for astronomical event calculations
 * @module RefinementPolicies
 * @see {@link ./brands} For unit branding definitions
 * @see {@link https://adsabs.harvard.edu/full/1989AJ.....97.1197K} Newton-Raphson applications in astronomy
 */

import {
  Degrees,
  Hectopascal,
  Kelvin,
  Meters,
  Radians,
  Radians_Equatorial,
  TerrestrialCenturiesSinceJ2000,
  TerrestrialDaysSinceJ2000,
  WavelengthMeters,
} from "./brands";
import { Brand } from "./types";

// Base configuration interfaces -------------------------------------------------

/**
 * Strictly-typed configuration for root-finding algorithms in astronomical contexts
 * @template InputType - Branded numerical type for algorithm inputs
 * @template OutputType - Branded numerical type for function outputs
 *
 * @property differentiationStep - Finite difference step size (input units)
 * @property absoluteTolerance - Convergence threshold (>= 1e-12 output units)
 * @property maxIterations - Safety ceiling for convergence (typically 10-100)
 * @property requireConvergence - Whether to throw on non-convergence
 * @property searchBounds - Optional input domain restrictions [lower, upper]
 */
export interface RefinementConfig<
  InputType extends Brand<number, any> = TerrestrialDaysSinceJ2000,
  OutputType extends Brand<number, any> = Radians,
> {
  differentiationStep: InputType;
  absoluteTolerance: OutputType;
  maxIterations: number;
  requireConvergence: boolean;
  searchBounds?: readonly [InputType, InputType];
}

/**
 * Celestial reference frame specification with strict brand alignment
 * @discriminated "type"
 */
export type CelestialFrame =
  | {
      type: "ECLIPTIC";
      /**
       * Ecliptic frame version (affects maximum angular deviation <0.1 arcsec)
       * @defaultValue "MEAN" (without nutation)
       */
      version?: "MEAN" | "TRUE";
    }
  | {
      type: "EQUATORIAL";
      /**
       * Celestial Intermediate Reference System specifier
       * @defaultValue "CIP" (Celestial Intermediate Pole)
       */
      reference?: "CIP" | "CIO";
      orientation: Radians_Equatorial;
    };

/**
 * Configuration for angular convergence in astronomical events
 * @extends RefinementConfig<TerrestrialDaysSinceJ2000, Radians>
 */
export interface AngularEventConfig
  extends RefinementConfig<TerrestrialDaysSinceJ2000, Radians> {
  /** Coordinate system for angular measurements */
  frame: CelestialFrame;

  /** Light-time correction (≪1 day effects for solar system bodies) */
  lightTimeCorrected: boolean;

  /** Angular differentiation step (machine precision vs numerical stability) */
  angularStep: Degrees;
}

/**
 * Geodetic models with strict unit requirements
 * @discriminated "type"
 */
export type GeoidModel =
  | ({
      type: "WGS84";
      /** Reference ellipsoid latitude (±90° range) */
      latitude: Degrees;
    } & { tectonicMotionCorrection?: Meters })
  | {
      type: "EGM2008";
      /** Full geodetic coordinates */
      latitude: Degrees;
      longitude: Degrees;
      /** Height above reference ellipsoid (orthometric height) */
      elevation?: Meters;
    };

/**
 * Atmospheric refraction models with physical units
 * @discriminated "type"
 */
export type RefractionModel =
  | {
      type: "none";
    }
  | {
      type: "saastamoinen";
      /**
       * Atmospheric parameters (±5m elevation accuracy)
       * @defaultValue Generic mid-latitude conditions
       */
      atmosphere?: {
        /** Ambient air temperature (affects air density) */
        temperature: Kelvin;
        /** Barometric pressure (station pressure, not MSL) */
        pressure: Hectopascal;
      };
    }
  | {
      type: "radio";
      /** Observation wavelength for ionospheric correction (10cm-1km range) */
      wavelength: WavelengthMeters;
      /** Tropospheric wet delay correction */
      troposphereModel?: "UNB3M" | "GPT3";
    };

/**
 * Configuration for high-precision celestial timing events
 * @extends RefinementConfig<TerrestrialCenturiesSinceJ2000, TerrestrialDaysSinceJ2000>
 */
export interface CelestialEventTimingConfig
  extends RefinementConfig<
    TerrestrialCenturiesSinceJ2000,
    TerrestrialDaysSinceJ2000
  > {
  /**
   * Relativistic step constraint (approximate DE440 limit)
   * @unit TerrestrialCenturiesSinceJ2000
   */
  maxRelativisticStep?: TerrestrialCenturiesSinceJ2000;

  /**
   * Ephemeris validity cutoff (empirical DE431 limit)
   * @unit TerrestrialCenturiesSinceJ2000
   * @defaultValue 1e-6 ≈ 52.6 TT minutes
   */
  ephemerisCutoff?: TerrestrialCenturiesSinceJ2000;
}

/**
 * Configuration for observer-centric event calculations
 * @extends RefinementConfig<TerrestrialDaysSinceJ2000, Meters>
 */
export interface TopocentricEventConfig
  extends RefinementConfig<TerrestrialDaysSinceJ2000, Meters> {
  /** Atmospheric refraction model */
  refraction: RefractionModel;

  /** Orthometric height above geoid (ellipsoid separation <±100m) */
  observerElevation: Meters;

  /** Geopotential model definition */
  geoid: GeoidModel;
}

// Preset configurations ---------------------------------------------------------

/** Verified refinement presets for common astronomical use cases */
export const REFINEMENT_PRESETS = {
  /**
   * Solstice/equinox calculation profile (Chapront-Touze precision)
   * - Input: J2000-century dates since epoch
   * - Precision goal: 1.3 seconds (~1e-7 TT days)
   */
  SOLSTICE_DETERMINATION: {
    differentiationStep: 0.01 as TerrestrialCenturiesSinceJ2000,
    absoluteTolerance: 1e-7 as TerrestrialDaysSinceJ2000,
    maxIterations: 15,
    requireConvergence: true,
    searchBounds: [
      -0.5 as TerrestrialCenturiesSinceJ2000,
      0.5 as TerrestrialCenturiesSinceJ2000,
    ],
    maxRelativisticStep: 0.001 as TerrestrialCenturiesSinceJ2000,
    ephemerisCutoff: 1e-6 as TerrestrialCenturiesSinceJ2000,
  } as const satisfies CelestialEventTimingConfig,

  /**
   * High-precision lunar eclipse timing (Meeus algorithm Class 1)
   * - Photon arrival time tolerance: ~8 microseconds (1e-9 TT days)
   */
  LUNAR_ECLIPSE_TIMING: {
    differentiationStep: 1e-6 as TerrestrialCenturiesSinceJ2000,
    absoluteTolerance: 1e-9 as TerrestrialDaysSinceJ2000,
    maxIterations: 20,
    requireConvergence: true,
    maxRelativisticStep: 5e-5 as TerrestrialCenturiesSinceJ2000,
  } as const satisfies CelestialEventTimingConfig,

  /**
   * Planetary conjunction analysis (True Ecliptic frame)
   * - 0.2 arcsecond tolerance (1e-6 rad ≈ 0.057 degrees)
   */
  CONJUNCTION_ANALYSIS: {
    differentiationStep: 0.1 as TerrestrialDaysSinceJ2000,
    angularStep: 0.002 as Degrees,
    absoluteTolerance: 1e-6 as Radians,
    maxIterations: 25,
    requireConvergence: true,
    frame: {
      type: "ECLIPTIC",
      version: "TRUE",
    },
    lightTimeCorrected: true,
  } as const satisfies AngularEventConfig,

  /**
   * Sunrise/sunset calculator (WGS84 + Saastamoinen refraction)
   * - Elevation equivalence: 1 cm (~0.003° angular at horizon)
   */
  SUNRISE_SUNSET: {
    differentiationStep: 0.05 as TerrestrialDaysSinceJ2000,
    absoluteTolerance: 0.01 as Meters,
    maxIterations: 20,
    requireConvergence: true,
    refraction: {
      type: "saastamoinen",
      atmosphere: {
        temperature: 288 as Kelvin,
        pressure: 1013.25 as Hectopascal,
      },
    },
    observerElevation: 0 as Meters,
    geoid: {
      type: "WGS84",
      latitude: 0 as Degrees,
      tectonicMotionCorrection: 0 as Meters,
    },
    searchBounds: [
      -0.5 as TerrestrialDaysSinceJ2000,
      0.5 as TerrestrialDaysSinceJ2000,
    ],
  } as const satisfies TopocentricEventConfig,
} as const;
