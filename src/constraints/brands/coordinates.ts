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

import { ContextBrand, FrameBrand } from ".";

// ============= Celestial Reference Frames ============= //

/**
 * Represents equatorial coordinates in the International Celestial Reference Frame (ICRF),
 * aligned with extragalactic radio sources at J2000.0 epoch.
 * @example
 * const gaiaRa: Degrees_ICRF = 12.456 as Degrees_ICRF;
 */
export type Degrees_ICRF = FrameBrand<number, "ICRF">;

/**
 * Represents epoch-of-date equatorial coordinates in the "Mean Equator and Equinox" system.
 * @example
 * const telescopePointing: Degrees_Equatorial_Mean = 194.3 as Degrees_Equatorial_Mean;
 */
export type Degrees_Equatorial_Mean = FrameBrand<number, "MeanEquinox">;

// ============= Observed Coordinates ============= //

/**
 * Represents observed horizontal coordinates with atmospheric refraction.
.
 * @example
 * const observedAlt: Degrees_Horizontal_Observed = 34.5 as Degrees_Horizontal_Observed;
 */
export type Degrees_Horizontal_Observed = ContextBrand<
  number,
  "ObservedHorizontal"
>;

// ============= Ecliptic Coordinates ============= //

/**
 * Represents J2000.0 ecliptic coordinates (Earth's orbital plane at J2000 epoch).
 * @example
 * const jupiterEcliptic: Degrees_Ecliptic_J2000 = 159.3 as Degrees_Ecliptic_J2000;
 */
export type Degrees_Ecliptic_J2000 = FrameBrand<number, "Ecliptic_J2000">;

/**
 * Represents mean ecliptic coordinates adjusted via IAU 2006 precession.
 */
export type Degrees_Ecliptic_MeanOfDate = FrameBrand<
  number,
  "Ecliptic_MeanOfDate"
>;

// ============= Galactic Coordinates ============= //

/**
 * Represents galactic coordinates using IAU 1958 definition.
 * @example
 * const galacticCenter: Degrees_Galactic_IAU1958 = 0.0 as Degrees_Galactic_IAU1958;
 */
export type Degrees_Galactic_IAU1958 = FrameBrand<number, "Galactic_IAU1958">;

// ============= Terrestrial Coordinates ============= //

/**
 * Represents International Terrestrial Reference Frame (ITRF) coordinates.
 * @example
 * const spitzerPosition: Coordinates_ITRF = [-118.1, 34.2, 0.0] as Coordinates_ITRF;
 */
export type Coordinates_ITRF = FrameBrand<number[], "ITRF">;

/**
 * Represents geocentric equatorial coordinates (Earth-centered inertial).
 */
export type Degrees_Equatorial_Geocentric = FrameBrand<number, "Geocentric">;
//// ============= Instrument Coordinates ============= //

/**
 * Represents focal plane coordinates relative to optical axis.
 */

export type Coordinates_FocalPlane = FrameBrand<number[], "FocalPlane">;
