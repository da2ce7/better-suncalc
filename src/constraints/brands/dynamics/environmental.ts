/**
 * @file constraints/brands/dynamics/environmental.ts
 * @description Branded types for environmental rate measurements in astronomical computations.
 *
 * This file provides types for rates that describe changes in environmental conditions,
 * such as temperature or pressure, over time or other dimensions. These types ensure
 * that environmental rates are handled correctly and consistently in calculations.
 */

import { Brand } from "../../types";

/**
 * Represents inverse temperature coefficients in degrees Celsius (1/°C).
 * Used for thermal dependency terms in atmospheric and instrument models.
 *
 * @unit 1/°C (per degree Celsius)
 * @example
 * // Bennett 2023 refraction model's temperature dependency
 * const tempCoeff: PerDegreeCelsius = 0.00409215 as PerDegreeCelsius;
 *
 */
export type PerDegreeCelsius = Brand<number, "PerCelsius">;

/**
 * Represents inverse pressure relationships in hectopascals (1/hPa).
 * Used for atmospheric pressure normalization in refraction/absorption models.
 *
 * @unit 1/hPa (per hectopascal)
 * @example
 * // Pressure scaling factor in modern refraction models
 * const pressureNorm: PerHectopascal = 0.939116 as PerHectopascal;
 *
 */
export type PerHectopascal = Brand<number, "PerHectopascal">;
