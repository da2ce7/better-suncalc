/**
 * index.ts
 *
 * (better) SunCalc - A tiny sun and moon calculation library.
 *
 * Central export file for the astronomical calculation library.
 * Re-exports all types, constants, and functions from individual modules.
 */

/** Re-exports from utils.ts */
export {
  addUniqueJD,
  altitude,
  astroRefraction,
  azimuth,
  calculateCelestialPosition,
  computeDerivative,
  dateToJulian,
  DEFAULT_REFINEMENT,
  deltaT,
  EventWindow,
  findAltitudeCrossingEvents,
  generateEventSeeds,
  hoursLater,
  julianToDate,
  latitudeToRad,
  longitudeToRadWest,
  PositionData,
  refineEvent,
  RefinementConfig,
  siderealTime,
} from "./utils";

/** Re-exports from suncalc.ts */
export {
  addTime,
  getPosition,
  getSetJ,
  getTimes,
  hourAngle,
  solarDeclinationRate,
  sunCoords,
  TimesData,
} from "./suncalc";

/** Re-exports from mooncalc.ts */
export {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  MoonIlluminationData,
  MoonPositionData,
  MoonTimesData,
} from "./mooncalc";

/** Re-exports from solstice.ts */
export { getSolstices, SolsticeData } from "./solstice";

/** Re-exports from equinox.ts */
export { EquinoxData, getEquinoxes } from "./equinox";
