/**
 * @file constraints/brands/dimensionless.ts
 * @module dimensionless
 * @description Branded types for unitless ratios and proportional relationships
 */

import { Brand } from "../types";

/**
 * Represents a unitless scalar ratio between two quantities of identical dimensionality.
 * Used for coefficients, scaling factors, and proportional relationships where
 * explicit unit tracking isn't required but type safety is critical.
 *
 * @unit dimensionless (pure scalar)
 * @example
 * // Earth's flattening factor (WGS84)
 * const EARTH_FLATTENING = 1/298.257222101 as DimensionlessRatio;
 *
 * // Orbital eccentricity of Venus
 * const VENUS_ECCENTRICITY = 0.0067 as DimensionlessRatio;
 *
 * @see {@link https://www.iso.org/standard/31888.html ISO 80000-1:2009 Quantities and units}
 */
export type DimensionlessRatio = Brand<number, "DimensionlessRatio">;

/**
 * Represents metallicity relative to solar composition ([Fe/H] scale).
 * Negative values indicate fewer heavy elements than Sun's photosphere.
 *
 * @unit dimensionless (logarithmic ratio)
 * @example
 * // Halo population star
 * const HALO_STAR_METAL: Metallicity = -2.5 as Metallicity;
 *
 * // Solar twin composition
 * const SOLAR_TWIN_METAL: Metallicity = 0.0 as Metallicity;
 *
 * @see {@link https://www.iau.org/public/themes/measuring/ | IAU Composition Standards}
 */
export type Metallicity = Brand<number, "Metallicity">;

/**
 * Represents plasma beta (β) - ratio of thermal to magnetic pressure
 * in astrophysical plasmas. Critical for magnetospheric studies.
 *
 * @unit dimensionless
 * @example
 * // Solar coronal loops
 * const CORONAL_LOOPS_BETA: PlasmaBeta = 0.01 as PlasmaBeta;
 *
 * // Intergalactic medium
 * const INTERGALACTIC_BETA: PlasmaBeta = 100 as PlasmaBeta;
 *
 * @see {@link https://doi.org/10.1086/421881 | Plasma Beta in Space Physics}
 */
export type PlasmaBeta = Brand<number, "PlasmaBeta">;

/**
 * Represents water-ice fraction by mass in planetary bodies.
 * Critical for icy moon and Kuiper belt object characterization.
 *
 * @unit dimensionless (0-1 scale)
 * @example
 * // Enceladus' subsurface ocean
 * const ENCELADUS_ICE: IceMassFraction = 0.8 as IceMassFraction;
 *
 * // Lunar surface regolith
 * const LUNAR_SURFACE_ICE: IceMassFraction = 0.02 as IceMassFraction;
 *
 * @see {@link https://doi.org/10.1029/2020JE006711 | Icy World Composition Analysis}
 */
export type IceMassFraction = Brand<number, "IceMassFraction">;

/**
 * Represents the geometric albedo of a celestial body - the ratio of its actual brightness
 * at zero phase angle (opposition) to that of an idealized perfectly diffusing disk with
 * the same cross-sectional area.
 *
 * @unit dimensionless (0 = non-reflective, 1 = perfect reflector)
 * @example
 * // Europa's high reflectivity
 * const EUROPA_ALBEDO = 0.64 as GeometricAlbedo;
 *
 * // Venus' thick cloud coverage
 * const VENUS_ALBEDO = 0.67 as GeometricAlbedo;
 *
 * // Moon's dark basaltic surface
 * const LUNAR_ALBEDO = 0.12 as GeometricAlbedo;
 *
 * @see {@link https://doi.org/10.1006/icar.2002.6857 | Planetary Albedo Standards}
 */
export type GeometricAlbedo = Brand<number, "GeometricAlbedo">;

/**
 * Represents a dimensionless rate of change per Julian century (36,525 days),
 * used for secular variations in astronomical elements and parameters.
 *
 * @unit century⁻¹ (inverse Julian centuries)
 * @description Models long-term evolutionary rates in orbital elements,
 *            geophysical parameters, and other non-angular quantities
 *            where the change per century needs explicit type safety.
 *
 * @example
 * // Earth's obliquity secular decrease rate
 * const obliquityRate = -0.013_969_4 as PerJulianCentury; // From La2010 solution
 *
 * @example
 * // Lunar eccentricity rate from DE440 ephemeris
 * const lunarEccentricityRate = 0.000_046_42 as PerJulianCentury;
 *
 * @see {@link https://ssd.jpl.nasa.gov/planets/eph_export.html} JPL Ephemeris Rate Definitions
 */
export type PerJulianCentury = Brand<number, "PerJulianCentury">;

/**
 * Represents spacecraft/orbital perspective angular rate.
 * @example
 * const transverseVelocity: ParsecsPerKilometer = 0.326 as ParsecsPerKilometer; // Perspective effect scaling
 */
export type ParsecsPerKilometer = Brand<number, "ParsecsPerKilometer">;
