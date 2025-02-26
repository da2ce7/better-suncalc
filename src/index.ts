/**
 * index.ts
 *
 * (better) SunCalc - A tiny sun and moon calculation library.
 *
 * Central export file for the astronomical calculation library.
 * Re-exports all types, constants, and functions from individual modules.
 */

/** Re-exports from constants.ts */
export {
  acos,
  asin,
  atan2,
  CONVERGENCE_TOLERANCE,
  CONVERGENCE_WINDOW,
  cos,
  DAY_IN_MS,
  DEFAULT_WINDOW_SIZE_DAYS,
  DEGREE_IN_RADIANS,
  DERIVATIVE_DELTA_DAYS,
  EARTH_OBLIQUITY_J2000,
  EARTH_PERIHELION,
  EQUATION_OF_CENTER_COEFFS,
  HOUR_IN_MS,
  J0,
  J1970,
  J2000,
  NUMERICAL_STABILITY_EPS,
  PI,
  REFERENCE_EQUINOX_JD,
  REFERENCE_SUMMER_JD,
  REFRACTION_OPTIONS,
  SIDEREAL_TIME_PARAMS,
  sin,
  SOLAR_ALTITUDE,
  SOLAR_ANOMALY,
  SOLAR_TRANSIT_COEFFS,
  tan,
  TIME_EQUALITY_EPS,
  TROPICAL_YEAR,
} from "./constants";

/** Re-exports from utils.ts */
export {
  addUniqueJD,
  altitude,
  astroRefraction,
  azimuth,
  calculateCelestialPosition,
  CelestialCoords,
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
  solarDeclinationRate,
  toDays,
} from "./utils";

/** Re-exports from suncalc.ts */
export {
  addTime,
  approxTransit,
  declination,
  eclipticLongitude,
  getPosition,
  getSetJ,
  getTimes,
  hourAngle,
  julianCycle,
  rightAscension,
  solarMeanAnomaly,
  solarTransitJ,
  sunCoords,
  TimesData,
} from "./suncalc";

/** Re-exports from mooncalc.ts */
export {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  moonCoords,
  MoonIlluminationData,
  MoonPositionData,
  MoonTimesData,
} from "./mooncalc";

/** Re-exports from solstice.ts */
export { getSolstices, SolsticeData } from "./solstice";

/** Re-exports from equinox.ts */
export { EquinoxData, getEquinoxes } from "./equinox";
