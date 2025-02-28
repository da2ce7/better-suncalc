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
 * const altitude: Altitude = (Math.PI/4) as Altitude; // 45 degrees above horizon
 */
export type Altitude = Brand<number, "Altitude">;

/**
 * Represents an azimuth angle (compass direction) in radians.
 * @example
 * const azimuth: Azimuth = (Math.PI/2) as Azimuth; // 90° (East)
 */
export type Azimuth = Brand<number, "Azimuth">;

/**
 * Represents a parallactic angle in radians (angle between celestial object's
 * hour circle and vertical circle).
 * @example
 * const parallacticAngle: ParallacticAngle = 0.45 as ParallacticAngle;
 */
export type ParallacticAngle = Brand<number, "ParallacticAngle">;
