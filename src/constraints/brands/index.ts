/**
 * @file constraints/brands/index.ts
 *
 * @naming_schema Type Naming Convention Specification
 *
 * ## Naming Schema Architecture
 *
 * 1. **Core Pattern**
 *    `[Quantity][Unit]_[Context]_[TimeScale|Frame]`
 *
 *    - Ordered by specificity: Base unit → Spatial context → Temporal context
 *    - Underscore-delimited segments for machine readability
 *
 * 2. **Component Definitions**
 *    - **Quantity/Unit**: Primary measurement (Degrees, Parsecs, Kelvin)
 *    - **Context**:
 *      - Spatial: Reference frame (Equatorial, Galactic, ICRF)
 *      - Instrumentation: Observation context (Observed, FocalPlane)
 *      - Physical: State context (CMB, ZeroAgeMainSequence)
 *    - **TimeScale**: Chronological binding (TT, TAI, B1950, J2000)
 *
 * 3. **Chronological Significance**
 *    - Time scales always suffix: `_TT`, `_TAI`, `_UTC`
 *    - Epoch formats:
 *      - Modern epochs: `_J2000`, `_B1950`
 *      - Custom epochs: `_Epoch2023`
 *
 * 4. **Spatial Context Rules**
 *    - Reference frames: `_ICRF`, `_Galactic`, `_Horizontal`
 *    - Coordinate types: `_Geocentric`, `_Topocentric`
 *
 * 5. **Measurement Specificity**
 *    - Precision markers: `_Mean`, `_Observed`, `_Theoretical`
 *    - Evolutionary stages: `_PreMainSequence`, `_PostAGB`
 *
 * 6. **Compound Units**
 *    - Rate denominators: `PerYear`, `PerSecondSquared`
 *    - Ratios: `PerParsecCubed`, `PerElectronVolt`
 *
 * ## Standard Patterns
 *
 * ```typescript
 * // Angular Measurements
 * type Degrees_Equatorial_J2000 = number & { _frame: 'Equatorial J2000' };
 *
 * // Temporal Quantities
 * type SecondsDuration_TT = number & { _timescale: 'Terrestrial Time' };
 *
 * // Coordinate-bound Distances
 * type Parsecs_ICRF = number & { _frame: 'International Celestial Reference Frame' };
 *
 * // Contextual Physical Values
 * type Kelvin_CMB = number & { _context: 'Cosmic Microwave Background' };
 *
 * // Epoch-bound Rates
 * type ArcsecondsPerYear_B1950 = number & { _epoch: 'Besselian 1950' };
 * ```
 *
 * ## Migration Strategy
 *
 * 1. **Legacy → New Format**
 *    - `TT_SecondsDuration` → `SecondsDuration_TT`
 *    - `DegreesPerDayTT` → `DegreesPerDay_TT`
 *    - `GCRS_Gravity` → `MetersPerSecondSquared_GCRS`
 *
 * 2. **Context Promotion**
 *    - Move instrumentation context from prefix to suffix:
 *      `FocalPlaneCoordinates` → `Coordinates_FocalPlane`
 *
 * ## Validation Rules
 * 1. No standalone unit types without context/time binding
 * 2. Compound units must explicitly declare time denominators
 * 3. Epoch declarations require year specification (J2000, B1950)
 *
 * @rationale Enhances type discovery through predictable patterns while maintaining
 * backward-compatible astronomical semantics. Enables static analysis of dimensional
 * compatibility through structured naming.
 *
 * @tooling_benefit Enables:
 * - Grep-based type searches (`*_TT`)
 * - IDE auto-completion hierarchies
 * - Automated compatibility checking
 *
 * @see {@link https://www.iau.org/public/themes/measuring/ | IAU Measurement Standards}
 */

export type FrameBrand<T, U extends string> = T & {
  readonly _frame: U;
  /** @deprecated Use _frame for new types */
  readonly __brand?: never;
};

// Temporal Scale Branding
export type TimescaleBrand<T, U extends string> = T & {
  readonly _timescale: U;
  /** @deprecated Use _timescale for new types */
  readonly __brand?: never;
};

// Epoch Branding
export type EpochBrand<T, U extends string> = T & {
  readonly _epoch: U;
  /** @deprecated Use _epoch for new types */
  readonly __brand?: never;
};

// Physical Context Branding
export type ContextBrand<T, U extends string> = T & {
  readonly _context: U;
  /** @deprecated Use _context for new types */
  readonly __brand?: never;
};

// Rate Type Branding
export type RateBrand<T, U extends string> = T & {
  readonly _rate: U;
  /** @deprecated Use _rate for new types */
  readonly __brand?: never;
};

// enable dynamic updating of expanded exports using the `tools/expand-exports.ts` script.
const expand_exports: string[] = [
  "./angles",
  "./angular-rates",
  "./coordinates",
  "./dimensionless",
  "./distances",
  "./dynamics/environmental",
  "./dynamics/fluxes",
  "./dynamics/mass-energy",
  "./dynamics/specialized",
  "./dynamics/velocity",
  "./lunar",
  "./physical",
  "./relativity",
  "./temporal/dates",
  "./temporal/durations",
  "./temporal/epochs",
];

/**
 * Angular Measurements and Rates
 * Types for angles and their rates of change, often tied to specific coordinate systems or time scales.
 */
