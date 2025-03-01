/**
 * @file constraints/brands/angles.ts
 * @module angles
 * @description Branded type definitions for angular measurements and astronomical coordinate systems.
 *
 * This module provides nominal typing for angle values to prevent accidental mixing of different
 * angular units (degrees vs radians) and coordinate system contexts (ecliptic vs equatorial vs
 * galactic coordinates). All types are branded numbers ensuring type-safe angular calculations.
 *
 * @note All angles use right-handed coordinate systems. For instrument-specific angle representations
 * (e.g., telescope focal plane coordinates), create additional branded types extending this pattern.
 */

import { Brand } from "../types";

/**
 * Represents an angle in degrees (360° in a full circle).
 * @example
 * const latitude: Degrees = 34.05 as Degrees;
 */
export type Degrees = Brand<number, "Degrees">;

/**
 * Represents an angle in radians (2π radians in a full circle).
 * @example
 * const piOverTwo: Radians = (Math.PI / 2) as Radians;
 */
export type Radians = Brand<number, "Radians">;

/**
 * Represents an angle in arcminutes (1/60th of a degree).
 * @example
 * const precision: Arcminutes = 2.5 as Arcminutes;
 */
export type Arcminutes = Brand<number, "Arcminutes">;

/**
 * Represents an angle in arcseconds (1/60th of an arcminute).
 * @example
 * const parallax: Arcseconds = 0.768 as Arcseconds;
 */
export type Arcseconds = Brand<number, "Arcseconds">;

/**
 * Represents an angle in degrees relative to the ecliptic coordinate system
 * (Earth's orbital plane around the Sun).
 * @example
 * const eclipticLatitude: Degrees_Ecliptic = 23.4 as Degrees_Ecliptic;
 */
export type Degrees_Ecliptic = Brand<number, "Degrees_Ecliptic">;

/**
 * Represents an angle in degrees relative to the equatorial coordinate system
 * (projection of Earth's equator and rotation axis onto the celestial sphere).
 * @example
 * const rightAscension: Degrees_Equatorial = 12.34 as Degrees_Equatorial;
 */
export type Degrees_Equatorial = Brand<number, "Degrees_Equatorial">;

/**
 * Represents an angle in degrees relative to the galactic coordinate system
 * (Milky Way galaxy's fundamental plane centered on the Sun).
 * @example
 * const galacticLongitude: Degrees_Galactic = 142.6 as Degrees_Galactic;
 */
export type Degrees_Galactic = Brand<number, "Degrees_Galactic">;

/**
 * Represents an angle in degrees relative to the horizontal coordinate system
 * (observer's local horizon for altitude/azimuth measurements).
 * @example
 * const horizonAltitude: Degrees_Horizontal = 45.0 as Degrees_Horizontal;
 */
export type Degrees_Horizontal = Brand<number, "Degrees_Horizontal">;

/**
 * Represents an elevation angle above the horizon in degrees.
 * @example
 * const altitude: Degrees_Altitude = 45 as Degrees_Altitude; // (Math.PI/4) above horizon
 */
export type Degrees_Altitude = Brand<number, "Degrees_Altitude">;

/**
 * Represents an azimuth angle (compass direction) in degrees.
 * @example
 * const azimuth: Degrees_Azimuth = 90 as Degrees_Azimuth; // Math.PI/2 (East)
 */
export type Degrees_Azimuth = Brand<number, "Degrees_Azimuth">;

/**
 * Represents a parallactic angle in degrees (angle between celestial object's
 * hour circle and vertical circle).
 * @example
 * const parallacticAngle: Degrees_Parallactic = 22.5 as Degrees_Parallactic;
 */
export type Degrees_Parallactic = Brand<number, "Degrees_Parallactic">;

/**
 * Represents an angle in radians relative to the ecliptic coordinate system
 * (Earth's orbital plane around the Sun).
 * @example
 * const eclipticLongitude: Radians_Ecliptic = 2.34 as Radians_Ecliptic;
 */
export type Radians_Ecliptic = Brand<number, "Radians_Ecliptic">;

/**
 * Represents an angle in radians relative to the equatorial coordinate system
 * (Earth's rotation axis projection onto the celestial sphere).
 * @example
 * const declination: Radians_Equatorial = 0.12 as Radians_Equatorial;
 */
export type Radians_Equatorial = Brand<number, "Radians_Equatorial">;

/**
 * Represents an angle in radians relative to the galactic coordinate system
 * (Milky Way's fundamental plane).
 * @example
 * const galacticLongitude: Radians_Galactic = 4.71 as Radians_Galactic;
 */
export type Radians_Galactic = Brand<number, "Radians_Galactic">;

/**
 * Represents an angle in radians relative to the horizontal coordinate system
 * (observer-specific local horizon system).
 * @example
 * const azimuthHorizontal: Radians_Horizontal = 1.57 as Radians_Horizontal;
 */
export type Radians_Horizontal = Brand<number, "Radians_Horizontal">;

/**
 * Represents an elevation angle above the horizon in radians.
 * @example
 * const altitude: Radians_Altitude = (Math.PI/4) as Radians_Altitude; // 45 degrees above horizon
 */
export type Radians_Altitude = Brand<number, "Radians_Altitude">;

/**
 * Represents an azimuth angle (compass direction) in radians.
 * @example
 * const azimuth: Radians_Azimuth = (Math.PI/2) as Radians_Azimuth; // 90° (East)
 */
export type Radians_Azimuth = Brand<number, "Radians_Azimuth">;

/**
 * Represents a parallactic angle in radians (angle between celestial object's
 * hour circle and vertical circle).
 * @example
 * const parallacticAngle: Radians_Parallactic = (Math.PI/8) as Radians_Parallactic;
 */
export type Radians_Parallactic = Brand<number, "Radians_Parallactic">;
