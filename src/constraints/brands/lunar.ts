/**
 * @file constraints/brands/lunar.ts
 * @description Branded types specific to lunar geometry and selenographic coordinates
 */

import { Brand } from "../types";

/**
 * Represents the angular amplitude of lunar libration - the apparent wobble
 * that allows observation of slightly more than 50% of the Moon's surface.
 *
 * @unit degrees
 * @range -7° to +7° (actual maximum ≈6.8°)
 * @reference IAU 2020 Selenographic Coordinates Report
 * @example
 * const maxOpticalLibration: LunarLibrationAmplitude = 6.8 as LunarLibrationAmplitude;
 * @see {@link https://planetarynames.wr.usgs.gov/Page/Moon1km} USGS Lunar Cartographic Standards
 */
export type LunarLibrationAmplitude = Brand<number, "LunarLibrationAmplitude">;

/**
 * Represents latitude in the Moon's coordinate system measured from the
 * lunar equator (0°) to poles (±90°), using the Mean Earth/Polar axis system.
 *
 * @unit degrees
 * @range -90° (South) to +90° (North)
 * @example const const apollo11Lat: SelenographicLatitude = 0.674_08 as SelenographicLatitude;
 * @see {@link https://doi.org/10.1007/s10569-007-9082-9} Archinal et al. 2011 Lunar Coordinate System
 */
export type SelenographicLatitude = Brand<number, "SelenographicLatitude">;
