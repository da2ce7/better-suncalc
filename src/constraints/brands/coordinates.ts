/**
 * @file constraints/brands/coordinates.ts
 * @module coordinates
 * @description Branded type definitions for standard astronomical coordinate systems and reference frames.
 *
 * These types refine base angular measurements (degrees/radians) with explicit coordinate system/epoch context,
 * preventing accidental mixing of fundamentally incomparable spatial references (e.g., J2000 vs epoch-of-date coordinates).
 *
 * Reference Frames:
 * - **ICRF**: Inertial frame aligned with distant quasars (J2000.0 Equatorial)
 * - **Mean Equator**: Dynamic frame adjusted for precession/nutation (epoch-of-date)
 * - **Observed Horizontal**: Topocentric Alt/Az including atmospheric refraction
 */

import { Brand } from "../types";
import { Degrees_Equatorial } from "./angles";

/**
 * Represents equatorial coordinates in the International Celestial Reference Frame (ICRF),
 * aligned with extragalactic radio sources at J2000.0 epoch. This inertial frame forms the
 * basis for modern star catalogs like Gaia DR3.
 *
 * @see {@link https://www.iers.org/IERS/EN/Science/ICRF/icrf.html}
 * @example
 * const gaiaRa: Degrees_ICRF = 12.456 as Degrees_ICRF;
 */
export type Degrees_ICRF = Brand<number, "ICRF">;

/**
 * Represents epoch-of-date equatorial coordinates in the "Mean Equator and Equinox" system,
 * incorporating luni-solar precession and planetary nutation. Used for most observational
 * astronomy workflow steps (telescope pointing, visible star catalogs).
 *
 * @see IAU 2006 Precession Model
 * @example
 * const telescopePointing: Degrees_MeanEquator = 194.3 as Degrees_MeanEquator;
 */
export type Degrees_MeanEquator = Brand<number, "MeanEquinox">;

/**
 * Represents observed horizontal (alt/az) coordinates with atmospheric refraction applied.
 * Values represent the apparent position visible through an optical system under local
 * atmospheric conditions (temperature, pressure, humidity).
 *
 * @see Saemundsson Refraction Formula
 * @example
 * const observedAlt: Degrees_ObservedHorizontal = 34.5 as Degrees_ObservedHorizontal;
 */
export type Degrees_ObservedHorizontal = Brand<number, "Observed">;

// ============= Ecliptic Coordinates ============= //

/**
 * Represents ecliptic coordinates in the J2000.0 reference frame (Earth's orbital plane
 * at J2000 epoch, IERS Conventions 2003). Primary use case: solar system object tracking.
 *
 * @example
 * const jupiterEcliptic: Degrees_Ecliptic_J2000 = 159.3 as Degrees_Ecliptic_J2000;
 */
export type Degrees_Ecliptic_J2000 = Brand<number, "Ecliptic_J2000">;

/**
 * Represents mean ecliptic coordinates adjusted to current epoch via IAU 2006 precession.
 * Used for high-precision solar system dynamics (e.g., satellite ecliptic node analysis).
 */
export type Degrees_Ecliptic_MeanOfDate = Brand<number, "Ecliptic_MeanOfDate">;

// ============= Galactic Coordinates ============= //

/**
 * Represents galactic coordinates in ICRS-aligned frame (IAU 1958 definition),
 * with galactic center at l=0°, b=0°. Standard for Milky Way structure studies.
 *
 * @example
 * const galacticCenter: Degrees_Galactic_IAU1958 = 0.0 as Degrees_Galactic_IAU1958;
 */
export type Degrees_Galactic_IAU1958 = Brand<number, "Galactic_IAU1958">;

// ============= Terrestrial Coordinates ============= //

/**
 * Represents International Terrestrial Reference Frame (ITRF) coordinates,
 * Earth-fixed cartesian system with plate tectonic motion over time.
 * Used for GNSS and spacecraft localization relative to Earth's surface.
 *
 * @see {@link https://itrf.ign.fr/}
 * @example
 * const spitzerPosition: Degrees_ITRF = [-118.1, 34.2, 0.0] as Degrees_ITRF;
 */
export type Degrees_ITRF = Brand<number[], "ITRF">;

/**
 * Represents GEOCENTRIC equatorial coordinates (Earth-centered inertial),
 * commonly used for satellite orbit calculations.
 */
export type Degrees_GeocentricEquatorial = Brand<
  Degrees_Equatorial,
  "Geocentric"
>;

// ============= Sensor-Specific Coordinates ============= //

/**
 * Represents focal plane coordinates for a telescope instrument (mm relative to optical axis).
 * Instrument-specific implementations should subtype this (e.g., JWST_NIRCam_FocalPlane).
 */
export type FocalPlaneCoordinates = Brand<number[], "FocalPlane">;
