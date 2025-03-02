/**
 * @file constraints/types.ts
 * @description Branded types for unit-specific constants to ensure type safety and prevent unit mismatches.
 */

import { AstronomicalUnits, Degrees } from './brands'

export type Brand<T, Tag> = { readonly _: Tag; value: T }

/**
 * Represents orbital parameters for celestial bodies.
 * @interface OrbitalParameters
 * @property {number} eccentricity - Eccentricity of the orbit (unitless).
 * @property {Degrees} inclination - Inclination of the orbit in degrees.
 * @property {AstronomicalUnits} semiMajorAxis - Semi-major axis of the orbit in AstronomicalUnits.
 */
export interface OrbitalParameters {
    eccentricity: number // Unitless
    inclination: Degrees
    semiMajorAxis: AstronomicalUnits
}
