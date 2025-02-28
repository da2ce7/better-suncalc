/**
 * @file constraints/brands/physical.ts
 * @module physical
 * @description Branded type definitions for fundamental physical quantities.
 *
 * Covers mass, temperature, energy, charge, and related measurements specific to
 * astronomical contexts. Ensures type safety across different unit systems (SI vs CGS).
 *
 * @example
 * import { SolarMass, Kelvin, Tesla } from './physical';
 *
 * const sunMass: SolarMass = 1.0 as SolarMass;
 * const cmbTemp: Kelvin = 2.725 as Kelvin;
 * const neutronStarField: Tesla = 1e8 as Tesla;
 */

import { Brand } from "../types";

//  === Mass & Composition ===

/**
 * Represents mass in kilograms (SI base unit).
 * @example
 * const earthMassKg: Kilograms = 5.9722e24 as Kilograms;
 */
export type Kilograms = Brand<number, "Kilograms">;

/**
 * Represents mass in solar masses (M☉ = 1.98847e30 kg).
 * @example
 * const sagittariusA: SolarMass = 4.154e6 as SolarMass;
 */
export type SolarMass = Brand<number, "SolarMass">;

/**
 * Represents mass in Earth masses (M⊕ = 5.9722e24 kg).
 * @example
 * const kepler452b: EarthMasses = 5 as EarthMasses;
 */
export type EarthMasses = Brand<number, "EarthMasses">;

/**
 * Represents mass in Jupiter masses (M♃ = 1.898e27 kg).
 * @example
 * const hotJupiter: JupiterMasses = 0.63 as JupiterMasses;
 */
export type JupiterMasses = Brand<number, "JupiterMasses">;

//  === Dynamics ===

/**
 * Represents acceleration in meters per second squared.
 * @example
 * const earthGravity: MetersPerSecondSquared = 9.81 as MetersPerSecondSquared;
 */
export type MetersPerSecondSquared = Brand<number, "MetersPerSecondSquared">;

/**
 * Represents gravitational acceleration in the Geocentric Celestial Reference System.
 * Used for precise measurements in astrometry and celestial mechanics.
 * @example
 * const earthGCRS: GCRS_Gravity = 9.82 as GCRS_Gravity; // Approximate value at Earth's surface
 */
export type GCRS_Gravity = Brand<number, "GCRS_Gravity">;

//  === Thermodynamics ===

/**
 * Represents temperature in Kelvin.
 * @example
 * const solarCoreTemp: Kelvin = 15.7e6 as Kelvin;
 */
export type Kelvin = Brand<number, "Kelvin">;

/**
 * Represents temperature in kilo-electronvolts (1 keV ≈ 1.16e7 K).
 * @example
 * const clusterGasTemp: keV_Temperature = 8.0 as keV_Temperature;
 */
export type keV_Temperature = Brand<number, "keV_Temperature">;

//  === Energy & Power ===

/**
 * Represents energy in Joules (SI base unit).
 * @example
 * const solarLuminosityJ: Joules = 3.828e26 as Joules;
 */
export type Joules = Brand<number, "Joules">;

/**
 * Represents luminosity in solar luminosities (L☉ = 3.828e26 W).
 * @example
 * const betelgeuseLum: SolarLuminosity = 126_000 as SolarLuminosity;
 */
export type SolarLuminosity = Brand<number, "SolarLuminosity">;

/**
 * Represents flux density in Janskys (1 Jy = 1e-26 W/m²/Hz).
 * @example
 * const pulsarFlux: Janskys = 1.2 as Janskys;
 */
export type Janskys = Brand<number, "Janskys">;

//  === Plasma & Magnetism ===

/**
 * Represents magnetic field strength in Tesla (SI base unit).
 * @example
 * const sunspotField: Tesla = 0.3 as Tesla;
 */
export type Tesla = Brand<number, "Tesla">;

/**
 * Represents particle density in electrons per cubic meter.
 * @example
 * const ismDensity: ElectronsPerCubicMeter = 1e6 as ElectronsPerCubicMeter;
 */
export type ElectronsPerCubicMeter = Brand<number, "ElectronsPerCubicMeter">;

/**
 * Represents plasma beta (ratio of thermal to magnetic pressure).
 * @example
 * const coronalLoopsBeta: PlasmaBeta = 0.01 as PlasmaBeta;
 */
export type PlasmaBeta = Brand<number, "PlasmaBeta">;

//  === Quantum & Relativity ===

/**
 * Represents gravitational wave strain (ΔL/L ≈ 1e-21).
 * @example
 * const ligoDetection: Strain = 1e-21 as Strain;
 */
export type Strain = Brand<number, "Strain">;

/**
 * Represents charge in Coulombs (SI base unit).
 * @example
 * const cosmicRayProton: Coulombs = 1.602e-19 as Coulombs;
 */
export type Coulombs = Brand<number, "Coulombs">;

/**
 * Represents redshift velocity (z = v/c for non-relativistic).
 * @example
 * const recessionVelocity: RedshiftVelocity = 0.05 as RedshiftVelocity; // 15,000 km/s
 */
export type RedshiftVelocity = Brand<number, "RedshiftVelocity">;

//  === Historical & Instrument ===

/**
 * Represents energy in ergs (CGS unit, 1 erg = 1e-7 J).
 * @example
 * const supernovaEnergy: Ergs = 1e51 as Ergs;
 */
export type Ergs = Brand<number, "Ergs">;

/**
 * Represents charge in elementary charges (1 e ≈ 1.602e-19 C).
 * @example
 * const solarWindFlow: ElementalChargeFlux = 1e8 as ElementalChargeFlux;
 */
export type ElementalChargeFlux = Brand<number, "ElementalChargeFlux">;

/**
 * Represents battery capacity in kilowatt-hours (instrumentation).
 * @example
 * const roverBattery: kWh = 1.35 as kWh;
 */
export type kWh = Brand<number, "kWh">;

//  === Composition Metrics ===

/**
 * Represents metallicity relative to solar ([Fe/H] ≤ 0).
 * @example
 * const haloStarMetal: Metallicity = -2.5 as Metallicity;
 */
export type Metallicity = Brand<number, "Metallicity">;

/**
 * Represents water-ice fraction by mass.
 * @example
 * const enceladusOcean: IceMassFraction = 0.8 as IceMassFraction;
 */
export type IceMassFraction = Brand<number, "IceMassFraction">;

/**
 * Represents solar irradiance (Watts per square meter).
 * @example
 * const earthSolarConstant: SolarIrradiance = 1361 as SolarIrradiance;
 */
export type SolarIrradiance = Brand<number, "SolarIrradiance">;

/**
 * Represents atmospheric pressure in hectopascals (1 hPa = 100 Pa = 1 mbar).
 * @example
 * const marsSurfacePressure: Hectopascal = 6.1 as Hectopascal; // ~0.6% of Earth's
 */
export type Hectopascal = Brand<number, "Hectopascal">;
