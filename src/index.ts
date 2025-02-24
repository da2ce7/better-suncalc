/*
  index.ts

  (better) SunCalc
*/

export {
  cos,
  dayMs,
  e,
  J0,
  J1970,
  J2000,
  PI,
  rad,
  sin,
  tan,
} from "./constants";

export { fromJulian, hoursLater, toDays, toJulian } from "./utils";

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
