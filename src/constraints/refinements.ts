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
  J2000CenturyDateTT,
  J2000DateTT,
  Kelvin,
  Meters,
  Radians,
  TerrestrialDays,
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
  InputType extends Brand<number, any> = J2000DateTT,
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
       * Ecliptic frame version
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
    };

/**
 * Configuration for angular convergence in astronomical events
 * @extends RefinementConfig<TerrestrialDays, Radians>
 */
export interface AngularEventConfig
  extends RefinementConfig<TerrestrialDays, Radians> {
  /** Coordinate system for angular measurements */
  frame: CelestialFrame;

  /** Light-time correction enabled */
  lightTimeCorrected: boolean;

  /** Angular differentiation step size */
  angularStep: Degrees;
}

/**
 * Geodetic models with strict unit requirements
 * @discriminated "type"
 */
export type GeoidModel =
  | {
      type: "WGS84";
      /** Reference ellipsoid latitude */
      latitude: Degrees;
    }
  | {
      type: "EGM2008";
      /** Full geodetic coordinates */
      latitude: Degrees;
      longitude: Degrees;
      /** Height above reference ellipsoid */
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
       * Atmospheric parameters
       * @defaultValue Generic mid-latitude conditions
       */
      atmosphere?: {
        /** Ambient air temperature */
        temperature: Kelvin;
        /** Barometric pressure */
        pressure: Hectopascal;
      };
    }
  | {
      type: "radio";
      /** Observation wavelength for ionospheric correction */
      wavelength: WavelengthMeters;
    };

/**
 * Configuration for high-precision celestial timing events
 * @extends RefinementConfig<J2000CenturyDateTT, TerrestrialDays>
 */
export interface CelestialEventTimingConfig
  extends RefinementConfig<J2000CenturyDateTT, TerrestrialDays> {
  /**
   * Relativistic step constraint (approximate DE440 limit: 1e-3 centuries)
   * @unit J2000CenturyDateTT
   */
  maxRelativisticStep?: J2000CenturyDateTT;

  /**
   * Ephemeris validity cutoff (empirical DE431 limit)
   * @unit J2000CenturyDateTT
   * @defaultValue 1e-6 ≈ 52.6 TT minutes
   */
  ephemerisCutoff?: J2000CenturyDateTT;
}

/**
 * Configuration for observer-centric event calculations
 * @extends RefinementConfig<TerrestrialDays, Meters>
 */
export interface TopocentricEventConfig
  extends RefinementConfig<TerrestrialDays, Meters> {
  /** Atmospheric refraction model */
  refraction: RefractionModel;

  /** Orthometric height above geoid */
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
    differentiationStep: 0.01 as J2000CenturyDateTT,
    absoluteTolerance: 1e-7 as TerrestrialDays,
    maxIterations: 15,
    requireConvergence: true,
    searchBounds: [-0.5 as J2000CenturyDateTT, 0.5 as J2000CenturyDateTT],
    maxRelativisticStep: 0.001 as J2000CenturyDateTT,
    ephemerisCutoff: 1e-6 as J2000CenturyDateTT,
  } as const satisfies CelestialEventTimingConfig,

  /**
   * High-precision lunar eclipse timing (Meeus algorithm Class 1)
   * - Photon arrival time tolerance: ~8 microseconds (1e-9 TT days)
   */
  LUNAR_ECLIPSE_TIMING: {
    differentiationStep: 1e-6 as J2000CenturyDateTT,
    absoluteTolerance: 1e-9 as TerrestrialDays,
    maxIterations: 20,
    requireConvergence: true,
    maxRelativisticStep: 5e-5 as J2000CenturyDateTT,
  } as const satisfies CelestialEventTimingConfig,

  /**
   * Planetary conjunction analysis (True Ecliptic frame)
   * - 0.2 arcsecond tolerance (1e-6 rad ≈ 0.057 degrees)
   */
  CONJUNCTION_ANALYSIS: {
    differentiationStep: 0.1 as TerrestrialDays,
    angularStep: 0.002 as Degrees,
    absoluteTolerance: 1e-6 as Radians,
    maxIterations: 25,
    requireConvergence: true,
    frame: { type: "ECLIPTIC", version: "TRUE" },
    lightTimeCorrected: true,
  } as const satisfies AngularEventConfig,

  /**
   * Sunrise/sunset calculator (WGS84 + Saastamoinen refraction)
   * - Elevation equivalence: 1 cm (~0.003° angular at horizon)
   */
  SUNRISE_SUNSET: {
    differentiationStep: 0.05 as TerrestrialDays,
    absoluteTolerance: 0.01 as Meters,
    maxIterations: 20,
    requireConvergence: true,
    refraction: { type: "saastamoinen" },
    observerElevation: 0 as Meters,
    geoid: { type: "WGS84", latitude: 0 as Degrees },
    searchBounds: [-0.5 as TerrestrialDays, 0.5 as TerrestrialDays],
  } as const satisfies TopocentricEventConfig,
} as const;
