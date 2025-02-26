/*
  index.ts

  (better) SunCalc - A tiny sun and moon calculation library.
*/

export { toDays } from "./utils";

export {
  addTime,
  altitude,
  approxTransit,
  astroRefraction,
  azimuth,
  declination,
  eclipticLongitude,
  getPosition,
  getSetJ,
  getTimes,
  hourAngle,
  julianCycle,
  PositionData,
  rightAscension,
  siderealTime,
  solarMeanAnomaly,
  solarTransitJ,
  sunCoords,
  TimesData,
} from "./suncalc";

export {
  getMoonIllumination,
  getMoonPosition,
  getMoonTimes,
  moonCoords,
  MoonIlluminationData,
  MoonPositionData,
  MoonTimesData,
} from "./mooncalc";

export { getSolstices, SolsticeData } from "./solstice";

export { EquinoxData, getEquinoxes } from "./equinox";