export {
  Arcminutes,
  Arcseconds,
  Degrees,
  Degrees_Altitude,
  Degrees_Azimuth,
  Degrees_Ecliptic,
  Degrees_Equatorial,
  Degrees_Galactic,
  Degrees_Horizontal,
  Degrees_Parallactic,
  Radians,
  Radians_Altitude,
  Radians_Azimuth,
  Radians_Ecliptic,
  Radians_Equatorial,
  Radians_Galactic,
  Radians_Horizontal,
  Radians_Parallactic,
} from "./angles";

export {
  ArcsecondsPerOrbit,
  ArcsecondsPerYear,
  DegreesPerDay,
  DegreesPerDayTT,
  DegreesPerHour,
  DegreesPerJulianCentury,
  DegreesPerJulianCenturyCubed,
  DegreesPerJulianCenturySquared,
  DegreesPerJulianYear,
  DegreesPerSecond,
  DegreesPerSecondSquared,
  DegreesPerSiderealDay,
  EclipticLongitudeRate,
  MicroarcsecondsPerYear,
  MilliarcsecondsPerYear,
  RadiansPerSiderealDay,
  RadiansPerTTSecond,
  RevolutionsPerMinute,
} from "./angular-rates";

/**
 * Coordinates and Reference Systems
 * Types for positional data tied to specific reference frames or epochs.
 */
export {
  Coordinates_FocalPlane,
  Coordinates_ITRF,
  Degrees_Ecliptic_J2000,
  Degrees_Ecliptic_MeanOfDate,
  Degrees_Equatorial_Geocentric,
  Degrees_Equatorial_Mean,
  Degrees_Galactic_IAU1958,
  Degrees_Horizontal_Observed,
  Degrees_ICRF,
} from "./coordinates";

/**
 * Time and Dates
 * Types for representing dates, epochs, and durations with time scale specificity.
 */
export { Epoch_B1950, Epoch_J2000 } from "./temporal/epochs";

export {
  AtomicSecondsSinceTAIEpoch,
  CoordinatedDaysSinceModifiedJulianEpoch,
  CoordinatedMillisecondsSinceUnixEpoch,
  CoordinatedSecondsSinceUnixEpoch,
  GPSSecondsSinceGPSEpoch,
  TerrestrialCenturiesSinceJ2000,
  TerrestrialDaysSinceJ2000,
  TerrestrialDaysSinceJulianEpoch,
  UniversalDaysSinceJ2000,
  UniversalDaysSinceJulianEpoch,
} from "./temporal/dates";

export {
  HoursDuration,
  JulianCenturiesDuration,
  JulianDaysDuration,
  JulianYearsDuration,
  MillisecondsDuration,
  MinutesDuration,
  SecondsDuration,
  SecondsDuration_GPS,
  SecondsDuration_TAI,
  SecondsDuration_TDB,
  SecondsDuration_TT,
} from "./temporal/durations";

/**
 * Distances and Scales
 * Types for length measurements across various astronomical scales.
 */
export {
  AstronomicalUnits,
  GravitationalRadii,
  HubbleLengths,
  Kilometers,
  Kiloparsecs,
  LightSeconds,
  LightTravelTimeSeconds,
  LightYears,
  LunarDistances,
  Meters,
  Parsecs,
  RedshiftZ,
  SolarRadii,
  WavelengthMeters,
} from "./distances";

/**
 * Physical Quantities
 * Types for mass, energy, temperature, and other physical measurements.
 */
export {
  Coulombs,
  EarthMasses,
  ElectronsPerCubicMeter,
  ElementalChargeFlux,
  Ergs,
  GCRS_Gravity,
  Hectopascal,
  Janskys,
  Joules,
  JupiterMasses,
  Kelvin,
  keV_Temperature,
  Kilograms,
  kWh,
  MetersPerSecondSquared,
  RedshiftVelocity,
  SolarIrradiance,
  SolarLuminosity,
  SolarMass,
  Strain,
  Tesla,
} from "./physical";

/**
 * Relativity
 * Types specific to relativistic effects and measurements.
 */
export { SecondsPerAstronomicalUnit, TimeDilationFactor } from "./relativity";

/**
 * Specialized Measurements
 * Types for domain-specific measurements, such as lunar observations.
 */
export { LunarLibrationAmplitude, SelenographicLatitude } from "./lunar";

/**
 * Dimensionless Quantities
 * Types for unitless ratios, fractions, and factors.
 */
export {
  DimensionlessRatio,
  GeometricAlbedo,
  IceMassFraction,
  Metallicity,
  ParsecsPerKilometer,
  PerJulianCentury,
  PlasmaBeta,
} from "./dimensionless";

/**
 * Dynamics and Rates
 * Types for various rates and changes, including velocity, mass and energy, fluxes, environmental conditions, and specialized rates.
 */
export { PerDegreeCelsius, PerHectopascal } from "./dynamics/environmental";
export { CosmicRayFlux, NeutrinoFluxRate, SFRDensity } from "./dynamics/fluxes";
export {
  keVPerSecond,
  KilogramsPerSecond,
  SolarMassesPerYear,
} from "./dynamics/mass-energy";
export {
  AtmospheresLossRate,
  DM_AnnihilationRate,
  HubbleFlowRate,
  MagnitudeDeclinePerMinute,
  MetallicityRate,
  MetersCubedPerSecondSquared,
  MillisecondsPerJulianCentury,
  SecondsPerOrbit,
} from "./dynamics/specialized";
export {
  AUPerSecond,
  FractionOfC,
  KilometersPerSecond,
  R_sPerSecond,
} from "./dynamics/velocity";
